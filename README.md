# SlideInsight

A comprehensive platform for analyzing and categorizing corporate presentations with AI-powered insights. The platform now includes a specialized section for Mergers & Acquisitions (M&A) presentation templates.

## Migrations from Mock Data to Production Database

### Database Schema

The application uses Supabase as its database backend with the following structure:

- **Companies Table**: Stores company information
- **Presentations Table**: Stores corporate presentation metadata
- **Presentation_tags Table**: Maps tags to presentations
- **Scraping_jobs Table**: Manages web scraping of corporate presentations
- **ma_decks Table**: Stores M&A deck templates
- **ma_slides Table**: Stores individual slides for M&A decks
- **ma_deck_tags Table**: Maps tags to M&A decks
- **user_favorites Table**: Tracks user favorite decks
- **deck_downloads Table**: Tracks download statistics

### File Storage

Files are stored in Supabase Storage (backed by S3) with the following structure:

- **presentations/**: Contains original presentation files
- **thumbnails/**: Contains thumbnail images for presentations
- **ma-decks/**: Contains M&A deck template files
- **ma-slides/**: Contains individual slide images for M&A decks

### Migration Steps

1. **Database Setup**
   - Run the provided migration SQL files to create tables
   - Set up appropriate indexes and RLS policies

2. **File Storage Setup**
   - Configure storage buckets with appropriate permissions
   - Set up CORS for the storage bucket

3. **API Integration**
   - Replace mock API calls with real Supabase database queries
   - Use React Query for data fetching and caching
   - Implement proper error handling and loading states

## Development

```
npm run dev
```

## Production Build

```
npm run build
```

## License

All rights reserved.