<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    delay?: number
    y?: number
  }>(),
  {
    delay: 0,
    y: 28,
  },
)

const root = ref<HTMLElement | null>(null)
const visible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!root.value) {
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) {
        return
      }

      if (entry.isIntersecting) {
        visible.value = true
        observer?.disconnect()
      }
    },
    {
      threshold: 0.18,
    },
  )

  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="root"
    :style="{
      transitionDelay: `${props.delay}ms`,
      transform: visible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${props.y}px, 0)`,
      opacity: visible ? 1 : 0,
    }"
    class="transition-[opacity,transform] duration-700 ease-out"
  >
    <slot />
  </div>
</template>
