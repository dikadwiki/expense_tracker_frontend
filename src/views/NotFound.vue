<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- 404 Icon -->
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-32 h-32 bg-primary-100 rounded-full mb-6">
          <ExclamationTriangleIcon class="w-16 h-16 text-primary-600" />
        </div>
        <h1 class="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Halaman Tidak Ditemukan</h2>
        <p class="text-gray-500 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
        </p>
      </div>

      <!-- Actions -->
      <div class="space-y-4">
        <router-link
          to="/"
          class="btn-primary w-full justify-center inline-flex items-center"
        >
          <HomeIcon class="w-5 h-5 mr-2" />
          Kembali ke Dashboard
        </router-link>
        
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <router-link
            to="/pengeluaran"
            class="btn-secondary flex-1 justify-center inline-flex items-center"
          >
            <CurrencyDollarIcon class="w-5 h-5 mr-2" />
            Lihat Pengeluaran
          </router-link>
          
          <router-link
            to="/pengeluaran/tambah"
            class="btn-secondary flex-1 justify-center inline-flex items-center"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Tambah Pengeluaran
          </router-link>
        </div>
      </div>

      <!-- Help Text -->
      <div class="mt-8 text-sm text-gray-500">
        <p>Butuh bantuan? Berikut beberapa halaman yang mungkin Anda cari:</p>
        <div class="mt-4 space-y-2">
          <router-link
            to="/"
            class="block hover:text-primary-600 transition-colors duration-200"
          >
            • Dashboard - Ringkasan pengeluaran
          </router-link>
          <router-link
            to="/pengeluaran"
            class="block hover:text-primary-600 transition-colors duration-200"
          >
            • Daftar Pengeluaran - Kelola semua transaksi
          </router-link>
          <router-link
            to="/kategori"
            class="block hover:text-primary-600 transition-colors duration-200"
          >
            • Daftar Kategori - Atur kategori pengeluaran
          </router-link>
          <router-link
            to="/laporan"
            class="block hover:text-primary-600 transition-colors duration-200"
          >
            • Laporan - Analisis pengeluaran
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ExclamationTriangleIcon,
  HomeIcon,
  CurrencyDollarIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'NotFound',
  components: {
    ExclamationTriangleIcon,
    HomeIcon,
    CurrencyDollarIcon,
    PlusIcon,
  }
}
</script>