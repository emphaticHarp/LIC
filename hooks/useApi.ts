import { useState, useCallback } from 'react';
import { toast } from '@/lib/toast';

interface UseApiOptions {
  showToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const {
    showToast = true,
    successMessage = 'Operation successful',
    errorMessage = 'Operation failed',
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(
    async (
      url: string,
      options?: RequestInit & { successMessage?: string; errorMessage?: string }
    ): Promise<ApiResponse<T> | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          ...options,
        });

        const result: ApiResponse<T> = await response.json();

        if (!response.ok) {
          const err = result.error || errorMessage;
          setError(err);
          if (showToast) {
            toast.error('Error', err);
          }
          return null;
        }

        if (result.data) {
          setData(result.data);
        }

        if (showToast && options?.successMessage) {
          toast.success('Success', options.successMessage);
        } else if (showToast && successMessage) {
          toast.success('Success', successMessage);
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : errorMessage;
        setError(errorMsg);
        if (showToast) {
          toast.error('Error', errorMsg);
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast, successMessage, errorMessage]
  );

  const get = useCallback(
    async (url: string, opts?: UseApiOptions) => {
      return request(url, { method: 'GET', ...opts });
    },
    [request]
  );

  const post = useCallback(
    async (url: string, body: any, opts?: UseApiOptions) => {
      return request(url, {
        method: 'POST',
        body: JSON.stringify(body),
        ...opts,
      });
    },
    [request]
  );

  const put = useCallback(
    async (url: string, body: any, opts?: UseApiOptions) => {
      return request(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        ...opts,
      });
    },
    [request]
  );

  const del = useCallback(
    async (url: string, opts?: UseApiOptions) => {
      return request(url, { method: 'DELETE', ...opts });
    },
    [request]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    request,
    get,
    post,
    put,
    delete: del,
    reset,
  };
}
