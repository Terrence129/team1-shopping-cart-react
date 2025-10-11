import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authService = {
  login: async (credentials) => {
    try {
      const response = await authAPI.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      await authAPI.post('/auth/logout')
    } catch (error) {
      console.error('Error logging out:', error)
      throw error
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await authAPI.get('/auth/me')
      return response.data
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  },

  register: async (credentials) => {
    try {
      const response = await authAPI.post('/auth/register', credentials)
      return response.data
    } catch (error) {
      console.error('Error register:', error)
      throw error
    }
  }
}

export default authAPI