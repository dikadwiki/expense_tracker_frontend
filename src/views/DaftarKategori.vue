<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Daftar Kategori</h1>
        <p class="mt-2 text-gray-600">Kelola kategori untuk mengorganisir pengeluaran Anda</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showAddModal = true"
          class="btn-primary inline-flex items-center"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Tambah Kategori
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Kategori List -->
      <div class="lg:col-span-2">
        <div class="card">
          <!-- Loading State -->
          <div v-if="loading" class="card-body">
            <div class="space-y-4">
              <div v-for="i in 6" :key="i" class="loading-shimmer h-16 rounded-lg"></div>
            </div>
          </div>

          <!-- Kategori Items -->
          <div v-else-if="kategori.length > 0" class="divide-y divide-gray-200">
            <div
              v-for="item in kategori"
              :key="item.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <!-- Color Indicator -->
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    :style="{ backgroundColor: item.warna }"
                  >
                    <TagIcon class="w-4 h-4 text-white" />
                  </div>
                  
                  <!-- Kategori Info -->
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ item.nama }}</h3>
                    <p v-if="item.deskripsi" class="text-sm text-gray-500 mt-1">
                      {{ item.deskripsi }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      Dibuat {{ formatTanggal(item.dibuat_pada) }}
                    </p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-2">
                  <button
                    @click="editKategori(item)"
                    class="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    title="Edit kategori"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDelete(item)"
                    class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Hapus kategori"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="card-body text-center py-12">
            <TagIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Belum Ada Kategori</h3>
            <p class="text-gray-500 mb-6">
              Buat kategori pertama Anda untuk mengorganisir pengeluaran
            </p>
            <button
              @click="showAddModal = true"
              class="btn-primary inline-flex items-center"
            >
              <PlusIcon class="w-5 h-5 mr-2" />
              Tambah Kategori
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Sidebar -->
      <div class="space-y-6">
        <!-- Total Kategori -->
        <div class="card">
          <div class="card-body">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">{{ kategori.length }}</div>
              <div class="text-sm text-gray-600 mt-1">Total Kategori</div>
            </div>
          </div>
        </div>

        <!-- Color Palette -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Warna Populer</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-6 gap-2">
              <button
                v-for="color in popularColors"
                :key="color"
                @click="selectedColor = color"
                class="w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform duration-200"
                :class="selectedColor === color ? 'border-gray-400' : 'border-gray-200'"
                :style="{ backgroundColor: color }"
                :title="color"
              ></button>
            </div>
            <p class="text-xs text-gray-500 mt-3">
              Klik warna untuk memilih saat menambah kategori baru
            </p>
          </div>
        </div>

        <!-- Tips -->
        <div class="card bg-blue-50 border-blue-200">
          <div class="card-body">
            <div class="flex items-start space-x-3">
              <InformationCircleIcon class="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 class="text-sm font-medium text-blue-900 mb-2">Tips Kategori</h3>
                <ul class="text-sm text-blue-800 space-y-1">
                  <li>• Buat kategori yang spesifik tapi tidak terlalu detail</li>
                  <li>• Gunakan warna berbeda untuk setiap kategori</li>
                  <li>• Kategori yang tidak terpakai bisa dihapus</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <ModalDialog
      :show="showAddModal || showEditModal"
      :title="isEdit ? 'Edit Kategori' : 'Tambah Kategori'"
      size="md"
      @close="closeModal"
    >
      <template #body>
        <form @submit.prevent="saveKategori" class="space-y-6">
          <!-- Nama Kategori -->
          <div>
            <label class="form-label">
              Nama Kategori <span class="text-red-500">*</span>
            </label>
            <input
              ref="namaInput"
              v-model="form.nama"
              type="text"
              placeholder="Contoh: Makanan & Minuman"
              class="form-input"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.nama }"
              required
            >
            <p v-if="errors.nama" class="mt-1 text-sm text-red-600">{{ errors.nama }}</p>
          </div>

          <!-- Warna -->
          <div>
            <label class="form-label">Warna Kategori</label>
            <div class="space-y-3">
              <!-- Color Input -->
              <div class="flex items-center space-x-3">
                <input
                  v-model="form.warna"
                  type="color"
                  class="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                >
                <input
                  v-model="form.warna"
                  type="text"
                  placeholder="#3B82F6"
                  class="form-input flex-1"
                  pattern="^#[0-9A-Fa-f]{6}$"
                >
              </div>
              
              <!-- Popular Colors -->
              <div class="grid grid-cols-8 gap-2">
                <button
                  v-for="color in popularColors"
                  :key="color"
                  type="button"
                  @click="form.warna = color"
                  class="w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform duration-200"
                  :class="form.warna === color ? 'border-gray-600' : 'border-gray-200'"
                  :style="{ backgroundColor: color }"
                ></button>
              </div>
            </div>
            <p v-if="errors.warna" class="mt-1 text-sm text-red-600">{{ errors.warna }}</p>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="form-label">Deskripsi</label>
            <textarea
              v-model="form.deskripsi"
              rows="3"
              placeholder="Deskripsi kategori (opsional)"
              class="form-input resize-none"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.deskripsi }"
            ></textarea>
            <p v-if="errors.deskripsi" class="mt-1 text-sm text-red-600">{{ errors.deskripsi }}</p>
            <p class="mt-1 text-sm text-gray-500">
              {{ form.deskripsi.length }}/500 karakter
            </p>
          </div>

          <!-- Preview -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Preview</h4>
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :style="{ backgroundColor: form.warna }"
              >
                <TagIcon class="w-4 h-4 text-white" />
              </div>
              <div>
                <div class="font-medium text-gray-900">
                  {{ form.nama || 'Nama Kategori' }}
                </div>
                <div v-if="form.deskripsi" class="text-sm text-gray-500">
                  {{ form.deskripsi }}
                </div>
              </div>
            </div>
          </div>
        </form>
      </template>

      <template #footer>
        <button
          type="button"
          @click="closeModal"
          class="btn-secondary"
          :disabled="loadingAction"
        >
          Batal
        </button>
        <button
          type="button"
          @click="saveKategori"
          class="btn-primary"
          :disabled="loadingAction || !isFormValid"
        >
          <span v-if="loadingAction" class="flex items-center">
            <LoadingSpinner size="xs" color="white" class="mr-2" />
            {{ isEdit ? 'Menyimpan...' : 'Menambahkan...' }}
          </span>
          <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Tambah Kategori' }}</span>
        </button>
      </template>
    </ModalDialog>

    <!-- Delete Confirmation Modal -->
    <ModalDialog
      :show="showDeleteModal"
      type="danger"
      :icon="ExclamationTriangleIcon"
      title="Hapus Kategori"
      :message="`Apakah Anda yakin ingin menghapus kategori '${selectedKategori?.nama}'? Pengeluaran yang menggunakan kategori ini akan menjadi tanpa kategori.`"
      :show-default-buttons="true"
      cancel-text="Batal"
      confirm-text="Hapus"
      @close="showDeleteModal = false"
      @cancel="showDeleteModal = false"
      @confirm="deleteKategori"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, inject, nextTick } from 'vue'
