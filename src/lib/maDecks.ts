import { supabase } from './supabase';
import { getSignedUrl, getPublicUrl } from './storage';
import { MaDeck, MaSlide } from '../types';

// Function to fetch ma_decks with optional filters
export async function fetchMaDecks({
  limit = 20,
  offset = 0,
  category = null,
  dealType = null,
  searchQuery = '',
  sortBy = 'popular',
  sortDirection = 'desc'
}: {
  limit?: number;
  offset?: number;
  category?: string | null;
  dealType?: string | null;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}) {
  try {
    let query = supabase
      .from('ma_decks')
      .select(`
        *,
        ma_deck_tags!inner (
          tag
        ),
        user_favorites (
          user_id
        )
      `, { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (dealType) {
      query = query.eq('deal_type', dealType);
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,ma_deck_tags.tag.ilike.%${searchQuery}%`);
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        query = query.order('download_count', { ascending: sortDirection === 'asc' });
        break;
      case 'recent':
        query = query.order('created_at', { ascending: sortDirection === 'asc' });
        break;
      case 'rating':
        query = query.order('rating', { ascending: sortDirection === 'asc' });
        break;
      case 'title':
        query = query.order('title', { ascending: sortDirection === 'asc' });
        break;
      case 'slides':
        query = query.order('slide_count', { ascending: sortDirection === 'asc' });
        break;
      default:
        query = query.order('download_count', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Check if the user is logged in to determine favorites
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Transform the data to match the MaDeck type
    const transformedData: MaDeck[] = await Promise.all((data || []).map(async (deck) => {
      // Get thumbnail URL
      let thumbnailUrl = deck.thumbnail_url;
      if (deck.thumbnail_storage_path) {
        thumbnailUrl = await getPublicUrl(deck.thumbnail_storage_path);
      }

      return {
        id: deck.id,
        title: deck.title,
        category: deck.category,
        subcategory: deck.subcategory || undefined,
        description: deck.description || '',
        thumbnailUrl,
        slideCount: deck.slide_count,
        downloadCount: deck.download_count,
        rating: deck.rating,
        ratingCount: deck.rating_count,
        format: deck.file_formats || ['PowerPoint'],
        fileSize: deck.file_size || '5MB',
        createdAt: deck.created_at,
        updatedAt: deck.updated_at,
        isNew: new Date(deck.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days
        isPremium: deck.is_premium,
        isFeatured: deck.is_featured,
        isPopular: deck.is_popular,
        isFavorite: userId ? deck.user_favorites.some((fav: any) => fav.user_id === userId) : false,
        slides: [], // We'll fetch slides separately
        tags: deck.ma_deck_tags.map((tag: any) => tag.tag),
        company: deck.company_name ? {
          name: deck.company_name,
          logo: deck.company_logo_url || ''
        } : undefined,
        dealValue: deck.deal_value,
        dealDate: deck.deal_date,
        dealType: deck.deal_type
      };
    }));

    return { data: transformedData, count };
  } catch (error) {
    console.error('Error fetching M&A decks:', error);
    throw error;
  }
}

// Function to fetch a single M&A deck by ID
export async function fetchMaDeckById(id: string) {
  try {
    // Fetch the deck
    const { data: deck, error: deckError } = await supabase
      .from('ma_decks')
      .select(`
        *,
        ma_deck_tags (
          tag
        ),
        user_favorites (
          user_id
        )
      `)
      .eq('id', id)
      .single();

    if (deckError) throw deckError;
    if (!deck) throw new Error('Deck not found');

    // Fetch the slides
    const { data: slides, error: slidesError } = await supabase
      .from('ma_slides')
      .select('*')
      .eq('deck_id', id)
      .order('slide_number', { ascending: true });

    if (slidesError) throw slidesError;

    // Check if the user is logged in to determine favorites
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Get thumbnail URL
    let thumbnailUrl = deck.thumbnail_url;
    if (deck.thumbnail_storage_path) {
      thumbnailUrl = await getPublicUrl(deck.thumbnail_storage_path);
    }

    // Transform slides data and get signed URLs
    const transformedSlides: MaSlide[] = await Promise.all((slides || []).map(async (slide) => {
      let imageUrl = slide.image_url;
      if (slide.storage_path) {
        // Use signed URLs for premium content, public URLs for free content
        if (deck.is_premium) {
          imageUrl = await getSignedUrl(slide.storage_path);
        } else {
          imageUrl = await getPublicUrl(slide.storage_path);
        }
      }

      return {
        id: slide.id,
        deckId: slide.deck_id,
        slideNumber: slide.slide_number,
        imageUrl,
        title: slide.title,
        description: slide.description
      };
    }));

    // Transform the deck data
    const transformedDeck: MaDeck = {
      id: deck.id,
      title: deck.title,
      category: deck.category,
      subcategory: deck.subcategory || undefined,
      description: deck.description || '',
      thumbnailUrl,
      slideCount: deck.slide_count,
      downloadCount: deck.download_count,
      rating: deck.rating,
      ratingCount: deck.rating_count,
      format: deck.file_formats || ['PowerPoint'],
      fileSize: deck.file_size || '5MB',
      createdAt: deck.created_at,
      updatedAt: deck.updated_at,
      isNew: new Date(deck.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days
      isPremium: deck.is_premium,
      isFeatured: deck.is_featured,
      isPopular: deck.is_popular,
      isFavorite: userId ? deck.user_favorites.some((fav: any) => fav.user_id === userId) : false,
      slides: transformedSlides,
      tags: deck.ma_deck_tags.map((tag: any) => tag.tag),
      company: deck.company_name ? {
        name: deck.company_name,
        logo: deck.company_logo_url || ''
      } : undefined,
      dealValue: deck.deal_value,
      dealDate: deck.deal_date,
      dealType: deck.deal_type
    };

    return transformedDeck;
  } catch (error) {
    console.error('Error fetching M&A deck:', error);
    throw error;
  }
}

// Function to fetch categories with counts
export async function fetchMaDeckCategories() {
  try {
    const { data, error } = await supabase
      .from('ma_decks')
      .select('category, count(*)');
    // Removed the .group('category') call since it's redundant and causing errors
    // Supabase automatically groups by non-aggregated columns in the select statement

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.category.toLowerCase().replace(/\s+/g, '-'),
      name: item.category,
      count: parseInt(item.count, 10)
    }));
  } catch (error) {
    console.error('Error fetching M&A deck categories:', error);
    throw error;
  }
}

// Function to fetch deal types with counts
export async function fetchMaDeckDealTypes() {
  try {
    const { data, error } = await supabase
      .from('ma_decks')
      .select('deal_type, count(*)')
      .not('deal_type', 'is', null);
    // Removed the .group('deal_type') call since it's redundant and causing errors
    // Supabase automatically groups by non-aggregated columns in the select statement

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.deal_type.toLowerCase().replace(/\s+/g, '-'),
      name: item.deal_type,
      count: parseInt(item.count, 10)
    }));
  } catch (error) {
    console.error('Error fetching M&A deck deal types:', error);
    throw error;
  }
}

// Function to fetch related decks
export async function fetchRelatedDecks(deckId: string, limit = 5) {
  try {
    // First get the current deck's category and tags
    const { data: currentDeck, error: deckError } = await supabase
      .from('ma_decks')
      .select(`
        id,
        category,
        ma_deck_tags (
          tag
        )
      `)
      .eq('id', deckId)
      .single();

    if (deckError) throw deckError;
    if (!currentDeck) throw new Error('Deck not found');

    const category = currentDeck.category;
    const tags = currentDeck.ma_deck_tags.map((t: any) => t.tag);

    // Find decks with the same category or tags
    const { data, error } = await supabase
      .from('ma_decks')
      .select(`
        *,
        ma_deck_tags!inner (
          tag
        )
      `)
      .neq('id', deckId) // Exclude the current deck
      .or(`category.eq.${category},ma_deck_tags.tag.in.(${tags.join(',')})`)
      .limit(limit);

    if (error) throw error;

    // Transform the data
    const relatedDecks = await Promise.all((data || []).map(async (deck) => {
      let thumbnailUrl = deck.thumbnail_url;
      if (deck.thumbnail_storage_path) {
        thumbnailUrl = await getPublicUrl(deck.thumbnail_storage_path);
      }

      return {
        id: deck.id,
        title: deck.title,
        category: deck.category,
        description: deck.description || '',
        thumbnailUrl,
        slideCount: deck.slide_count,
        downloadCount: deck.download_count,
        rating: deck.rating,
        ratingCount: deck.rating_count,
        format: deck.file_formats || ['PowerPoint'],
        fileSize: deck.file_size || '5MB',
        createdAt: deck.created_at,
        updatedAt: deck.updated_at,
        isNew: new Date(deck.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isPremium: deck.is_premium,
        isFeatured: deck.is_featured,
        isPopular: deck.is_popular,
        isFavorite: false, // We don't need to check favorites for related decks
        slides: [], // We don't need to fetch slides for related decks
        tags: deck.ma_deck_tags.map((tag: any) => tag.tag),
        company: deck.company_name ? {
          name: deck.company_name,
          logo: deck.company_logo_url || ''
        } : undefined,
        dealValue: deck.deal_value,
        dealDate: deck.deal_date,
        dealType: deck.deal_type
      };
    }));

    return relatedDecks;
  } catch (error) {
    console.error('Error fetching related M&A decks:', error);
    throw error;
  }
}

// Function to toggle favorite status of a deck
export async function toggleFavorite(deckId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error('You must be logged in to favorite a deck');
    }

    // Check if the user has already favorited the deck
    const { data: existingFavorite, error: checkError } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('deck_id', deckId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingFavorite) {
      // Remove favorite
      const { error: removeError } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('deck_id', deckId);

      if (removeError) throw removeError;

      return { isFavorite: false };
    } else {
      // Add favorite
      const { error: addError } = await supabase
        .from('user_favorites')
        .insert({ user_id: userId, deck_id: deckId });

      if (addError) throw addError;

      return { isFavorite: true };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

// Function to record a deck download
export async function recordDeckDownload(deckId: string, fileFormat: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Record the download
    const { error } = await supabase
      .from('deck_downloads')
      .insert({
        deck_id: deckId,
        user_id: userId || null,
        file_format: fileFormat,
        ip_address: '', // This would come from server context in a real environment
        user_agent: navigator.userAgent
      });

    if (error) throw error;

    // Increment the download count
    const { error: updateError } = await supabase.rpc('increment_download_count', { deck_id: deckId });

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error recording download:', error);
    throw error;
  }
}