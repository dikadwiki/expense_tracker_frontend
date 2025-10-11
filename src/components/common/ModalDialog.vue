<template>
  <teleport to="body">
    <transition name="modal" appear>
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="onOverlayClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-strong transition-all"
            :class="sizeClass"
            @click.stop
          >
            <!-- Modal Header -->
            <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <!-- Icon -->
                  <div v-if="icon" class="mr-3">
                    <div 
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      :class="iconBgClass"
                    >
                      <component :is="icon" class="w-5 h-5" :class="iconColorClass" />
                    </div>
                  </div>
                  
                  <!-- Title -->
                  <h3 class="text-lg font-semibold text-gray-900">
                    <slot name="header">{{ title }}</slot>
                  </h3>
                </div>
                
                <!-- Close Button -->
                <button
                  v-if="closable"
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-4">
              <slot name="body">
                <div v-if="message" class="text-gray-700">{{ message }}</div>
              </slot>
            </div>

            <!-- Modal Footer -->
            <div v-if="$slots.footer || showDefaultButtons" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <slot name="footer">
                <template v-if="showDefaultButtons">
                  <button
                    v-if="showCancelButton"
                    @click="$emit('cancel')"
                    class="btn-secondary"
                  >
                    {{ cancelText }}
                  </button>
                  <button
                    v-if="showConfirmButton"
                    @click="$emit('confirm')"
                    :class="confirmButtonClass"
                  >
                    {{ confirmText }}
                  </button>
                </template>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ModalDialog',
  emits: ['close', 'confirm', 'cancel'],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md', // sm, md, lg, xl
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    type: {
      type: String,
      default: 'default', // default, danger, warning, success, info
      validator: (value) => ['default', 'danger', 'warning', 'success', 'info'].includes(value)
    },
    icon: {
      type: [String, Object],
      default: null
    },
    closable: {
      type: Boolean,
      default: true
    },
    showDefaultButtons: {
      type: Boolean,
      default: false
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: 'Batal'
    },
    confirmText: {
      type: String,
      default: 'Konfirmasi'
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const sizeClass = computed(() => {
      const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl'
      }
      return sizes[props.size]
    })

    const iconBgClass = computed(() => {
      const bgClasses = {
        default: 'bg-gray-100',
        danger: 'bg-red-100',
        warning: 'bg-yellow-100',
        success: 'bg-green-100',
        info: 'bg-blue-100'
      }
      return bgClasses[props.type]
    })

    const iconColorClass = computed(() => {
      const colorClasses = {
        default: 'text-gray-600',
        danger: 'text-red-600',
        warning: 'text-yellow-600',
        success: 'text-green-600',
        info: 'text-blue-600'
      }
      return colorClasses[props.type]
    })

    const confirmButtonClass = computed(() => {
      const buttonClasses = {
        default: 'btn-primary',
        danger: 'btn-danger',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200',
        success: 'bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200',
        info: 'btn-primary'
      }
      return buttonClasses[props.type]
    })

    const onOverlayClick = () => {
      if (props.closeOnOverlay && props.closable) {
        emit('close')
      }
    }

    return {
      sizeClass,
      iconBgClass,
      iconColorClass,
      confirmButtonClass,
      onOverlayClick
    }
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>