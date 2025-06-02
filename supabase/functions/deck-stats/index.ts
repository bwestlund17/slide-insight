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

    // Get deck stats
    const { data: deckStats, error: statsError } = await supabase
      .from('ma_decks')
      .select(`
        id,
        title,
        download_count,
        rating,
        rating_count
      `)
      .order('download_count', { ascending: false })
      .limit(10);

    if (statsError) throw statsError;

    // Get category counts
    const { data: categoryStats, error: categoryError } = await supabase
      .from('ma_decks')
      .select('category, count(*)')
      .group('category');

    if (categoryError) throw categoryError;

    // Get tag counts
    const { data: tagStats, error: tagError } = await supabase
      .from('ma_deck_tags')
      .select('tag, count(*)')
      .group('tag')
      .order('count', { ascending: false })
      .limit(20);

    if (tagError) throw tagError;

    return new Response(
      JSON.stringify({
        topDecks: deckStats,
        categories: categoryStats,
        topTags: tagStats
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