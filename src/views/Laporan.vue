<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Laporan Pengeluaran</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Analisis detail pengeluaran dan tren keuangan Anda</p>
    </div>

    <!-- Period Filter -->
    <div class="card mb-8 dark:bg-gray-800">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div class="md:col-span-2">
            <label class="form-label dark:text-gray-300">Periode Laporan</label>
            <div class="flex space-x-2">
              <select v-model="selectedMonth" @change="loadData" class="form-input dark:bg-gray-700 dark:text-gray-100">
                <option value="">Semua Bulan</option>
                <option v-for="month in months" :key="month.value" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
              <select v-model="selectedYear" @change="loadData" class="form-input dark:bg-gray-700 dark:text-gray-100">
                <option v-for="year in availableYears" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <button @click="exportData" class="btn-secondary w-full" :disabled="loading">
              <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
              Export CSV
            </button>
          </div>
          
          <div>
            <button @click="loadData" class="btn-primary w-full" :disabled="loading">
              <MagnifyingGlassIcon class="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="card dark:bg-gray-800">
          <div class="card-body">
            <div class="loading-shimmer h-16 rounded"></div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div v-for="i in 2" :key="i" class="card dark:bg-gray-800">
          <div class="card-body">
            <div class="loading-shimmer h-64 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Pengeluaran -->
        <div class="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-100 text-sm font-medium">Total Pengeluaran</p>
                <p class="text-2xl font-bold text-money">{{ formatRupiah(summary.total_pengeluaran) }}</p>
                <p class="text-red-100 text-xs mt-1">{{ getPeriodText() }}</p>
              </div>
              <div class="w-12 h-12 bg-red-400 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon class="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Rata-rata per Transaksi -->
        <div class="card dark:bg-gray-800">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Rata-rata/Transaksi</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 text-money">{{ formatRupiah(summary.rata_rata_transaksi) }}</p>
                <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">Dari {{ summary.jumlah_transaksi }} transaksi</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <CalculatorIcon class="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>
        </div>

        <!-- Kategori Terbanyak -->
        <div class="card dark:bg-gray-800">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div class="min-w-0">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Kategori Terbanyak</p>
                <p class="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                  {{ summary.kategori_terbanyak?.nama || 'Tanpa Kategori' }}
                </p>
                <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {{ formatRupiah(summary.kategori_terbanyak?.total || 0) }}
                </p>
              </div>
              <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                   :style="{ backgroundColor: summary.kategori_terbanyak?.warna + '20' || '#374151' }">
                <TagIcon class="w-6 h-6" :style="{ color: summary.kategori_terbanyak?.warna || '#9CA3AF' }" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- Pengeluaran per Kategori -->
        <div class="card dark:bg-gray-800">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Distribusi per Kategori</h2>
          </div>
          <div class="card-body">
            <div v-if="chartData.kategori.length > 0">
              <canvas ref="categoryChart" class="max-h-80"></canvas>
              <div class="mt-4 space-y-2">
                <div v-for="item in chartData.kategori" :key="item.nama" class="flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.warna }"></div>
                    <span class="text-gray-700 dark:text-gray-300">{{ item.nama || 'Tanpa Kategori' }}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-gray-900 dark:text-gray-100">{{ formatRupiah(item.total) }}</div>
                    <div class="text-gray-500 dark:text-gray-400">{{ item.percentage }}%</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
              <ChartPieIcon class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>Tidak ada data untuk periode ini</p>
            </div>
          </div>
        </div>

        <!-- Tren Pengeluaran -->
        <div class="card dark:bg-gray-800">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Tren Pengeluaran</h2>
          </div>
          <div class="card-body">
            <div v-if="chartData.trend.length > 0">
              <canvas ref="trendChart" class="max-h-80"></canvas>
            </div>
            <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
              <ChartBarIcon class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>Tidak ada data untuk periode ini</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card dark:bg-gray-800">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Detail per Kategori</h2>
        </div>
        <div class="card-body p-0">
          <div v-if="chartData.kategori.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kategori</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jumlah Transaksi</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Pengeluaran</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rata-rata</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Persentase</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="item in chartData.kategori" :key="item.nama" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: item.warna }"></div>
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.nama || 'Tanpa Kategori' }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100">{{ item.jumlah_transaksi }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-gray-100 text-money">{{ formatRupiah(item.total) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100 text-money">{{ formatRupiah(item.rata_rata) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                      {{ item.percentage }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
            <DocumentTextIcon class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Tidak ada data untuk periode ini</p>
          </div>
        </div>
      </div>

      <!-- Monthly Comparison -->
      <div v-if="!selectedMonth && monthlyComparison.length > 0" class="card dark:bg-gray-800">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Perbandingan Bulanan {{ selectedYear }}</h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="month in monthlyComparison" :key="month.bulan" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{{ getMonthName(month.bulan) }}</div>
              <div class="text-lg font-bold text-primary-600 dark:text-primary-300 text-money">{{ formatRupiah(month.total) }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ month.transaksi }} transaksi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted, inject, nextTick } from 'vue'
