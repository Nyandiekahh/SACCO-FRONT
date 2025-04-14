// services/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Track request timestamps to prevent rate limiting
const requestTimestamps = {};
const THROTTLE_INTERVAL = 500; // 500ms between requests to the same endpoint

class ApiClient {
  // Throttle requests to prevent 429 errors
  async throttleRequest(endpoint) {
    const now = Date.now();
    
    // Check if we've recently made a request to this endpoint
    if (requestTimestamps[endpoint]) {
      const timeSinceLastRequest = now - requestTimestamps[endpoint];
      
      // If the request is too soon after the previous one, delay it
      if (timeSinceLastRequest < THROTTLE_INTERVAL) {
        const delayTime = THROTTLE_INTERVAL - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, delayTime));
      }
    }
    
    // Update timestamp for this endpoint
    requestTimestamps[endpoint] = Date.now();
  }

  async request(endpoint, options = {}) {
    // Apply request throttling for GET requests or profile endpoints
    if (options.method === 'GET' || endpoint.includes('profile')) {
      await this.throttleRequest(endpoint);
    }
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
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
      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      // Handle 429 Too Many Requests
      if (response.status === 429) {
        console.warn(`Rate limit hit on ${endpoint}. Waiting and retrying...`);
        // Wait for a longer time before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Try again with increased backoff
        return this.request(endpoint, options);
      }
      
      // Handle 401 Unauthorized - attempt token refresh
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request
          headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
          return this.request(endpoint, options);
        } else {
          // Redirect to login if refresh failed
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject('Authentication failed');
        }
      }
      
      // Handle successful responses
      if (response.ok) {
        // Some endpoints might not return JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }
        return response.text();
      }
      
      // Handle API errors
      try {
        const contentType = response.headers.get('content-type');
        const errorData = contentType && contentType.includes('application/json') 
          ? await response.json() 
          : await response.text();
          
        return Promise.reject({
          status: response.status,
          data: errorData,
          message: typeof errorData === 'string' ? errorData : (errorData.error || errorData.detail || `Error ${response.status}`)
        });
      } catch (parseError) {
        return Promise.reject({
          status: response.status,
          message: `Error ${response.status}`
        });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  // Attempt to refresh the access token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    
    try {
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
        return true;
      }
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