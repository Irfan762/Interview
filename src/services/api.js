const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const USER_ID = 'irfan_147';

export const api = {
  // Get all progress
  async getProgress() {
    try {
      const response = await fetch(`${API_BASE_URL}/tracker/progress/${USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      return await response.json();
    } catch (error) {
      console.error('Error fetching progress:', error);
      return {};
    }
  },

  // Toggle task completion
  async toggleTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tracker/progress/${USER_ID}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      if (!response.ok) throw new Error('Failed to toggle task');
      return await response.json();
    } catch (error) {
      console.error('Error toggling task:', error);
      throw error;
    }
  },

  // Bulk update progress (for syncing localStorage to backend)
  async bulkUpdateProgress(progressData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tracker/progress/${USER_ID}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progressData }),
      });
      if (!response.ok) throw new Error('Failed to bulk update');
      return await response.json();
    } catch (error) {
      console.error('Error bulk updating:', error);
      throw error;
    }
  },

  // Get statistics
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/tracker/stats/${USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  },
};
