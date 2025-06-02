# Implementation Plan for Migrating to Supabase and Amazon S3

## 1. Database Migration (Supabase)

### 1.1 Identify Existing Mock Data

| Feature | Current Implementation | Migration Path |
|---------|------------------------|---------------|
| M&A Decks | `generateMockDecks()` in `mockData.ts` | → `ma_decks` table |
| M&A Deck Slides | Generated in mock function | → `ma_slides` table |
| M&A Categories | MOCK_CATEGORIES array | → Category field in `ma_decks` table |
| Deal Types | MOCK_DEAL_TYPES array | → Deal type field in `ma_decks` table |
| Favorited Decks | Boolean in mock objects | → `user_favorites` table |
| Download Counts | Random numbers in mock | → `deck_downloads` table + counter |

### 1.2 Database Schema

The new database schema includes:

- **ma_decks**: Stores M&A deck metadata
  - `id`, `title`, `description`, `category`, etc.
  - Links to `companies` table where applicable

- **ma_slides**: Stores individual slide information
  - `id`, `deck_id`, `slide_number`, `storage_path`, etc.

- **ma_deck_tags**: Maps tags to decks (many-to-many relationship)
  - `deck_id`, `tag`

- **user_favorites**: Tracks which decks users have favorited
  - `user_id`, `deck_id`

- **deck_downloads**: Tracks download statistics
  - `id`, `deck_id`, `user_id`, `downloaded_at`, etc.

### 1.3 Data Validation Rules

- Deck titles and categories are required
- Slide numbers must be unique within a deck
- Deal values must be properly formatted
- Tags must not be empty strings

### 1.4 Security Policies

- Public read access for decks and slides
- Write access restricted to authenticated users with appropriate roles
- User favorites limited to the owning user
- Download statistics accessible only to admins

## 2. File Storage Migration (S3 via Supabase Storage)

### 2.1 File Storage Requirements

| Content Type | Access Level | Storage Location |
|--------------|--------------|------------------|
| Deck Thumbnails | Public | `thumbnails/` |
| Free Deck Slides | Public | `ma-slides/` |
| Premium Deck Slides | Protected | `ma-slides/premium/` |
| Full Deck Downloads | Protected | `ma-decks/` |

### 2.2 S3 Configuration

- **Bucket Structure**:
  - Use Supabase Storage buckets (S3 under the hood)
  - Create appropriate folders for organization

- **Permissions**:
  - Public access for thumbnails and free content
  - Authenticated access for premium content
  - Admin-only access for original uploads

- **CORS Settings**:
  - Allow GET requests from your domain
  - Enable appropriate headers

### 2.3 File Naming Conventions

- Use unique identifiers based on timestamp + random string
- Maintain original file extensions
- Slides use pattern: `[deck_id]/slide_[number].[ext]`

### 2.4 Backup Policy

- Regular backups via Supabase
- Retention period of 30 days for backups
- Versioning enabled for critical files

## 3. Code Refactoring

### 3.1 API Service Layer

- Create `maDecks.ts` service with CRUD operations
- Implement React Query hooks in `useMaDecks.ts`
- Add storage utility functions in `storage.ts`

### 3.2 Component Updates

| Component | Changes Needed |
|-----------|---------------|
| MaDecksPage | Replace mock data with React Query hooks |
| MaDeckViewerPage | Add loading states and error handling |
| MaDeckViewer | Implement file download logic |
| MaDeckGrid | Add loading skeleton UI |
| DeckInfoSidebar | Connect download buttons to real functions |

### 3.3 Edge Functions

- **deck-stats**: Aggregates statistics for analytics dashboard
- **update-rating**: Handles rating calculation and updates

### 3.4 Migration Risks and Mitigation

- **Data Loss**: Implement migration in phases, keeping mock data as fallback
- **Performance**: Add proper indexes and optimize queries
- **Security**: Thoroughly test RLS policies before production
- **User Experience**: Add loading states and graceful degradation

## 4. Implementation Timeline

1. **Week 1**: Database schema setup and migrations
2. **Week 2**: Storage configuration and file handling
3. **Week 3**: API layer implementation and component refactoring
4. **Week 4**: Testing, bug fixes, and performance optimization

## 5. Testing Plan

- Unit tests for API functions
- Integration tests for database interactions
- UI tests for user flows (favoriting, downloading, etc.)
- Performance testing for large datasets

## 6. Rollback Plan

- Keep mock data implementation as fallback
- Create database snapshots before major migrations
- Implement feature flags for gradual rollout