import { pengeluaranService } from '@/services/api'
import { format, startOfYear, endOfYear, eachMonthOfInterval, getMonth, getYear } from 'date-fns'
import { id } from 'date-fns/locale'
import Chart from 'chart.js/auto'

// Import icons
import {
  CurrencyDollarIcon,
  CalculatorIcon,
  TagIcon,
  ChartBarIcon,
  ChartPieIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'Laporan',
  components: {
    CurrencyDollarIcon,
    CalculatorIcon,
    TagIcon,
    ChartBarIcon,
    ChartPieIcon,
    DocumentTextIcon,
    DocumentArrowDownIcon,
    MagnifyingGlassIcon,
  },
  setup() {
    const toast = inject('toast')
    const loading = ref(true)
    
    // Filters
    const selectedMonth = ref('')
    const selectedYear = ref(new Date().getFullYear())
    
    // Data
    const summary = ref({
      total_pengeluaran: 0,
      jumlah_transaksi: 0,
      rata_rata_transaksi: 0,
      kategori_terbanyak: null
    })
    
    const chartData = ref({
      kategori: [],
      trend: []
    })
    
    const monthlyComparison = ref([])
    
    // Chart refs
    const categoryChart = ref(null)
    const trendChart = ref(null)
    let categoryChartInstance = null
    let trendChartInstance = null

    // Available years (last 5 years)
    const availableYears = computed(() => {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let i = 0; i < 5; i++) {
        years.push(currentYear - i)
      }
      return years
    })

    // Months
    const months = [
      { value: 1, label: 'Januari' },
      { value: 2, label: 'Februari' },
      { value: 3, label: 'Maret' },
      { value: 4, label: 'April' },
      { value: 5, label: 'Mei' },
      { value: 6, label: 'Juni' },
      { value: 7, label: 'Juli' },
      { value: 8, label: 'Agustus' },
      { value: 9, label: 'September' },
      { value: 10, label: 'Oktober' },
      { value: 11, label: 'November' },
      { value: 12, label: 'Desember' }
    ]

    // Format functions
    const formatRupiah = (amount) => {
      if (!amount) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    const getPeriodText = () => {
      if (selectedMonth.value) {
        const monthName = months.find(m => m.value === parseInt(selectedMonth.value))?.label
        return `${monthName} ${selectedYear.value}`
      }
      return `Tahun ${selectedYear.value}`
    }

    const getMonthName = (monthNumber) => {
      return months.find(m => m.value === monthNumber)?.label || `Bulan ${monthNumber}`
    }

    // Load data
    const loadData = async () => {
      try {
        loading.value = true

        const params = {
          tahun: selectedYear.value
        }

        if (selectedMonth.value) {
          params.bulan = selectedMonth.value
        }

        // Load summary data
        const ringkasanResponse = await pengeluaranService.dapatkanRingkasan(params)
        const data = ringkasanResponse.data

        summary.value = {
          total_pengeluaran: data.total_pengeluaran || 0,
          jumlah_transaksi: data.ringkasan_kategori?.reduce((sum, item) => sum + (item.jumlah_transaksi || 0), 0) || 0,
          rata_rata_transaksi: 0,
          kategori_terbanyak: null
        }

        // Calculate rata-rata transaksi
        if (summary.value.jumlah_transaksi > 0) {
          summary.value.rata_rata_transaksi = summary.value.total_pengeluaran / summary.value.jumlah_transaksi
        }

        // Process kategori data
        if (data.ringkasan_kategori && data.ringkasan_kategori.length > 0) {
          const kategoriData = data.ringkasan_kategori.map(item => ({
            nama: item.nama || 'Tanpa Kategori',
            warna: item.warna || '#6B7280',
            total: parseFloat(item.total) || 0,
            jumlah_transaksi: item.jumlah_transaksi || 0,
            rata_rata: (parseFloat(item.total) || 0) / (item.jumlah_transaksi || 1),
            percentage: summary.value.total_pengeluaran > 0 
              ? Math.round((parseFloat(item.total) / summary.value.total_pengeluaran) * 100)
              : 0
          })).sort((a, b) => b.total - a.total)

          chartData.value.kategori = kategoriData
          summary.value.kategori_terbanyak = kategoriData[0] || null
        } else {
          chartData.value.kategori = []
          summary.value.kategori_terbanyak = null
        }

        // Load monthly comparison if showing yearly data
        if (!selectedMonth.value) {
          await loadMonthlyComparison()
        }

        // Create charts after data is loaded
        nextTick(() => {
          createCharts()
        })

      } catch (error) {
        console.error('Error loading report data:', error)
        toast.error('Gagal memuat data laporan: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    // Load monthly comparison
    const loadMonthlyComparison = async () => {
      try {
        const monthlyData = []
        
        for (let month = 1; month <= 12; month++) {
          const response = await pengeluaranService.dapatkanRingkasan({
            bulan: month,
            tahun: selectedYear.value
          })
          
          const total = response.data.total_pengeluaran || 0
          const transaksi = response.data.ringkasan_kategori?.reduce((sum, item) => sum + (item.jumlah_transaksi || 0), 0) || 0
          
          monthlyData.push({
            bulan: month,
            total,
            transaksi
          })
        }

        monthlyComparison.value = monthlyData
        
        // Prepare trend chart data
        chartData.value.trend = monthlyData.map(item => ({
          label: getMonthName(item.bulan),
          value: item.total
        }))

      } catch (error) {
        console.error('Error loading monthly comparison:', error)
      }
    }

    // Create charts
    const createCharts = () => {
      createCategoryChart()
      if (!selectedMonth.value) {
        createTrendChart()
      }
    }

    // Create category chart (pie/doughnut)
    const createCategoryChart = () => {
      if (!categoryChart.value || chartData.value.kategori.length === 0) return

      // Destroy existing chart
      if (categoryChartInstance) {
        categoryChartInstance.destroy()
      }

      const ctx = categoryChart.value.getContext('2d')
      const data = chartData.value.kategori

      categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(item => item.nama),
          datasets: [{
            data: data.map(item => item.total),
            backgroundColor: data.map(item => item.warna),
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // We show our own legend
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = formatRupiah(context.parsed)
                  const percentage = data[context.dataIndex].percentage
                  return `${label}: ${value} (${percentage}%)`
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

    // Create trend chart (line)
    const createTrendChart = () => {
      if (!trendChart.value || chartData.value.trend.length === 0) return

      // Destroy existing chart
      if (trendChartInstance) {
        trendChartInstance.destroy()
      }

      const ctx = trendChart.value.getContext('2d')
      const data = chartData.value.trend

      trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.label),
          datasets: [{
            label: 'Pengeluaran',
            data: data.map(item => item.value),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Pengeluaran: ${formatRupiah(context.parsed.y)}`
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return formatRupiah(value)
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          elements: {
            point: {
              hoverBackgroundColor: '#1D4ED8'
            }
          }
        }
      })
    }

    // Export data to CSV
    const exportData = () => {
      try {
        const headers = ['Kategori', 'Jumlah Transaksi', 'Total Pengeluaran', 'Rata-rata', 'Persentase']
        const csvContent = [
          headers.join(','),
          ...chartData.value.kategori.map(item => [
            `"${item.nama}"`,
            item.jumlah_transaksi,
            item.total,
            item.rata_rata.toFixed(2),
            `${item.percentage}%`
          ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', `laporan-pengeluaran-${getPeriodText().replace(/\s/g, '-').toLowerCase()}.csv`)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          toast.success('Data berhasil diekspor')
        }
      } catch (error) {
        console.error('Error exporting data:', error)
        toast.error('Gagal mengekspor data')
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      selectedMonth,
      selectedYear,
      availableYears,
      months,
      summary,
      chartData,
      monthlyComparison,
      categoryChart,
      trendChart,
      formatRupiah,
      getPeriodText,
      getMonthName,
      loadData,
      exportData
    }
  }
}
</script>