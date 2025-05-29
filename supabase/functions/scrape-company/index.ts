import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { companyId } = body;

    if (!companyId) {
      throw new Error('Company ID is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get company details
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (companyError || !company) {
      throw new Error('Company not found');
    }

    // Update job status to in_progress
    await supabase
      .from('scraping_jobs')
      .update({ 
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('company_id', companyId);

    // Create a mock presentation
    const presentation = {
      company_id: companyId,
      company_symbol: company.symbol,
      title: `${company.name} Latest Investor Presentation`,
      date: new Date().toISOString(),
      url: `${company.ir_url}/presentation.pdf`,
      file_type: 'pdf',
      slide_count: 30,
      view_count: 0
    };

    // Insert presentation
    const { error: insertError } = await supabase
      .from('presentations')
      .insert([presentation]);

    if (insertError) {
      throw insertError;
    }

    // Update job to success
    const nextScheduled = new Date();
    nextScheduled.setHours(nextScheduled.getHours() + 24);

    await supabase
      .from('scraping_jobs')
      .update({ 
        status: 'success',
        completed_at: new Date().toISOString(),
        presentations_found: 1,
        next_scheduled: nextScheduled.toISOString()
      })
      .eq('company_id', companyId);

    return new Response(
      JSON.stringify({ 
        success: true,
        presentations_found: 1,
        next_scheduled: nextScheduled.toISOString()
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

    try {
      const { companyId } = await req.json();
      if (companyId) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        await supabase
          .from('scraping_jobs')
          .update({ 
            status: 'failed',
            completed_at: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('company_id', companyId);
      }
    } catch (updateError) {
      console.error('Failed to update job status:', updateError);
    }

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