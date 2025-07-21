import type { RequestConfig } from '../types';

export const customFetch = <T>(
  config: RequestConfig,
): Promise<T> => {
  const { url, params, ...otherConfig } = config;
  
  // URLSearchParamsを使ってクエリパラメータを構築
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }

  const fullUrl = searchParams.toString() 
    ? `${url}?${searchParams.toString()}`
    : url;

  const requestConfig: RequestInit = {
    ...otherConfig,
    headers: {
      'Content-Type': 'application/json',
      ...otherConfig.headers,
    },
  };

  if (otherConfig.data) {
    requestConfig.body = JSON.stringify(otherConfig.data);
  }

  return fetch(fullUrl, requestConfig)
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