// import { useState, useEffect, useCallback } from 'react';

// const useFetch = () => {
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           ...headers,
//         },
//         body: body ? JSON.stringify(body) : null,
//       });

//       if (!response.ok) {
//         const errorText = await response.text(); // Get raw response (HTML or text)
//         throw new Error(`Request failed with status ${response.status}: ${errorText || 'Unknown error'}`);
//       }

//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         const responseData = await response.json();
//         setData(responseData);
//         return responseData; // Return the data for the caller to use
//       } else {
//         throw new Error('Response is not JSON');
//       }
//     } catch (err) {
//       setError(err.message);
//       throw err; // Re-throw for the caller to handle
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const clearState = () => {
//     setData(null);
//     setIsLoading(false);
//     setError(null);
//   };

//   return { data, isLoading, error, sendRequest, clearState };
// };

// export default useFetch;




import { useState, useEffect, useCallback } from 'react';

const useFetch = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchOptions = {
        method,
        headers: { ...headers },
      };

      // Check if the body is a FormData object
      if (body instanceof FormData) {
        // Do NOT set Content-Type header for FormData; the browser will set it automatically
        fetchOptions.body = body;
      } else {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = body ? JSON.stringify(body) : null;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server sends JSON error responses
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        setData(responseData);
        return responseData;
      } else {
        throw new Error('Response is not JSON');
      }
    } catch (err) {
      setError(err.message);
      throw err;
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