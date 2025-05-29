import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all failed jobs
    const { data: failedJobs, error: jobsError } = await supabase
      .from('scraping_jobs')
      .select('company_id')
      .eq('status', 'failed');

    if (jobsError) throw jobsError;

    // Reset failed jobs to pending
    const { error: updateError } = await supabase
      .from('scraping_jobs')
      .update({
        status: 'pending',
        error: null,
        next_scheduled: new Date().toISOString()
      })
      .eq('status', 'failed');

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Reset ${failedJobs?.length || 0} failed jobs to pending`
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
      JSON.stringify({ error: error.message }),
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