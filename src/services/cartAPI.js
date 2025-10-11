import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const cartAPI = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const cartService = {
    getCart: async () => {
        try {
            const response = await cartAPI.get('/cart')
            console.log(response)
            return response.data
        } catch (err) {
            console.log("Error fetching cart: " + err)
            throw err
        }
    },
    addItemToCart: async (productId, quantity) => {
        try {
            const queryParams = new URLSearchParams({
                productId: productId,
                quantity: quantity,
            })
            const response = await cartAPI.post(`/cart/add?${queryParams}`)
            return response.data
        } catch (err) {
            console.error('Error adding item to cart', err)
            throw err
        }
    },
    removeItemFromCart: async (productId, quantity) => {
        try {
            const queryParams = new URLSearchParams({
                productId: productId,
                quantity: quantity,
            })
            const response = await cartAPI.post(`/cart/remove?${queryParams}`)
            return response.data
        } catch (err) {
            console.error('Error removing item from cart', err)
            throw err
        }
    }
}
export default cartService