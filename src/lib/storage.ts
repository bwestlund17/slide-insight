import { supabase } from './supabase';

// Storage bucket constants
export const STORAGE_BUCKET = 'slideinsight';
export const PRESENTATIONS_FOLDER = 'presentations';
export const THUMBNAILS_FOLDER = 'thumbnails';
export const MA_DECKS_FOLDER = 'ma-decks';
export const MA_SLIDES_FOLDER = 'ma-slides';

// S3 client configuration
// This is using Supabase Storage which is powered by S3 under the hood
// No separate S3 configuration is needed as we use Supabase as a proxy

/**
 * Helper function to generate a unique file path for storage
 */
export const generateStoragePath = (folder: string, fileName: string): string => {
  // Create a unique ID based on timestamp and random string
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Clean the file name to remove special characters
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
  
  return `${folder}/${uniqueId}-${cleanFileName}`;
};

/**
 * Upload a file to storage
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  const path = generateStoragePath(folder, file.name);
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  return path;
}

/**
 * Get a public URL for a file
 */
export async function getPublicUrl(path: string): Promise<string> {
  const { data } = await supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Get a signed URL for a file (for private files)
 */
export async function getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresIn);
  
  if (error) throw error;
  
  return data.signedUrl;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);
  
  if (error) throw error;
}

/**
 * Upload a deck slide
 */
export async function uploadDeckSlide(file: File): Promise<string> {
  return uploadFile(file, MA_SLIDES_FOLDER);
}

/**
 * Upload a deck thumbnail
 */
export async function uploadDeckThumbnail(file: File): Promise<string> {
  return uploadFile(file, THUMBNAILS_FOLDER);
}

/**
 * Update storage permissions to make certain folders public
 * This is typically done once during setup
 */
export async function configureStoragePermissions(): Promise<void> {
  // This would typically be an admin function
  // For thumbnails and public content, we make them publicly accessible
  const { error } = await supabase.storage.from(STORAGE_BUCKET).updateBucket({
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['image/*', 'application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
  });
  
  if (error) {
    console.error('Failed to update bucket permissions:', error);
    throw error;
  }
}

/**
 * Configure CORS for the storage bucket
 * This is typically done once during setup
 */
export async function configureCors(): Promise<void> {
  // This would be done via Supabase admin API or dashboard
  // Not directly available in the client library
  console.log('CORS should be configured in Supabase dashboard');
}