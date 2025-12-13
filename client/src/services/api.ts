const API_BASE_URL = import.meta.env.VITE_API_URL || ''; 

export const getApiUrl = (endpoint: string) => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
}