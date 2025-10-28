// API Service for Football Analysis App
import { mockLeagues, mockTeams, mockPlayers, mockPositions } from './mockData';

const API_BASE_URL = 'https://iqstats.spotlayer.com';
const USE_MOCK_DATA = true; // Set to false when API server is available

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all leagues/competitions
  async getLeagues() {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockLeagues;
    }
    return this.request('/api/external/leagues');
  }

  // Get teams by league ID
  async getTeams(leagueId) {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTeams[leagueId] || [];
    }
    return this.request(`/api/external/teams?league_id=${leagueId}`);
  }

  // Get players by team ID
  async getPlayers(teamId) {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPlayers[teamId] || [];
    }
    return this.request(`/api/external/players?team_id=${teamId}`);
  }

  // Get all positions
  async getPositions() {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockPositions;
    }
    return this.request('/api/external/positions');
  }
}

export default new ApiService();

// Export the service instance as apiService
export const apiService = new ApiService();

