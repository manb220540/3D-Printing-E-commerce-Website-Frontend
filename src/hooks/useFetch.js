import { useState, useEffect, useCallback } from 'react';

const useFetch = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get raw response (HTML or text)
        throw new Error(`Request failed with status ${response.status}: ${errorText || 'Unknown error'}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        setData(responseData);
        return responseData; // Return the data for the caller to use
      } else {
        throw new Error('Response is not JSON');
      }
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw for the caller to handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearState = () => {
    setData(null);
    setIsLoading(false);
    setError(null);
  };

  return { data, isLoading, error, sendRequest, clearState };
};

export default useFetch;