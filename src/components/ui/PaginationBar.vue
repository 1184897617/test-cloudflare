<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    page: number
    totalPages: number
    mode?: 'dots' | 'numbers'
  }>(),
  {
    mode: 'numbers',
  },
)

const emit = defineEmits<{
  change: [page: number]
}>()

const visiblePages = computed(() => {
  if (props.mode === 'dots' || props.totalPages <= 5) {
    return Array.from({ length: props.totalPages }, (_, index) => index + 1)
  }

  const start = Math.max(1, props.page - 2)
  const end = Math.min(props.totalPages, start + 4)
  const adjustedStart = Math.max(1, end - 4)

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index)
})
</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <button
      type="button"
      class="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-45"
      :disabled="props.page <= 1"
      @click="emit('change', props.page - 1)"
    >
      上一页
    </button>

    <div class="flex items-center gap-2">
      <button
        v-for="value in visiblePages"
        :key="value"
        type="button"
        :class="
          props.mode === 'dots'
            ? [
                'h-2.5 rounded-full',
                value === props.page ? 'w-7 bg-slate-900' : 'w-2.5 bg-slate-300 hover:bg-slate-400',
              ]
            : [
                'flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm',
                value === props.page
                  ? 'border-slate-900 bg-slate-900 text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)]'
                  : 'border-white/70 bg-white/80 text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:text-slate-900',
              ]
        "
        @click="emit('change', value)"
      >
        <span v-if="props.mode === 'numbers'">{{ value }}</span>
      </button>
    </div>

    <button
      type="button"
      class="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-45"
      :disabled="props.page >= props.totalPages"
      @click="emit('change', props.page + 1)"
    >
      下一页
    </button>
  </div>
</template>
