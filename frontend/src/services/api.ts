const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Authentication operations
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser(token: string) {
    return this.request<{ user: any }>('/auth/me', {}, token);
  }

  // Mindmap operations
  async getAllMindmaps(token: string) {
    return this.request<MindMap[]>('/mindmaps', {}, token);
  }

  async getMindmap(id: string, token: string) {
    return this.request<MindMap>(`/mindmaps/${id}`, {}, token);
  }

  async createMindmap(title: string, description: string | undefined, token: string) {
    return this.request<MindMap>('/mindmaps', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    }, token);
  }

  async updateMindmap(id: string, mindmap: MindMap, token: string) {
    return this.request(`/mindmaps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mindmap),
    }, token);
  }

  async deleteMindmap(id: string, token: string) {
    return this.request(`/mindmaps/${id}`, {
      method: 'DELETE',
    }, token);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
