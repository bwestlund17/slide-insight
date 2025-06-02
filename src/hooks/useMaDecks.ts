import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchMaDecks, 
  fetchMaDeckById, 
  fetchMaDeckCategories, 
  fetchMaDeckDealTypes, 
  fetchRelatedDecks, 
  toggleFavorite, 
  recordDeckDownload 
} from '../lib/maDecks';
import { MaDeck } from '../types';

// Hook to fetch M&A decks with filtering and pagination
export function useMaDecks(params: {
  limit?: number;
  offset?: number;
  category?: string | null;
  dealType?: string | null;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['maDecks', params],
    queryFn: () => fetchMaDecks(params)
  });
}

// Hook to fetch a single M&A deck by ID
export function useMaDeckById(id: string) {
  return useQuery({
    queryKey: ['maDeck', id],
    queryFn: () => fetchMaDeckById(id),
    enabled: !!id
  });
}

// Hook to fetch M&A deck categories
export function useMaDeckCategories() {
  return useQuery({
    queryKey: ['maDeckCategories'],
    queryFn: fetchMaDeckCategories
  });
}

// Hook to fetch M&A deck deal types
export function useMaDeckDealTypes() {
  return useQuery({
    queryKey: ['maDeckDealTypes'],
    queryFn: fetchMaDeckDealTypes
  });
}

// Hook to fetch related decks for a deck
export function useRelatedDecks(deckId: string, limit?: number) {
  return useQuery({
    queryKey: ['relatedDecks', deckId],
    queryFn: () => fetchRelatedDecks(deckId, limit),
    enabled: !!deckId
  });
}

// Hook to toggle favorite status for a deck
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deckId: string) => toggleFavorite(deckId),
    onSuccess: (result, deckId) => {
      // Update the deck in the query cache
      queryClient.setQueryData<MaDeck>(['maDeck', deckId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isFavorite: result.isFavorite
        };
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['maDecks'] });
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
    }
  });
}

// Hook to record a deck download
export function useRecordDeckDownload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deckId, fileFormat }: { deckId: string, fileFormat: string }) => 
      recordDeckDownload(deckId, fileFormat),
    onSuccess: (_, { deckId }) => {
      // Update the deck in the query cache to increment download count
      queryClient.setQueryData<MaDeck>(['maDeck', deckId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          downloadCount: oldData.downloadCount + 1
        };
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['maDecks'] });
    }
  });
}