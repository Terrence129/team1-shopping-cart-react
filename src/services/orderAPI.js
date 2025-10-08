import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const orderAPI = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const orderService = {
   checkout: async (checkoutReq) => {
       try {
           const response = await orderAPI.post('/order/checkout', checkoutReq)
           console.log(response)
           return response.data
       } catch (error) {
           console.log(error)
           throw error
       }

   },
    getOrders: async () => {
       try {
           const response = await orderAPI.get('/order')
           return response.data
       } catch (error) {
           console.log(error)
           throw error
       }
    },
    getOrder: async (orderId) => {
       try {
           const response = await orderAPI.get('/order/' + orderId)
           return response.data
       } catch (error) {
           console.log(error)
           throw error
       }
    },
    payOrder: async (orderId) => {
       try {
           const response = await orderAPI.post(`/order/${orderId}/pay`)
           return response.data
       } catch (error) {
           console.log(error)
           throw error
       }
    }
}
export default orderService