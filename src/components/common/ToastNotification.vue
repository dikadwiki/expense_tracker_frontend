<template>
  <transition
    name="toast"
    appear
    @enter="onEnter"
    @leave="onLeave"
  >
    <div
      v-if="visible"
      class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-strong rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5"
      :class="borderClass"
    >
      <div class="flex-1 w-0 p-4">
        <div class="flex items-start">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="iconBgClass"
            >
              <component :is="iconComponent" class="w-5 h-5" :class="iconColorClass" />
            </div>
          </div>
          
          <!-- Content -->
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900">
              {{ title }}
            </p>
            <p v-if="message" class="mt-1 text-sm text-gray-500">
              {{ message }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Close Button -->
      <div class="flex border-l border-gray-200">
        <button
          @click="close"
          class="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Progress Bar -->
      <div 
        v-if="showProgress && duration > 0"
        class="absolute bottom-0 left-0 h-1 rounded-b-lg transition-all ease-linear"
        :class="progressBarClass"
        :style="{ width: progressWidth + '%' }"
      ></div>
    </div>
  </transition>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Import icons
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'ToastNotification',
  components: {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    InformationCircleIcon,
  },
  emits: ['close'],
  props: {
    type: {
      type: String,
      default: 'info', // success, error, warning, info
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 5000 // 5 detik
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const visible = ref(true)
    const progressWidth = ref(100)
    let timer = null
    let progressTimer = null

    const typeConfig = {
      success: {
        icon: 'CheckCircleIcon',
        title: 'Berhasil',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        border: 'border-l-4 border-green-400',
        progressBar: 'bg-green-400'
      },
      error: {
        icon: 'XCircleIcon',
        title: 'Error',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        border: 'border-l-4 border-red-400',
        progressBar: 'bg-red-400'
      },
      warning: {
        icon: 'ExclamationTriangleIcon',
        title: 'Peringatan',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        border: 'border-l-4 border-yellow-400',
        progressBar: 'bg-yellow-400'
      },
      info: {
        icon: 'InformationCircleIcon',
        title: 'Informasi',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        border: 'border-l-4 border-blue-400',
        progressBar: 'bg-blue-400'
      }
    }

    const config = computed(() => typeConfig[props.type])
    const iconComponent = computed(() => config.value.icon)
    const iconBgClass = computed(() => config.value.iconBg)
    const iconColorClass = computed(() => config.value.iconColor)
    const borderClass = computed(() => config.value.border)
    const progressBarClass = computed(() => config.value.progressBar)
    
    const computedTitle = computed(() => {
      return props.title || config.value.title
    })

    const startTimer = () => {
      if (props.duration > 0) {
        // Timer untuk menutup toast
        timer = setTimeout(() => {
          close()
        }, props.duration)

        // Timer untuk progress bar
        if (props.showProgress) {
          const interval = 50 // Update setiap 50ms
          const step = (100 / props.duration) * interval
          
          progressTimer = setInterval(() => {
            progressWidth.value -= step
            if (progressWidth.value <= 0) {
              progressWidth.value = 0
              clearInterval(progressTimer)
            }
          }, interval)
        }
      }
    }

    const close = () => {
      visible.value = false
      emit('close')
    }

    const onEnter = () => {
      startTimer()
    }

    const onLeave = () => {
      if (timer) clearTimeout(timer)
      if (progressTimer) clearInterval(progressTimer)
    }

    onMounted(() => {
      startTimer()
    })

    onUnmounted(() => {
      if (timer) clearTimeout(timer)
      if (progressTimer) clearInterval(progressTimer)
    })

    return {
      visible,
      progressWidth,
      iconComponent,
      iconBgClass,
      iconColorClass,
      borderClass,
      progressBarClass,
      title: computedTitle,
      close,
      onEnter,
      onLeave
    }
  }
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-enter-to,
.toast-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
