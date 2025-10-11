import axios from 'axios'

// Konfigurasi base URL API
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

// Buat instance axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log request untuk debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response untuk debugging
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('Response Error:', error)
    
    if (error.response) {
      // Server merespons dengan status error
      const errorMessage = error.response.data?.pesan || 'Terjadi kesalahan pada server'
      throw new Error(errorMessage)
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      throw new Error('Tidak dapat terhubung ke server')
    } else {
      // Error lainnya
      throw new Error(error.message || 'Terjadi kesalahan yang tidak diketahui')
    }
  }
)

// Service untuk Pengeluaran
export const pengeluaranService = {
  // Dapatkan semua pengeluaran
  async dapatkanSemua(params = {}) {
    const response = await apiClient.get('/pengeluaran', { params })
    return response.data
  },

  // Dapatkan pengeluaran berdasarkan ID
  async dapatkanBerdasarkanId(id) {
    const response = await apiClient.get(`/pengeluaran/${id}`)
    return response.data
  },

  // Tambah pengeluaran baru
  async tambah(data) {
    const response = await apiClient.post('/pengeluaran', data)
    return response.data
  },

  // Perbarui pengeluaran
  async perbarui(id, data) {
    const response = await apiClient.put(`/pengeluaran/${id}`, data)
    return response.data
  },

  // Hapus pengeluaran
  async hapus(id) {
    const response = await apiClient.delete(`/pengeluaran/${id}`)
    return response.data
  },

  // Dapatkan ringkasan pengeluaran
  async dapatkanRingkasan(params = {}) {
    const response = await apiClient.get('/pengeluaran/ringkasan', { params })
    return response.data
  },
}

// Service untuk Kategori
export const kategoriService = {
  // Dapatkan semua kategori
  async dapatkanSemua() {
    const response = await apiClient.get('/kategori')
    return response.data
  },

  // Dapatkan kategori berdasarkan ID
  async dapatkanBerdasarkanId(id) {
    const response = await apiClient.get(`/kategori/${id}`)
    return response.data
  },

  // Tambah kategori baru
  async tambah(data) {
    const response = await apiClient.post('/kategori', data)
    return response.data
  },

  // Perbarui kategori
  async perbarui(id, data) {
    const response = await apiClient.put(`/kategori/${id}`, data)
    return response.data
  },

  // Hapus kategori
  async hapus(id) {
    const response = await apiClient.delete(`/kategori/${id}`)
    return response.data
  },
}

// Service untuk Health Check
export const healthService = {
  async check() {
    const response = await apiClient.get('/health')
    return response.data
  },
}

// Export default apiClient untuk keperluan khusus
export default apiClient