/**
 * Custom React Query Hooks
 * - Data fetching with caching
 * - Automatic retry and error handling
 * - Loading states and refetching
 * - Works with both mock and real data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, Farmer, AdvisoryResponse, AnalysisResponse } from '../services/api.client'

// Query keys for cache management
export const queryKeys = {
  advisory: (farmerId: string) => ['advisory', farmerId],
  analysis: (district: string) => ['analysis', district],
  crisis: (location: string) => ['crisis', location],
  taskStatus: (taskId: string) => ['task', taskId],
  agents: ['agents', 'status'],
  health: ['api', 'health'],
}

/**
 * Hook: Get farmer advisory
 * Refetches every 60 seconds (real-time updates)
 */
export const useAdvisory = (farmer: Farmer | null, enabled = true) => {
  return useQuery({
    queryKey: farmer ? queryKeys.advisory(farmer.id) : ['advisory'],
    queryFn: () => {
      if (!farmer) throw new Error('Farmer data required')
      return apiClient.getAdvisory(farmer)
    },
    enabled: enabled && !!farmer,
    refetchInterval: 60000, // Refresh every 60 seconds
    refetchOnWindowFocus: true,
    staleTime: 30000, // Data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Hook: Get district analysis
 */
export const useAnalysis = (
  district: string | null,
  state: string | null,
  crops: string[],
  enabled = true
) => {
  return useQuery({
    queryKey: district ? queryKeys.analysis(district) : ['analysis'],
    queryFn: () => {
      if (!district || !state) throw new Error('District and state required')
      return apiClient.getAnalysis(district, state, crops)
    },
    enabled: enabled && !!district && !!state,
    refetchInterval: 120000, // Refresh every 2 minutes
    staleTime: 60000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Hook: Trigger advisory mutation
 * Used for on-demand requests
 */
export const useGetAdvisory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (farmer: Farmer) => apiClient.getAdvisory(farmer),
    onSuccess: (data) => {
      if (data.data.sentinelReport?.weatherData?.location?.state) {
        const location = data.data.sentinelReport.weatherData.location
        queryClient.setQueryData(
          queryKeys.advisory(data.data.sentinelReport?.agentId || 'farmer'),
          data
        )
      }
    },
  })
}

/**
 * Hook: Trigger analysis mutation
 */
export const useGetAnalysis = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      district,
      state,
      crops,
    }: {
      district: string
      state: string
      crops: string[]
    }) => apiClient.getAnalysis(district, state, crops),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.analysis(data.data?.taskId || 'analysis'), data)
    },
  })
}

/**
 * Hook: Get crisis response
 */
export const useGetCrisisResponse = () => {
  return useMutation({
    mutationFn: ({
      district,
      state,
      crops,
      crisisType,
    }: {
      district: string
      state: string
      crops: string[]
      crisisType: string
    }) => apiClient.getCrisisResponse(district, state, crops, crisisType),
  })
}

/**
 * Hook: Get task status
 */
export const useTaskStatus = (taskId: string | null, enabled = true) => {
  return useQuery({
    queryKey: taskId ? queryKeys.taskStatus(taskId) : ['task'],
    queryFn: () => {
      if (!taskId) throw new Error('Task ID required')
      return apiClient.getTaskStatus(taskId)
    },
    enabled: enabled && !!taskId,
    refetchInterval: 5000, // Check every 5 seconds
    staleTime: 3000,
    gcTime: 1 * 60 * 1000,
  })
}

/**
 * Hook: Get agents status
 */
export const useAgentsStatus = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.agents,
    queryFn: () => apiClient.getAgentsStatus(),
    enabled,
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 20000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Hook: Check API health
 */
export const useApiHealth = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => apiClient.healthCheck(),
    refetchInterval: 30000,
    staleTime: 25000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Hook: Invalidate all queries
 * Useful for manual refresh
 */
export const useInvalidateAll = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries(),
    invalidateAdvisory: (farmerId: string) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.advisory(farmerId) }),
    invalidateAnalysis: (district: string) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.analysis(district) }),
    invalidateHealth: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.health }),
  }
}

export default {
  useAdvisory,
  useAnalysis,
  useGetAdvisory,
  useGetAnalysis,
  useGetCrisisResponse,
  useTaskStatus,
  useAgentsStatus,
  useApiHealth,
  useInvalidateAll,
}
