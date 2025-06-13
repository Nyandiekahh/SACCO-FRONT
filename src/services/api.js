// services/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Debug logging to see what URL is being used
console.log('=== API Configuration Debug ===');
console.log('API_URL being used:', API_URL);
console.log('Environment variables:', {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV
});
console.log('================================');

// Add global error handler to catch any unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

class ApiClient {
  constructor() {
    // Track retry attempts to prevent infinite loops
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.baseRetryDelay = 1000; // 1 second
  }

  async request(endpoint, options = {}) {
    const fullUrl = `${API_URL}${endpoint}`;
    console.log(`Making ${options.method || 'GET'} request to:`, fullUrl);
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('Added auth token to request');
    }
    
    const config = {
      ...options,
      headers,
    };
    
    // For file uploads, don't set Content-Type
    if (config.body instanceof FormData) {
      delete headers['Content-Type'];
    }
    
    try {
      console.log('Request config:', { url: fullUrl, method: config.method, headers: { ...headers, Authorization: token ? 'Bearer [TOKEN]' : 'None' } });
      
      const response = await fetch(fullUrl, config);
      
      console.log(`Response from ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      // Handle 429 Too Many Requests with improved retry logic
      if (response.status === 429) {
        const retryKey = `${endpoint}-${config.method || 'GET'}`;
        const currentRetries = this.retryAttempts.get(retryKey) || 0;
        
        if (currentRetries < this.maxRetries) {
          console.warn(`Rate limit hit on ${endpoint} (attempt ${currentRetries + 1}/${this.maxRetries}). Waiting and retrying...`);
          
          // Increment retry count
          this.retryAttempts.set(retryKey, currentRetries + 1);
          
          // Exponential backoff: 1s, 2s, 4s
          const delay = this.baseRetryDelay * Math.pow(2, currentRetries);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Retry the request
          return this.request(endpoint, options);
        } else {
          // Max retries exceeded, clear the counter and fail
          console.error(`Max retries (${this.maxRetries}) exceeded for ${endpoint}`);
          this.retryAttempts.delete(retryKey);
          
          return Promise.reject({
            status: 429,
            message: 'Rate limit exceeded. Please try again later.',
            data: 'Too many requests - please wait before trying again.'
          });
        }
      }
      
      // Clear retry counter on successful response
      const retryKey = `${endpoint}-${config.method || 'GET'}`;
      this.retryAttempts.delete(retryKey);
      
      // Handle 401 Unauthorized - attempt token refresh
      if (response.status === 401) {
        console.log('401 Unauthorized - attempting token refresh');
        const refreshed = await this.refreshToken();
        if (refreshed) {
          console.log('Token refreshed successfully, retrying original request');
          // Retry the original request
          headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
          return this.request(endpoint, options);
        } else {
          console.log('Token refresh failed, redirecting to login');
          // Redirect to login if refresh failed
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject('Authentication failed');
        }
      }
      
      // Handle successful responses
      if (response.ok) {
        console.log(`Successful response from ${endpoint}`);
        // Some endpoints might not return JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const jsonData = await response.json();
          console.log(`JSON response from ${endpoint}:`, jsonData);
          return jsonData;
        }
        const textData = await response.text();
        console.log(`Text response from ${endpoint}:`, textData);
        return textData;
      }
      
      // Handle API errors
      try {
        const contentType = response.headers.get('content-type');
        const errorData = contentType && contentType.includes('application/json') 
          ? await response.json() 
          : await response.text();
          
        console.error(`API Error from ${endpoint}:`, {
          status: response.status,
          data: errorData
        });
          
        return Promise.reject({
          status: response.status,
          data: errorData,
          message: typeof errorData === 'string' ? errorData : (errorData.error || errorData.detail || `Error ${response.status}`)
        });
      } catch (parseError) {
        console.error(`Parse error for ${endpoint}:`, parseError);
        return Promise.reject({
          status: response.status,
          message: `Error ${response.status}`
        });
      }
    } catch (error) {
      console.error(`Network error for ${endpoint}:`, error);
      return Promise.reject(error);
    }
  }
  
  // Attempt to refresh the access token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log('No refresh token available');
      return false;
    }
    
    try {
      console.log('Attempting to refresh token...');
      const response = await fetch(`${API_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        console.log('Token refreshed successfully');
        return true;
      }
      console.log('Token refresh failed with status:', response.status);
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }
  
  // HTTP methods
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }
  
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiClient();
export default api;