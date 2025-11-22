import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/api'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: 'Login - DN EXPENSE', requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: 'Register - DN EXPENSE', requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: 'Dashboard - DN EXPENSE', requiresAuth: true }
  },
  {
    path: '/pengeluaran',
    name: 'DaftarPengeluaran',
    component: () => import('../views/DaftarPengeluaran.vue'),
    meta: { title: 'Daftar Pengeluaran - DN EXPENSE', requiresAuth: true }
  },
  {
    path: '/pengeluaran/tambah',
    name: 'TambahPengeluaran',
    component: () => import('../views/TambahPengeluaran.vue'),
    meta: { title: 'Tambah Pengeluaran - DN EXPENSE', requiresAuth: true }
  },
  {
    path: '/pengeluaran/edit/:id',
    name: 'EditPengeluaran',
    component: () => import('../views/EditPengeluaran.vue'),
    meta: { title: 'Edit Pengeluaran - DN EXPENSE', requiresAuth: true },
    props: true
  },
  {
    path: '/laporan',
    name: 'Laporan',
    component: () => import('../views/Laporan.vue'),
    meta: { title: 'Laporan - DN EXPENSE', requiresAuth: true }
  },
  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: () => import('../views/EditProfile.vue'),
    meta: { title: 'Edit Profile - DN EXPENSE', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Halaman Tidak Ditemukan - DN EXPENSE' }
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

// Navigation guard untuk authentication dan title
router.beforeEach((to, from, next) => {
  // Set document title
  document.title = to.meta.title || 'DN EXPENSE'

  const isAuthenticated = authService.isAuthenticated()

  // Jika route memerlukan auth tapi user belum login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Jika route hanya untuk guest (login/register) tapi user sudah login
  if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router