import { kategoriService } from '@/services/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

// Import icons
import {
  PlusIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'DaftarKategori',
  components: {
    PlusIcon,
    TagIcon,
    PencilIcon,
    TrashIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
  },
  setup() {
    const toast = inject('toast')
    const loading = ref(true)
    const loadingAction = ref(false)
    const kategori = ref([])
    
    // Modal states
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const showDeleteModal = ref(false)
    const selectedKategori = ref(null)
    const selectedColor = ref('#3B82F6')

    // Form data
    const form = ref({
      nama: '',
      warna: '#3B82F6',
      deskripsi: ''
    })

    // Form errors
    const errors = ref({})

    // Form refs
    const namaInput = ref(null)

    // Popular colors
    const popularColors = [
      '#EF4444', // Red
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#3B82F6', // Blue
      '#8B5CF6', // Violet
      '#EC4899', // Pink
      '#F97316', // Orange
      '#6B7280', // Gray
      '#14B8A6', // Teal
      '#84CC16', // Lime
      '#6366F1', // Indigo
      '#F43F5E', // Rose
      '#06B6D4', // Cyan
      '#A855F7', // Purple
      '#22C55E', // Green
      '#EAB308'  // Yellow
    ]

    // Computed properties
    const isEdit = computed(() => selectedKategori.value !== null)

    const isFormValid = computed(() => {
      return form.value.nama.trim().length >= 2 && 
             form.value.warna.match(/^#[0-9A-Fa-f]{6}$/i)
    })

    // Format functions
    const formatTanggal = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: id })
    }

    // Load kategori
    const loadKategori = async () => {
      try {
        loading.value = true
        const response = await kategoriService.dapatkanSemua()
        kategori.value = response.data || []
      } catch (error) {
        console.error('Error loading kategori:', error)
        toast.error('Gagal memuat data kategori: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    // Modal functions
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      selectedKategori.value = null
      form.value = {
        nama: '',
        warna: selectedColor.value,
        deskripsi: ''
      }
      errors.value = {}
    }

    const editKategori = (item) => {
      selectedKategori.value = item
      form.value = {
        nama: item.nama,
        warna: item.warna,
        deskripsi: item.deskripsi || ''
      }
      showEditModal.value = true
      
      nextTick(() => {
        namaInput.value?.focus()
      })
    }

    const confirmDelete = (item) => {
      selectedKategori.value = item
      showDeleteModal.value = true
    }

    // Validate form
    const validateForm = () => {
      const newErrors = {}

      if (!form.value.nama.trim()) {
        newErrors.nama = 'Nama kategori harus diisi'
      } else if (form.value.nama.length < 2) {
        newErrors.nama = 'Nama kategori minimal 2 karakter'
      } else if (form.value.nama.length > 100) {
        newErrors.nama = 'Nama kategori maksimal 100 karakter'
      }

      if (!form.value.warna.match(/^#[0-9A-Fa-f]{6}$/i)) {
        newErrors.warna = 'Format warna tidak valid (gunakan format #RRGGBB)'
      }

      if (form.value.deskripsi.length > 500) {
        newErrors.deskripsi = 'Deskripsi maksimal 500 karakter'
      }

      // Check for duplicate name (excluding current item if editing)
      const duplicateName = kategori.value.find(item => 
        item.nama.toLowerCase() === form.value.nama.trim().toLowerCase() &&
        (!isEdit.value || item.id !== selectedKategori.value.id)
      )
      if (duplicateName) {
        newErrors.nama = 'Nama kategori sudah digunakan'
      }

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    // Save kategori
    const saveKategori = async () => {
      if (!validateForm()) {
        toast.error('Mohon perbaiki kesalahan pada form')
        return
      }

      try {
        loadingAction.value = true

        const data = {
          nama: form.value.nama.trim(),
          warna: form.value.warna.toUpperCase(),
          deskripsi: form.value.deskripsi.trim()
        }

        let response
        if (isEdit.value) {
          response = await kategoriService.perbarui(selectedKategori.value.id, data)
          toast.success('Kategori berhasil diperbarui')
          
          // Update local data
          const index = kategori.value.findIndex(item => item.id === selectedKategori.value.id)
          if (index > -1) {
            kategori.value[index] = response.data
          }
        } else {
          response = await kategoriService.tambah(data)
          toast.success('Kategori berhasil ditambahkan')
          
          // Add to local data
          kategori.value.push(response.data)
        }

        closeModal()

      } catch (error) {
        console.error('Error saving kategori:', error)
        toast.error(`Gagal ${isEdit.value ? 'memperbarui' : 'menambahkan'} kategori: ` + error.message)
      } finally {
        loadingAction.value = false
      }
    }

    // Delete kategori
    const deleteKategori = async () => {
      if (!selectedKategori.value) return

      try {
        loadingAction.value = true
        await kategoriService.hapus(selectedKategori.value.id)
        toast.success('Kategori berhasil dihapus')

        // Remove from local data
        const index = kategori.value.findIndex(item => item.id === selectedKategori.value.id)
        if (index > -1) {
          kategori.value.splice(index, 1)
        }

        showDeleteModal.value = false
        selectedKategori.value = null

      } catch (error) {
        console.error('Error deleting kategori:', error)
        toast.error('Gagal menghapus kategori: ' + error.message)
      } finally {
        loadingAction.value = false
      }
    }

    // Watch selected color for new categories
    const watchSelectedColor = () => {
      if (!isEdit.value && !showEditModal.value) {
        form.value.warna = selectedColor.value
      }
    }

    onMounted(() => {
      loadKategori()
      
      // Focus nama input when add modal opens
      nextTick(() => {
        if (showAddModal.value) {
          namaInput.value?.focus()
        }
      })
    })

    return {
      loading,
      loadingAction,
      kategori,
      showAddModal,
      showEditModal,
      showDeleteModal,
      selectedKategori,
      selectedColor,
      form,
      errors,
      namaInput,
      popularColors,
      isEdit,
      isFormValid,
      formatTanggal,
      closeModal,
      editKategori,
      confirmDelete,
      saveKategori,
      deleteKategori,
      watchSelectedColor
    }
  }
}
</script>