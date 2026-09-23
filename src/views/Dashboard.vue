<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-zinc-400">Ringkasan aktivitas keuangan Anda</p>
      </div>
      <router-link to="/pengeluaran/tambah" class="btn-primary inline-flex items-center text-sm h-fit">
        <PlusIcon class="w-4 h-4 mr-2" />
        Catat Baru
      </router-link>
    </div>

    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="card p-5 space-y-3">
          <div class="h-3 w-16 bg-slate-100 dark:bg-zinc-800/50 rounded animate-pulse"></div>
          <div class="h-6 w-32 bg-slate-100 dark:bg-zinc-800/50 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-5 relative overflow-hidden group">
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Pengeluaran Bulan Ini</p>
              <p class="text-2xl font-semibold text-slate-900 dark:text-zinc-50 text-money">
                {{ formatRupiah(ringkasan.total_bulan_ini) }}
              </p>
            </div>
            <div class="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
              <CurrencyDollarIcon class="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>

        <div class="card p-5 relative overflow-hidden group">
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Pemasukan Bulan Ini</p>
              <p class="text-2xl font-semibold text-slate-900 dark:text-zinc-50 text-money">
                {{ formatRupiah(ringkasan.total_pemasukan_bulan_ini) }}
              </p>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <ArrowTrendingUpIcon class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div class="card p-5 relative overflow-hidden group">
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Saldo Bersih</p>
              <p class="text-2xl font-semibold text-slate-900 dark:text-zinc-50 text-money">
                {{ formatRupiah(ringkasan.saldo_bersih) }}
              </p>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <CalculatorIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div class="card p-5 relative overflow-hidden group">
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Transaksi Bulan Ini</p>
              <p class="text-2xl font-semibold text-slate-900 dark:text-zinc-50 text-money">
                {{ ringkasan.jumlah_transaksi_bulan_ini }} <span class="text-sm font-normal text-slate-500 dark:text-zinc-500">kali</span>
              </p>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <DocumentTextIcon class="w-5 h-5 text-slate-600 dark:text-zinc-300" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="card lg:col-span-2 flex flex-col">
          <div class="card-header border-b border-slate-100 dark:border-zinc-800/50 p-5">
            <h2 class="text-sm font-semibold text-slate-900 dark:text-zinc-100">Sebaran Kategori</h2>
          </div>
          <div class="card-body p-6 flex-1 flex flex-col justify-center">
            <div v-if="ringkasan.ringkasan_kategori && ringkasan.ringkasan_kategori.length > 0" class="h-64 relative">
              <canvas ref="categoryChart"></canvas>
            </div>
            <div v-else class="text-center py-12 flex flex-col items-center">
              <div class="w-16 h-16 bg-slate-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-zinc-800">
                <TagIcon class="w-8 h-8 text-slate-300 dark:text-zinc-600" />
              </div>
              <p class="text-sm text-slate-500 dark:text-zinc-400">Belum ada data untuk ditampilkan</p>
            </div>
          </div>
        </div>

        <div class="card flex flex-col">
          <div class="card-header border-b border-slate-100 dark:border-zinc-800/50 p-5 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900 dark:text-zinc-100">Baru-baru Ini</h2>
            <router-link to="/pengeluaran" class="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors">
              Lihat Semua &rarr;
            </router-link>
          </div>
          <div class="p-0 flex-1 overflow-y-auto max-h-[320px]">
            <div v-if="transaksiTerbaru.length > 0" class="divide-y divide-slate-100 dark:divide-zinc-800/50">
              <div
                v-for="transaksi in transaksiTerbaru"
                :key="transaksi.id"
                class="p-4 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors flex items-start justify-between gap-3 group"
              >
                <div class="flex items-start gap-3 overflow-hidden">
                  <div class="w-2 h-2 mt-2 rounded-full shrink-0" :style="{ backgroundColor: transaksi.kategori_warna || '#94a3b8' }"></div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-slate-900 dark:text-zinc-100 truncate">{{ transaksi.judul }}</p>
                    <p class="text-xs text-slate-500 dark:text-zinc-400 truncate">{{ transaksi.kategori_nama || 'Lainnya' }}</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-sm font-semibold text-slate-900 dark:text-zinc-100 text-money">{{ formatRupiah(transaksi.jumlah) }}</p>
                  <p class="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{{ formatTanggalPendek(transaksi.tanggal_transaksi) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-10 px-4">
              <p class="text-sm text-slate-500 dark:text-zinc-400">Belum ada transaksi bulan ini.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { pengeluaranService } from '@/services/api'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import Chart from 'chart.js/auto'
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CalculatorIcon,
  TagIcon,
  PlusIcon,
  ArrowTrendingUpIcon
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
    ArrowTrendingUpIcon
  },
  setup() {
    const toast = inject('toast')
    const loading = ref(true)
    const categoryChart = ref(null)
    let chartInstance = null
    const transaksiTerbaru = ref([])

    const ringkasan = ref({
      total_bulan_ini: 0,
      total_tahun_ini: 0,
      total_pemasukan_bulan_ini: 0,
      saldo_bersih: 0,
      jumlah_transaksi_bulan_ini: 0,
      rata_rata_per_hari: 0,
      ringkasan_kategori: []
    })

    const formatRupiah = (amount) => {
      if (!amount) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    const formatTanggal = (date) => {
      if (!date) return '-'
      return format(parseISO(date), 'dd MMMM yyyy', { locale: id })
    }

    const formatTanggalPendek = (date) => {
      if (!date) return '-'
      return format(parseISO(date), 'dd MMM', { locale: id })
    }

    const initChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      if (!categoryChart.value || !ringkasan.value.ringkasan_kategori?.length) return

      const ctx = categoryChart.value.getContext('2d')
      const data = ringkasan.value.ringkasan_kategori
      const isDark = document.documentElement.classList.contains('dark')
      const textColor = isDark ? '#a1a1aa' : '#64748b'

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(item => item.nama),
          datasets: [{
            data: data.map(item => item.total),
            backgroundColor: data.map(item => item.warna),
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                usePointStyle: true,
                padding: 20,
                color: textColor,
                font: {
                  family: 'Inter',
                  size: 12
                }
              }
            },
            tooltip: {
              backgroundColor: isDark ? '#18181b' : '#ffffff',
              titleColor: isDark ? '#f4f4f5' : '#0f172a',
              bodyColor: isDark ? '#a1a1aa' : '#475569',
              borderColor: isDark ? '#27272a' : '#e2e8f0',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              boxPadding: 6,
              callbacks: {
                label: function(context) {
                  let label = context.label || ''
                  if (label) {
                    label += ': '
                  }
                  if (context.parsed !== null) {
                    label += new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(context.parsed)
                  }
                  return label
                }
              }
            }
          }
        }
      })
    }

    const loadData = async () => {
      try {
        loading.value = true
        const now = new Date()
        const response = await pengeluaranService.dapatkanRingkasan({
          bulan: now.getMonth() + 1,
          tahun: now.getFullYear()
        })

        if (response.data) {
          ringkasan.value = {
            total_bulan_ini: response.data.total_pengeluaran || 0,
            total_tahun_ini: response.data.total_pengeluaran || 0,
            total_pemasukan_bulan_ini: response.data.total_income || 0,
            saldo_bersih: response.data.net_balance || 0,
            jumlah_transaksi_bulan_ini: 0,
            rata_rata_per_hari: 0,
            ringkasan_kategori: response.data.ringkasan_kategori || []
          }
        }

        const responseTransaksi = await pengeluaranService.dapatkanSemua({ limit: 5 })
        if (responseTransaksi.data) {
          transaksiTerbaru.value = responseTransaksi.data.slice(0, 5)
          ringkasan.value.jumlah_transaksi_bulan_ini = responseTransaksi.data.length
          if (responseTransaksi.data.length > 0) {
            ringkasan.value.rata_rata_per_hari = ringkasan.value.total_bulan_ini / 30
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        toast.error('Gagal memuat data dashboard')
      } finally {
        loading.value = false
        setTimeout(initChart, 100)
      }
    }

    onMounted(() => {
      loadData()
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            initChart()
          }
        })
      })

      observer.observe(document.documentElement, {
        attributes: true
      })
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      loading,
      ringkasan,
      transaksiTerbaru,
      categoryChart,
      formatRupiah,
      formatTanggal,
      formatTanggalPendek
    }
  }
}
</script>
