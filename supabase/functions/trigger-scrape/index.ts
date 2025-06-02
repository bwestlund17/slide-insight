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

    // Get all companies that don't have any scraping jobs or only have completed/failed jobs
    const { data: companies, error: companyError } = await supabase
      .from('companies')
      .select(`
        id,
        name,
        symbol,
        scraping_jobs!left (
          id,
          status
        )
      `)
      .or('scraping_jobs.status.is.null,scraping_jobs.status.in.(success,failed)')
      .order('created_at', { ascending: true })
      .limit(1);

    if (companyError || !companies || companies.length === 0) {
      throw new Error('No companies available for scraping');
    }

    const company = companies[0];

    // Delete any existing failed jobs for this company
    await supabase
      .from('scraping_jobs')
      .delete()
      .eq('company_id', company.id)
      .in('status', ['failed', 'success']);

    // Create new scraping job
    const { error: jobError } = await supabase
      .from('scraping_jobs')
      .insert({
        company_id: company.id,
        status: 'pending'
      });

    if (jobError) {
      throw jobError;
    }

    // Trigger scraping
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/scrape-company`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companyId: company.id })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to trigger scrape: ${errorText}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Started scraping for ${company.name}`,
        company
      }),
      { 
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
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