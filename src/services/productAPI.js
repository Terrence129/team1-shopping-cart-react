import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const productAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const productService = {
  getProducts: async (params = {}) => {
    const {
      page = 0,
      size = 12,
      keyword = '',
    } = params

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })

    if (keyword) queryParams.append('keyword', keyword)
    try {
      const response = await productAPI.get(`/product?${queryParams}`)
      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },
  getProduct: async (productId) => {
    try {
      const response = await productAPI.get(`/product/${productId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }
}

export default productAPI