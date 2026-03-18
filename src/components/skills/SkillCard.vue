<script setup lang="ts">
import { Download, Star, Zap } from 'lucide-vue-next'
import { computed } from 'vue'
import type { SkillCard as SkillCardModel } from '@/types/skills'
import { formatCompactNumber, getSkillAccent, getSkillInitials } from '@/utils/skills'

const props = defineProps<{
  skill: SkillCardModel
}>()

const emit = defineEmits<{
  click: [skill: SkillCardModel]
}>()

const accent = computed(() => getSkillAccent(props.skill.slug))
const initials = computed(() => getSkillInitials(props.skill.name))
</script>

<template>
  <button
    type="button"
    class="group flex h-full min-w-0 flex-col rounded-[24px] border border-white/80 bg-white/88 p-4 text-left shadow-[0_16px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.1)]"
    @click="emit('click', props.skill)"
  >
    <div class="flex min-w-0 items-start justify-between gap-3">
      <div class="flex min-w-0 flex-1 items-start gap-3">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.16)]"
          :style="{ background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)` }"
        >
          {{ initials }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="clamp-1 font-['Outfit'] text-[18px] font-semibold tracking-[-0.03em] text-slate-900">
            {{ props.skill.name }}
          </p>
          <p class="mt-1 text-[12px] leading-5 text-slate-400">
            {{ props.skill.owner || '匿名作者' }}
          </p>
          <p class="mt-2 clamp-2 text-[13px] leading-6 text-slate-500">
            {{ props.skill.summary || '暂无描述，点击查看详情。' }}
          </p>
        </div>
      </div>

      <span
        v-if="props.skill.isFeatured"
        class="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-600"
      >
        TOP {{ props.skill.featuredRank }}
      </span>
    </div>

    <div class="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-[12px] text-slate-400">
      <span class="inline-flex items-center gap-1.5">
        <Download class="h-3.5 w-3.5 text-sky-500" />
        {{ formatCompactNumber(props.skill.downloads) }}
      </span>
      <span class="inline-flex items-center gap-1.5">
        <Star class="h-3.5 w-3.5 text-amber-500" />
        {{ formatCompactNumber(props.skill.stars) }}
      </span>
      <span class="inline-flex items-center gap-1.5">
        <Zap class="h-3.5 w-3.5 text-emerald-500" />
        v{{ props.skill.version }}
      </span>
    </div>
  </button>
</template>
