// Orval mutator function for custom fetch
export const customFetch = <T>(
  url: string,
  config: RequestInit = {},
): Promise<T> => {
  const requestConfig: RequestInit = {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  };

  return fetch(url, requestConfig)
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return response.text();
    });
};

export default customFetch;