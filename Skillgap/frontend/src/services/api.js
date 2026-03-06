const API_BASE_URL = 'http://localhost:8000';

export const api = {
    fetchProgress: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/progress`);
            if (!response.ok) throw new Error('Failed to fetch progress');
            return await response.json();
        } catch (error) {
            console.error('Error fetching progress:', error);
            throw error;
        }
    },

    fetchRoadmap: async (goal) => {
        try {
            const response = await fetch(`${API_BASE_URL}/roadmap/${goal}`);
            if (!response.ok) throw new Error('Failed to fetch roadmap');
            return await response.json();
        } catch (error) {
            console.error('Error fetching roadmap:', error);
            throw error;
        }
    },

    fetchMentorAdvice: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/mentor/advice`);
            if (!response.ok) throw new Error('Failed to fetch mentor advice');
            return await response.json();
        } catch (error) {
            console.error('Error fetching mentor advice:', error);
            throw error;
        }
    },

    fetchMarketDemand: async (role) => {
        try {
            const response = await fetch(`${API_BASE_URL}/market-demand/${role}`);
            if (!response.ok) throw new Error('Failed to fetch market demand');
            return await response.json();
        } catch (error) {
            console.error('Error fetching market demand:', error);
            throw error;
        }
    }
};
