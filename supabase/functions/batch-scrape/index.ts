import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const BATCH_SIZE = 50; // Reduced from 100 to 50 for better reliability
const MAX_CONCURRENT_JOBS = 10; // Reduced from 20 to 10 for better stability
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

async function processScrapeJob(supabase: any, job: any, retryCount = 0) {
  try {
    // Update job status to in_progress
    await supabase
      .from('scraping_jobs')
      .update({ 
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', job.id);

    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/scrape-company`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({ companyId: job.company_id })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to scrape company: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return processScrapeJob(supabase, job, retryCount + 1);
    }

    // Update job status to failed after all retries
    await supabase
      .from('scraping_jobs')
      .update({ 
        status: 'failed',
        completed_at: new Date().toISOString(),
        error: error.message
      })
      .eq('id', job.id);

    throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get companies that need scraping
    const { data: jobs, error: jobsError } = await supabase
      .from('scraping_jobs')
      .select('id, company_id')
      .eq('status', 'pending')
      .order('next_scheduled', { ascending: true })
      .limit(BATCH_SIZE);

    if (jobsError) {
      throw new Error('Failed to fetch jobs');
    }

    // Process jobs in smaller concurrent batches
    const results = [];
    for (let i = 0; i < jobs.length; i += MAX_CONCURRENT_JOBS) {
      const batch = jobs.slice(i, i + MAX_CONCURRENT_JOBS);
      const batchResults = await Promise.allSettled(
        batch.map(job => processScrapeJob(supabase, job))
      );
      results.push(...batchResults);

      // Add a small delay between batches to prevent overwhelming the system
      if (i + MAX_CONCURRENT_JOBS < jobs.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: jobs.length,
        results
      }),
      { 
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});