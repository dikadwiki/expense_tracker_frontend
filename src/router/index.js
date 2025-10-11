import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: 'Dashboard - Expense Tracker' }
  },
  {
    path: '/pengeluaran',
    name: 'DaftarPengeluaran',
    component: () => import('../views/DaftarPengeluaran.vue'),
    meta: { title: 'Daftar Pengeluaran - Expense Tracker' }
  },
  {
    path: '/pengeluaran/tambah',
    name: 'TambahPengeluaran',
    component: () => import('../views/TambahPengeluaran.vue'),
    meta: { title: 'Tambah Pengeluaran - Expense Tracker' }
  },
  {
    path: '/pengeluaran/edit/:id',
    name: 'EditPengeluaran',
    component: () => import('../views/EditPengeluaran.vue'),
    meta: { title: 'Edit Pengeluaran - Expense Tracker' },
    props: true
  },
  {
    path: '/kategori',
    name: 'DaftarKategori',
    component: () => import('../views/DaftarKategori.vue'),
    meta: { title: 'Daftar Kategori - Expense Tracker' }
  },
  {
    path: '/laporan',
    name: 'Laporan',
    component: () => import('../views/Laporan.vue'),
    meta: { title: 'Laporan - Expense Tracker' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Halaman Tidak Ditemukan - Expense Tracker' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard untuk mengubah title halaman
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Expense Tracker'
  next()
})

export default router