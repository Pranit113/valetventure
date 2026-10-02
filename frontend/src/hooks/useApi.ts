import { useState, useCallback } from 'react';
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
      } catch (err: any) {
        // Handle mock DB errors: { response: { data: { message }, status } }
        // Handle Axios errors: err.response?.data?.message
        // Handle plain Error objects
        let message = 'Something went wrong. Please try again.';

        if (err?.response?.data?.message) {
          message = err.response.data.message;
        } else if (err?.message && err.message !== 'Network Error') {
          message = err.message;
        }

        const errorObj = new Error(message);
        setError(errorObj);
        showError(message);
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
