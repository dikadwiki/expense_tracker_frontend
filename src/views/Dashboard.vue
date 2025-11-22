<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
    <!-- Header -->
    <div class="mb-8 animate-slideDown">
      <h1 class="text-4xl font-black text-gray-900 dark:text-white mb-2 gradient-text">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg font-medium">Ringkasan pengeluaran dan aktivitas keuangan Anda</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="card">
          <div class="card-body">
            <div class="loading-shimmer h-4 w-20 rounded mb-2"></div>
            <div class="loading-shimmer h-8 w-32 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Pengeluaran Bulan Ini -->
        <div class="card bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 animate-slideUp" style="animation-delay: 0.1s">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-primary-100 text-sm font-semibold mb-1">Total Bulan Ini</p>
                <p class="text-3xl font-black text-money drop-shadow-lg">
                  {{ formatRupiah(ringkasan.total_bulan_ini) }}
                </p>
              </div>
              <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <CurrencyDollarIcon class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Total Pengeluaran Tahun Ini -->
        <div class="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-xl transform hover:scale-105 transition-all duration-300 animate-slideUp" style="animation-delay: 0.2s">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-300 text-sm font-semibold mb-1">Total Tahun Ini</p>
                <p class="text-3xl font-black text-gray-900 dark:text-white text-money">
                  {{ formatRupiah(ringkasan.total_tahun_ini) }}
                </p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ChartBarIcon class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Jumlah Transaksi -->
        <div class="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 shadow-xl transform hover:scale-105 transition-all duration-300 animate-slideUp" style="animation-delay: 0.3s">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-300 text-sm font-semibold mb-1">Transaksi Bulan Ini</p>
                <p class="text-3xl font-black text-gray-900 dark:text-white">
                  {{ ringkasan.jumlah_transaksi_bulan_ini }}
                </p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DocumentTextIcon class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Rata-rata Pengeluaran -->
        <div class="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-xl transform hover:scale-105 transition-all duration-300 animate-slideUp" style="animation-delay: 0.4s">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-300 text-sm font-semibold mb-1">Rata-rata/Hari</p>
                <p class="text-3xl font-black text-gray-900 dark:text-white text-money">
                  {{ formatRupiah(ringkasan.rata_rata_per_hari) }}
                </p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CalculatorIcon class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Pengeluaran per Kategori -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-gray-900">Pengeluaran per Kategori</h2>
          </div>
          <div class="card-body">
            <div v-if="ringkasan.ringkasan_kategori && ringkasan.ringkasan_kategori.length > 0">
              <canvas ref="categoryChart" class="max-h-64"></canvas>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <TagIcon class="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada data pengeluaran</p>
            </div>
          </div>
        </div>

        <!-- Transaksi Terbaru -->
        <div class="card">
          <div class="card-header flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Transaksi Terbaru</h2>
            <router-link
              to="/pengeluaran"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Lihat Semua
            </router-link>
          </div>
          <div class="card-body p-0">
            <div v-if="transaksiTerbaru.length > 0" class="divide-y divide-gray-100">
              <div
                v-for="transaksi in transaksiTerbaru"
                :key="transaksi.id"
                class="p-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      :style="{ backgroundColor: transaksi.kategori_warna + '20' }"
                    >
                      <div
                        class="w-2 h-2 rounded-full"
                        :style="{ backgroundColor: transaksi.kategori_warna }"
                      ></div>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ transaksi.judul }}</p>
                      <p class="text-sm text-gray-500">
                        {{ transaksi.kategori_nama || 'Tanpa Kategori' }} • 
                        {{ formatTanggal(transaksi.tanggal_transaksi) }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900 text-money">
                      {{ formatRupiah(transaksi.jumlah) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <DocumentTextIcon class="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada transaksi</p>
              <router-link
                to="/pengeluaran/tambah"
                class="mt-3 inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <PlusIcon class="w-4 h-4 mr-1" />
                Tambah Pengeluaran
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-gray-900">Aksi Cepat</h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <router-link
              to="/pengeluaran/tambah"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
                <PlusIcon class="w-5 h-5 text-primary-600" />
              </div>
              <div class="ml-3">
                <p class="font-medium text-gray-900">Tambah Pengeluaran</p>
                <p class="text-sm text-gray-500">Catat pengeluaran baru</p>
              </div>
            </router-link>

            <router-link
              to="/kategori"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <TagIcon class="w-5 h-5 text-blue-600" />
              </div>
              <div class="ml-3">
                <p class="font-medium text-gray-900">Kelola Kategori</p>
                <p class="text-sm text-gray-500">Atur kategori pengeluaran</p>
              </div>
            </router-link>

            <router-link
              to="/laporan"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                <ChartBarIcon class="w-5 h-5 text-green-600" />
              </div>
              <div class="ml-3">
                <p class="font-medium text-gray-900">Lihat Laporan</p>
                <p class="text-sm text-gray-500">Analisis pengeluaran</p>
              </div>
            </router-link>

            <router-link
              to="/pengeluaran"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                <DocumentTextIcon class="w-5 h-5 text-purple-600" />
              </div>
              <div class="ml-3">
                <p class="font-medium text-gray-900">Riwayat Transaksi</p>
                <p class="text-sm text-gray-500">Lihat semua pengeluaran</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { pengeluaranService } from '@/services/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Chart from 'chart.js/auto'

// Import icons
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CalculatorIcon,
  TagIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'Dashboard',
  components: {
    CurrencyDollarIcon,
    ChartBarIcon,
    DocumentTextIcon,
    CalculatorIcon,
    TagIcon,
    PlusIcon,
  },
  setup() {
    const toast = inject('toast')
    const loading = ref(true)
    const ringkasan = ref({
      total_bulan_ini: 0,
      total_tahun_ini: 0,
      jumlah_transaksi_bulan_ini: 0,
      rata_rata_per_hari: 0,
      ringkasan_kategori: []
    })
    const transaksiTerbaru = ref([])
    const categoryChart = ref(null)
    let chartInstance = null

    // Format currency
    const formatRupiah = (amount) => {
      if (!amount) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    // Format date
    const formatTanggal = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: id })
    }

    // Load dashboard data
    const loadDashboardData = async () => {
      try {
        loading.value = true
        
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentYear = currentDate.getFullYear()

        // Load ringkasan bulan ini
        const ringkasanBulanIni = await pengeluaranService.dapatkanRingkasan({
          bulan: currentMonth,
          tahun: currentYear
        })

        // Load ringkasan tahun ini
        const ringkasanTahunIni = await pengeluaranService.dapatkanRingkasan({
          tahun: currentYear
        })

        // Load transaksi terbaru
        const transaksi = await pengeluaranService.dapatkanSemua({ limit: 5 })

        // Hitung jumlah transaksi bulan ini
        const jumlahTransaksiBulanIni = transaksi.data.filter(t => {
          const tanggalTransaksi = new Date(t.tanggal_transaksi)
          return tanggalTransaksi.getMonth() === currentDate.getMonth() && 
                 tanggalTransaksi.getFullYear() === currentDate.getFullYear()
        }).length

        // Hitung rata-rata per hari
        const hariDalamBulan = new Date(currentYear, currentMonth, 0).getDate()
        const rataRataPerHari = ringkasanBulanIni.data.total_pengeluaran / hariDalamBulan

        ringkasan.value = {
          total_bulan_ini: ringkasanBulanIni.data.total_pengeluaran || 0,
          total_tahun_ini: ringkasanTahunIni.data.total_pengeluaran || 0,
          jumlah_transaksi_bulan_ini: jumlahTransaksiBulanIni,
          rata_rata_per_hari: rataRataPerHari || 0,
          ringkasan_kategori: ringkasanBulanIni.data.ringkasan_kategori || []
        }

        transaksiTerbaru.value = transaksi.data || []

        // Buat chart setelah data loaded
        setTimeout(() => {
          createCategoryChart()
        }, 100)

      } catch (error) {
        console.error('Error loading dashboard data:', error)
        toast.error('Gagal memuat data dashboard: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    // Create category chart
    const createCategoryChart = () => {
      if (!categoryChart.value || !ringkasan.value.ringkasan_kategori.length) return

      // Destroy existing chart
      if (chartInstance) {
        chartInstance.destroy()
      }

      const ctx = categoryChart.value.getContext('2d')
      const data = ringkasan.value.ringkasan_kategori

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(item => item.nama || 'Tanpa Kategori'),
          datasets: [{
            data: data.map(item => item.total),
            backgroundColor: data.map(item => item.warna || '#6B7280'),
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = formatRupiah(context.parsed)
                  return `${label}: ${value}`
                }
              }
            }
          },
          cutout: '60%',
          elements: {
            arc: {
              borderRadius: 4
            }
          }
        }
      })
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      loading,
      ringkasan,
      transaksiTerbaru,
      categoryChart,
      formatRupiah,
      formatTanggal,
      loadDashboardData
    }
  }
}
</script>