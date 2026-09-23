<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">Pemasukan</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-zinc-400">Catat dan pantau semua pemasukan Anda.</p>
      </div>
      <router-link to="/pemasukan/tambah" class="btn-primary inline-flex items-center w-fit">
        <PlusIcon class="w-4 h-4 mr-2" />
        Tambah Pemasukan
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="card p-5">
        <div class="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Total Pemasukan</div>
        <div class="text-2xl font-semibold text-slate-900 dark:text-zinc-50 text-money">{{ formatRupiah(totalJumlah) }}</div>
      </div>
      <div class="card p-5">
        <div class="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Jumlah Transaksi</div>
        <div class="text-2xl font-semibold text-slate-900 dark:text-zinc-50 text-money">{{ data.length }} <span class="text-sm font-normal text-slate-500 dark:text-zinc-500">transaksi</span></div>
      </div>
      <div class="card p-5">
        <div class="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Rata-rata</div>
        <div class="text-2xl font-semibold text-slate-900 dark:text-zinc-50 text-money">{{ formatRupiah(data.length ? totalJumlah / data.length : 0) }}</div>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="h-12 bg-slate-100 dark:bg-zinc-800/50 rounded-lg animate-pulse"></div>
      </div>

      <div v-else-if="data.length === 0" class="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div class="w-16 h-16 bg-slate-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-zinc-800">
          <ReceiptRefundIcon class="w-8 h-8 text-slate-300 dark:text-zinc-600" />
        </div>
        <h3 class="text-sm font-medium text-slate-900 dark:text-zinc-100 mb-1">Belum ada pemasukan</h3>
        <p class="text-sm text-slate-500 dark:text-zinc-400 mb-6 max-w-sm">Mulai catat pemasukan pertama Anda hari ini.</p>
        <router-link to="/pemasukan/tambah" class="btn-primary inline-flex items-center text-sm">
          <PlusIcon class="w-4 h-4 mr-2" />
          Catat Pemasukan
        </router-link>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200/60 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/20">
              <th class="px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider w-2/5">Deskripsi</th>
              <th class="px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Kategori</th>
              <th class="px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Tanggal</th>
              <th class="px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-right">Nominal</th>
              <th class="px-5 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-zinc-800/80">
            <tr v-for="item in data" :key="item.id" class="group hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors">
              <td class="px-5 py-3.5">
                <div class="text-sm font-medium text-slate-900 dark:text-zinc-100">{{ item.judul }}</div>
                <div v-if="item.deskripsi" class="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 truncate max-w-xs">{{ item.deskripsi }}</div>
              </td>
              <td class="px-5 py-3.5">
                <span class="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium border" :style="{ backgroundColor: (item.kategori_warna || '#94a3b8') + '15', color: item.kategori_warna || '#64748b', borderColor: (item.kategori_warna || '#94a3b8') + '30' }">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :style="{ backgroundColor: item.kategori_warna || '#94a3b8' }"></span>
                  {{ item.kategori_nama || 'Lainnya' }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-sm text-slate-600 dark:text-zinc-300">{{ formatTanggal(item.tanggal_transaksi) }}</td>
              <td class="px-5 py-3.5 text-right">
                <span class="text-sm font-semibold text-teal-600 dark:text-teal-400">+ {{ formatRupiah(item.jumlah) }}</span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="remove(item.id)" class="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md border border-slate-200 dark:border-zinc-700 shadow-sm transition-all" title="Hapus">
                    <TrashIcon class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { pemasukanService } from '@/services/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { PlusIcon, TrashIcon, ReceiptRefundIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'DaftarPemasukan',
  components: { PlusIcon, TrashIcon, ReceiptRefundIcon },
  setup() {
    const toast = inject('toast')
    const data = ref([])
    const loading = ref(true)

    const totalJumlah = ref(0)

    const formatTanggal = (date) => {
      if (!date) return '-'
      return format(new Date(date), 'dd MMM yyyy', { locale: id })
    }

    const formatRupiah = (amount) => {
      if (!amount) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    const loadData = async () => {
      try {
        loading.value = true
        const response = await pemasukanService.dapatkanSemua()
        data.value = response.data || []
        totalJumlah.value = data.value.reduce((sum, item) => sum + Number(item.jumlah || 0), 0)
      } catch (error) {
        console.error('Error loading income list:', error)
        toast.error('Gagal memuat data pemasukan: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    const remove = async (id) => {
      try {
        await pemasukanService.hapus(id)
        toast.success('Pemasukan berhasil dihapus')
        await loadData()
      } catch (error) {
        console.error('Error deleting income:', error)
        toast.error('Gagal menghapus pemasukan: ' + error.message)
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      data,
      loading,
      totalJumlah,
      formatTanggal,
      formatRupiah,
      remove,
      loadData
    }
  }
}
</script>
