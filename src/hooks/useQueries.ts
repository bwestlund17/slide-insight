import { useQuery } from '@tanstack/react-query';
import { 
  fetchCompanies, 
  fetchCompanyBySymbol, 
  fetchPresentations,
  fetchPresentationById,
  fetchIndustryStats,
  fetchPresentationsByCompany,
  fetchPresentationTags
} from '../lib/supabase';

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies
  });
}

export function useCompanyBySymbol(symbol: string) {
  return useQuery({
    queryKey: ['company', symbol],
    queryFn: () => fetchCompanyBySymbol(symbol),
    enabled: !!symbol
  });
}

export function usePresentations() {
  return useQuery({
    queryKey: ['presentations'],
    queryFn: fetchPresentations
  });
}

export function usePresentationById(id: string) {
  return useQuery({
    queryKey: ['presentation', id],
    queryFn: () => fetchPresentationById(id),
    enabled: !!id
  });
}

export function useIndustryStats() {
  return useQuery({
    queryKey: ['industries'],
    queryFn: fetchIndustryStats
  });
}

export function usePresentationsByCompany(companyId: string) {
  return useQuery({
    queryKey: ['presentations', 'company', companyId],
    queryFn: () => fetchPresentationsByCompany(companyId),
    enabled: !!companyId
  });
}

export function usePresentationTags(presentationId: string) {
  return useQuery({
    queryKey: ['presentation', presentationId, 'tags'],
    queryFn: () => fetchPresentationTags(presentationId),
    enabled: !!presentationId
  });
}