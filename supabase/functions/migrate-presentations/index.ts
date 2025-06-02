import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const PRESENTATIONS_FOLDER = 'presentations';
const BATCH_SIZE = 1; // Process 1 presentation at a time to avoid resource limits

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Stats tracking
    const stats = {
      total: 0,
      success: 0,
      skipped: 0,
      failed: 0,
      failedPresentations: []
    };

    // Fetch all presentations
    const { data: presentations, error } = await supabase
      .from('presentations')
      .select('*');
    
    if (error) throw error;
    
    stats.total = presentations.length;
    console.log(`Found ${stats.total} presentations to process`);
    
    // Process presentations in batches
    for (let i = 0; i < presentations.length; i += BATCH_SIZE) {
      const batch = presentations.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (presentation) => {
        try {
          // Skip if already migrated
          if (presentation.storage_path) {
            console.log(`Skipping - already has storage path: ${presentation.id}`);
            stats.skipped++;
            return;
          }
          
          // Get filename from URL or generate one
          const urlParts = presentation.url.split('/');
          let fileName = urlParts[urlParts.length - 1];
          
          // Ensure filename has extension
          if (!fileName.includes('.')) {
            const fileType = presentation.file_type?.toLowerCase() || 'pdf';
            fileName = `${fileName}.${fileType}`;
          }
          
          // Download file from current URL
          console.log(`Downloading from: ${presentation.url}`);
          const response = await fetch(presentation.url);
          
          if (!response.ok) {
            throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
          }
          
          // Convert response to ArrayBuffer
          const fileData = await response.arrayBuffer();
          
          // Upload to Supabase Storage
          const storagePath = `${PRESENTATIONS_FOLDER}/${presentation.id}/${fileName}`;
          console.log(`Uploading to: ${storagePath}`);
          
          const { error: uploadError } = await supabase.storage
            .from('slideinsight')
            .upload(storagePath, fileData, {
              contentType: response.headers.get('content-type') || 'application/octet-stream',
              cacheControl: '3600',
              upsert: true
            });
          
          if (uploadError) {
            throw uploadError;
          }
          
          // Get the URL of the uploaded file
          const { data: urlData } = await supabase.storage
            .from('slideinsight')
            .getPublicUrl(storagePath);
          
          // Update the presentation record
          const { error: updateError } = await supabase
            .from('presentations')
            .update({ 
              storage_path: storagePath
            })
            .eq('id', presentation.id);
          
          if (updateError) {
            throw updateError;
          }
          
          console.log(`Successfully migrated: ${presentation.id}`);
          stats.success++;
        } catch (error) {
          console.error(`Failed to migrate presentation ${presentation.id}:`, error);
          stats.failed++;
          stats.failedPresentations.push({
            id: presentation.id,
            title: presentation.title,
            error: error.message
          });
        }
      }));
      
      console.log(`Completed batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(presentations.length/BATCH_SIZE)}`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Migration completed',
        stats: {
          total: stats.total,
          success: stats.success,
          skipped: stats.skipped,
          failed: stats.failed,
          failedItems: stats.failedPresentations
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error('Migration failed:', error);
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