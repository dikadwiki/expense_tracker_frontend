<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">Transaksiku</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-zinc-400">Catat dan pantau semua pengeluaran Anda.</p>
      </div>
      <router-link to="/pengeluaran/tambah" class="btn-primary inline-flex items-center w-fit">
        <PlusIcon class="w-4 h-4 mr-2" />
        Tambah Baru
      </router-link>
    </div>

    <!-- Mini Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
       <div class="card p-5">
         <div class="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Total Terfilter</div>
         <div class="text-2xl font-semibold text-slate-900 dark:text-zinc-50 text-money">{{ formatRupiah(totalFiltered) }}</div>
       </div>
       <div class="card p-5">
         <div class="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Jumlah Transaksi</div>
         <div class="text-2xl font-semibold text-slate-900 dark:text-zinc-50 text-money">{{ filteredCount }} <span class="text-sm font-normal text-slate-500 dark:text-zinc-500">transaksi</span></div>
       </div>
       <div class="card p-5">
         <div class="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Rata-rata Transaksi</div>
         <div class="text-2xl font-semibold text-slate-900 dark:text-zinc-50 text-money">{{ formatRupiah(filteredCount > 0 ? totalFiltered / filteredCount : 0) }}</div>
       </div>
    </div>

    <!-- Filter Bar Segmented -->
    <div class="card mb-6 p-2 flex flex-col md:flex-row gap-2 md:items-center">
       <div class="relative flex-1">
         <MagnifyingGlassIcon class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
         <input v-model="filters.search" type="text" placeholder="Cari transaksi..." class="w-full pl-9 pr-3 py-2 bg-slate-50/50 dark:bg-zinc-900/50 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 focus:border-slate-300 dark:focus:border-zinc-600 rounded-md text-sm transition-all outline-none text-slate-800 dark:text-zinc-200" @input="debouncedSearch">
       </div>
       <div class="w-px h-6 bg-slate-200 dark:bg-zinc-800 hidden md:block mx-1"></div>
       <select v-model="filters.kategori" @change="applyFilters" class="py-2 pl-3 pr-8 bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-md text-sm text-slate-600 dark:text-zinc-300 outline-none transition-all cursor-pointer">
         <option value="">Semua Kategori</option>
         <option v-for="k in daftarKategori" :key="k.id" :value="k.id">{{ k.nama }}</option>
       </select>
       <input v-model="filters.tanggal_mulai" type="date" class="py-2 px-3 bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-md text-sm text-slate-600 dark:text-zinc-300 outline-none transition-all cursor-pointer" @change="applyFilters">
       <span class="text-slate-400 hidden md:inline">-</span>
       <input v-model="filters.tanggal_akhir" type="date" class="py-2 px-3 bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-md text-sm text-slate-600 dark:text-zinc-300 outline-none transition-all cursor-pointer" @change="applyFilters">
       
       <button v-if="hasActiveFilters" @click="resetFilters" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-all md:ml-auto flex items-center justify-center" title="Reset Filter">
         <XMarkIcon class="w-4 h-4" />
       </button>
    </div>

    <!-- Table Content -->
    <div class="card overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="h-12 bg-slate-100 dark:bg-zinc-800/50 rounded-lg animate-pulse"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="pengeluaran.length === 0" class="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div class="w-16 h-16 bg-slate-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-zinc-800">
           <ReceiptRefundIcon class="w-8 h-8 text-slate-300 dark:text-zinc-600" />
        </div>
        <h3 class="text-sm font-medium text-slate-900 dark:text-zinc-100 mb-1">Belum ada transaksi</h3>
        <p class="text-sm text-slate-500 dark:text-zinc-400 mb-6 max-w-sm">{{ hasActiveFilters ? 'Coba ubah filter pencarian Anda.' : 'Mulai catat pengeluaran pertama Anda hari ini.' }}</p>
        <router-link v-if="!hasActiveFilters" to="/pengeluaran/tambah" class="btn-primary inline-flex items-center text-sm">
          <PlusIcon class="w-4 h-4 mr-2" />
          Catat Pengeluaran
        </router-link>
        <button v-else @click="resetFilters" class="btn-secondary text-sm">Reset Filter</button>
      </div>

      <!-- Data -->
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
            <tr v-for="item in pengeluaran" :key="item.id" class="group hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors">
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
              <td class="px-5 py-3.5 text-sm text-slate-600 dark:text-zinc-300">
                {{ formatTanggal(item.tanggal_transaksi) }}
              </td>
              <td class="px-5 py-3.5 text-right">
                <span class="text-sm font-semibold text-slate-900 dark:text-zinc-100 text-money">{{ formatRupiah(item.jumlah) }}</span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <router-link :to="`/pengeluaran/edit/${item.id}`" class="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 bg-white dark:bg-zinc-900 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-md border border-slate-200 dark:border-zinc-700 shadow-sm transition-all" title="Edit">
                    <PencilIcon class="w-3.5 h-3.5" />
                  </router-link>
                  <button @click="confirmDelete(item)" class="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md border border-slate-200 dark:border-zinc-700 shadow-sm transition-all" title="Hapus">
                    <TrashIcon class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="border-t border-slate-200/60 dark:border-zinc-800 p-4 flex items-center justify-between bg-slate-50/30 dark:bg-zinc-900/20">
         <div class="text-xs text-slate-500 dark:text-zinc-400">
           Menampilkan <span class="font-medium text-slate-700 dark:text-zinc-200">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> - <span class="font-medium text-slate-700 dark:text-zinc-200">{{ Math.min(currentPage * itemsPerPage, totalCount) }}</span> dari <span class="font-medium text-slate-700 dark:text-zinc-200">{{ totalCount }}</span>
         </div>
         <div class="flex space-x-1">
           <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-2.5 py-1.5 border border-slate-200 dark:border-zinc-700 rounded-md text-xs font-medium text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
             Prev
           </button>
           <button v-for="page in visiblePages" :key="page" @click="changePage(page)" class="px-2.5 py-1.5 border rounded-md text-xs font-medium transition-colors" :class="page === currentPage ? 'bg-slate-900 dark:bg-teal-600 border-slate-900 dark:border-teal-500 text-white' : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700'">
             {{ page }}
           </button>
           <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-2.5 py-1.5 border border-slate-200 dark:border-zinc-700 rounded-md text-xs font-medium text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
             Next
           </button>
         </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ModalDialog
      :show="showDeleteModal"
      type="danger"
      title="Hapus Transaksi"
      :message="`Yakin ingin menghapus transaksi '${selectedItem?.judul}'?`"
      :show-default-buttons="true"
      cancel-text="Batal"
      confirm-text="Hapus"
      @close="showDeleteModal = false"
      @cancel="showDeleteModal = false"
      @confirm="deleteItem"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { pengeluaranService, kategoriService } from '@/services/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

