import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket constants
export const STORAGE_BUCKET = 'slideinsight';
export const PRESENTATIONS_FOLDER = 'presentations';
export const THUMBNAILS_FOLDER = 'thumbnails';

// Helper functions for data fetching
export async function fetchCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function fetchCompanyById(id: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function fetchCompanyBySymbol(symbol: string) {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      presentations!presentations_company_id_fkey (*)
    `)
    .eq('symbol', symbol)
    .single();
  
  if (error) throw error;
  return data;
}

export async function fetchPresentations() {
  const { data: presentations, error: presentationsError } = await supabase
    .from('presentations')
    .select(`
      *,
      companies!fk_company_symbol (
        name,
        symbol,
        industry
      ),
      presentation_tags (
        tag
      )
    `)
    .order('date', { ascending: false });
  
  if (presentationsError) throw presentationsError;

  // Transform the data to include tags array
  return presentations?.map(presentation => ({
    ...presentation,
    tags: presentation.presentation_tags?.map(t => t.tag) || []
  }));
}

export async function fetchPresentationById(id: string) {
  try {
    const { data: presentation, error: presentationError } = await supabase
      .from('presentations')
      .select(`
        *,
        companies!fk_company_symbol (
          name,
          symbol,
          industry,
          sector,
          market_cap,
          headquarters,
          website
        ),
        presentation_tags (
          tag
        )
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (presentationError) {
      console.error('Error fetching presentation:', presentationError);
      return null;
    }

    if (!presentation) {
      return null;
    }

    // Get storage URLs if available
    let fileUrl = presentation.url;
    let thumbnailUrl = presentation.thumbnail_url;

    if (presentation.storage_path) {
      const { data: fileData } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(presentation.storage_path, 3600); // 1 hour expiry
      if (fileData) {
        fileUrl = fileData.signedUrl;
      }
    }

    if (presentation.thumbnail_storage_path) {
      const { data: thumbnailData } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(presentation.thumbnail_storage_path, 3600);
      if (thumbnailData) {
        thumbnailUrl = thumbnailData.signedUrl;
      }
    }

    return {
      ...presentation,
      url: fileUrl,
      thumbnail_url: thumbnailUrl,
      tags: presentation.presentation_tags?.map(t => t.tag) || []
    };
  } catch (error) {
    console.error('Error in fetchPresentationById:', error);
    return null;
  }
}

export async function fetchPresentationsByCompany(companyId: string) {
  const { data: presentations, error } = await supabase
    .from('presentations')
    .select(`
      *,
      presentation_tags (
        tag
      )
    `)
    .eq('company_id', companyId)
    .order('date', { ascending: false });
  
  if (error) throw error;

  return presentations?.map(presentation => ({
    ...presentation,
    tags: presentation.presentation_tags?.map(t => t.tag) || []
  }));
}

export async function fetchPresentationTags(presentationId: string) {
  const { data, error } = await supabase
    .from('presentation_tags')
    .select('tag')
    .eq('presentation_id', presentationId);
  
  if (error) throw error;
  return data.map(t => t.tag);
}

export async function fetchIndustryStats() {
  const { data, error } = await supabase
    .from('companies')
    .select('industry')
    .not('industry', 'is', null);
  
  if (error) throw error;
  
  const stats = data.reduce((acc, company) => {
    acc[company.industry] = (acc[company.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(stats).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    count
  }));
}

export async function fetchAllTags() {
  const { data, error } = await supabase
    .from('presentation_tags')
    .select('tag');
  
  if (error) throw error;

  const tagCounts = data.reduce((acc, { tag }) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(tagCounts).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    count
  }));
}

// Storage helper functions
export async function uploadPresentationFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(`${PRESENTATIONS_FOLDER}/${path}`, file);

  if (error) throw error;
  return data;
}

export async function uploadThumbnail(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(`${THUMBNAILS_FOLDER}/${path}`, file);

  if (error) throw error;
  return data;
}

export async function getStorageUrl(path: string) {
  const { data } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, 3600); // 1 hour expiry

  return data?.signedUrl;
}

export async function deleteStorageFile(path: string) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) throw error;
}

// Function to trigger initial scraping
export async function triggerInitialScraping() {
  try {
    const { data, error } = await supabase.functions.invoke('trigger-scrape', {
      body: { mode: 'initial' }
    });

    if (error) {
      console.error('Error triggering initial scraping:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in triggerInitialScraping:', error);
    throw error;
  }
}