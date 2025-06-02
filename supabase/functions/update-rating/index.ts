import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }

  try {
    const { deckId, rating } = await req.json();
    
    if (!deckId) {
      throw new Error('Deck ID is required');
    }
    
    if (rating === undefined || rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Call the RPC function to update the rating
    const { data, error } = await supabase.rpc('update_deck_rating', {
      deck_id: deckId,
      new_rating: rating
    });

    if (error) throw error;
    
    // Get the updated deck
    const { data: updatedDeck, error: deckError } = await supabase
      .from('ma_decks')
      .select('rating, rating_count')
      .eq('id', deckId)
      .single();
      
    if (deckError) throw deckError;

    return new Response(
      JSON.stringify({
        success: true,
        rating: updatedDeck.rating,
        ratingCount: updatedDeck.rating_count
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