// Import icons
import {
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  ReceiptRefundIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'DaftarPengeluaran',
  components: {
    PlusIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    PencilIcon,
    XMarkIcon,
    ReceiptRefundIcon,
  },
  setup() {
    const toast = inject('toast')
    const loading = ref(true)
    const pengeluaran = ref([])
    const daftarKategori = ref([])
    const showDeleteModal = ref(false)
    const selectedItem = ref(null)

    // Filter state
    const filters = ref({
      search: '',
      kategori: '',
      tanggal_mulai: '',
      tanggal_akhir: ''
    })

    // Pagination state
    const currentPage = ref(1)
    const itemsPerPage = 20
    const totalCount = ref(0)
    const allPengeluaran = ref([])

    // Computed properties
    const hasActiveFilters = computed(() => {
      return filters.value.search || 
             filters.value.kategori || 
             filters.value.tanggal_mulai || 
             filters.value.tanggal_akhir
    })

    const filteredPengeluaran = computed(() => {
      let result = [...allPengeluaran.value]

      // Filter by search
      if (filters.value.search) {
        const searchTerm = filters.value.search.toLowerCase()
        result = result.filter(item => 
          item.judul.toLowerCase().includes(searchTerm) ||
          (item.deskripsi && item.deskripsi.toLowerCase().includes(searchTerm))
        )
      }

      // Filter by category
      if (filters.value.kategori) {
        result = result.filter(item => item.kategori_id == filters.value.kategori)
      }

      // Filter by date range
      if (filters.value.tanggal_mulai) {
        result = result.filter(item => 
          new Date(item.tanggal_transaksi) >= new Date(filters.value.tanggal_mulai)
        )
      }

      if (filters.value.tanggal_akhir) {
        result = result.filter(item => 
          new Date(item.tanggal_transaksi) <= new Date(filters.value.tanggal_akhir)
        )
      }

      return result
    })

    const filteredCount = computed(() => filteredPengeluaran.value.length)
    
    const totalFiltered = computed(() => {
      return filteredPengeluaran.value.reduce((sum, item) => sum + parseFloat(item.jumlah), 0)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredCount.value / itemsPerPage)
    })

    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, start + 4)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    // Watch filtered data and update pagination
    watch(filteredPengeluaran, () => {
      currentPage.value = 1
      updateDisplayedData()
    })

    watch(currentPage, () => {
      updateDisplayedData()
    })

    const updateDisplayedData = () => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      pengeluaran.value = filteredPengeluaran.value.slice(start, end)
    }

    // Format functions
    const formatRupiah = (amount) => {
      if (!amount) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    const formatTanggal = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: id })
    }

    // Load data functions
    const loadPengeluaran = async () => {
      try {
        loading.value = true
        const response = await pengeluaranService.dapatkanSemua({ limit: 1000 })
        allPengeluaran.value = response.data || []
        totalCount.value = allPengeluaran.value.length
        updateDisplayedData()
      } catch (error) {
        console.error('Error loading pengeluaran:', error)
        toast.error('Gagal memuat data pengeluaran: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    const loadKategori = async () => {
      try {
        const response = await kategoriService.dapatkanSemua()
        daftarKategori.value = response.data || []
      } catch (error) {
        console.error('Error loading kategori:', error)
        toast.error('Gagal memuat data kategori: ' + error.message)
      }
    }

    // Filter functions
    const applyFilters = () => {
      // Filters are applied automatically through computed property
    }

    // Debounce function
    let searchTimeout = null
    const debouncedSearch = () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      searchTimeout = setTimeout(() => {
        applyFilters()
      }, 300)
    }

    const resetFilters = () => {
      filters.value = {
        search: '',
        kategori: '',
        tanggal_mulai: '',
        tanggal_akhir: ''
      }
    }

    // Pagination functions
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    // Delete functions
    const confirmDelete = (item) => {
      selectedItem.value = item
      showDeleteModal.value = true
    }

    const deleteItem = async () => {
      if (!selectedItem.value) return

      try {
        await pengeluaranService.hapus(selectedItem.value.id)
        toast.success('Pengeluaran berhasil dihapus')
        
        // Remove from local data
        const index = allPengeluaran.value.findIndex(item => item.id === selectedItem.value.id)
        if (index > -1) {
          allPengeluaran.value.splice(index, 1)
          totalCount.value--
        }
        
        updateDisplayedData()
        showDeleteModal.value = false
        selectedItem.value = null
      } catch (error) {
        console.error('Error deleting pengeluaran:', error)
        toast.error('Gagal menghapus pengeluaran: ' + error.message)
      }
    }

    onMounted(() => {
      Promise.all([loadPengeluaran(), loadKategori()])
    })

    return {
      loading,
      pengeluaran,
      daftarKategori,
      filters,
      hasActiveFilters,
      filteredCount,
      totalCount,
      totalFiltered,
      currentPage,
      totalPages,
      visiblePages,
      itemsPerPage,
      showDeleteModal,
      selectedItem,
      formatRupiah,
      formatTanggal,
      applyFilters,
      debouncedSearch,
      resetFilters,
      changePage,
      confirmDelete,
      deleteItem
    }
  }
}
</script>
