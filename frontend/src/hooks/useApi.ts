import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { useToast } from '../contexts/ToastContext';

export function useApi<T, P extends any[]>(
  apiFunc: (...args: P) => Promise<{ data: T }>,
  options?: { onSuccess?: (data: T) => void; onError?: (error: Error) => void }
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { error: showError } = useToast();

  const execute = useCallback(
    async (...args: P) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiFunc(...args);
        setData(response.data);
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('An unknown error occurred');
        
        if (err instanceof AxiosError && err.response?.data?.message) {
          errorObj.message = err.response.data.message;
        }

        setError(errorObj);
        showError(errorObj.message);
        options?.onError?.(errorObj);
        throw errorObj;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunc, options, showError]
  );

  return { data, isLoading, error, execute, setData };
}
