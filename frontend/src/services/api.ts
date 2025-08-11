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
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
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

  // Mindmap operations
  async getAllMindmaps() {
    return this.request<MindMap[]>('/mindmaps');
  }

  async getMindmap(id: string) {
    return this.request<MindMap>(`/mindmaps/${id}`);
  }

  async createMindmap(title: string, description?: string) {
    return this.request<MindMap>('/mindmaps', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  async updateMindmap(id: string, mindmap: MindMap) {
    return this.request(`/mindmaps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mindmap),
    });
  }

  async deleteMindmap(id: string) {
    return this.request(`/mindmaps/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
