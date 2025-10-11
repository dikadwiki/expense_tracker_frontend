import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'

// Import komponen global
import LoadingSpinner from './components/common/LoadingSpinner.vue'
import ModalDialog from './components/common/ModalDialog.vue'
import ToastNotification from './components/common/ToastNotification.vue'

const app = createApp(App)

// Daftarkan komponen global
app.component('LoadingSpinner', LoadingSpinner)
app.component('ModalDialog', ModalDialog)
app.component('ToastNotification', ToastNotification)

app.use(router)
app.mount('#app')