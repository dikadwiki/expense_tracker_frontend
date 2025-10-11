<template>
  <div v-if="show" class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <!-- Spinner -->
      <div 
        class="animate-spin rounded-full border-solid border-t-transparent"
        :class="spinnerClass"
      ></div>
      
      <!-- Loading text (opsional) -->
      <div v-if="text" class="mt-3 text-center">
        <p :class="textClass">{{ text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'LoadingSpinner',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'md', // xs, sm, md, lg, xl
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    color: {
      type: String,
      default: 'primary' // primary, white, gray
    },
    text: {
      type: String,
      default: ''
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const containerClass = computed(() => {
      if (props.fullscreen) {
        return 'fixed inset-0 bg-white bg-opacity-75 z-50'
      }
      return 'py-4'
    })

    const spinnerClass = computed(() => {
      const sizes = {
        xs: 'w-4 h-4 border-2',
        sm: 'w-6 h-6 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-12 h-12 border-3',
        xl: 'w-16 h-16 border-4'
      }

      const colors = {
        primary: 'border-primary-600',
        white: 'border-white',
        gray: 'border-gray-600'
      }

      return `${sizes[props.size]} ${colors[props.color]}`
    })

    const textClass = computed(() => {
      const colors = {
        primary: 'text-primary-600',
        white: 'text-white',
        gray: 'text-gray-600'
      }

      return `text-sm font-medium ${colors[props.color]}`
    })

    return {
      containerClass,
      spinnerClass,
      textClass
    }
  }
}
</script>