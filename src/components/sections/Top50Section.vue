<script setup lang="ts">
import { BadgeCheck, Download, ShieldCheck, Star, Zap } from 'lucide-vue-next'
import RevealBlock from '@/components/base/RevealBlock.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'
import type { Top50Item, Top50Response } from '@/types/skills'
import { formatCompactNumber, getCategoryTone } from '@/utils/skills'

const props = defineProps<{
  response: Top50Response | null
  loading: boolean
  error: string
}>()

const emit = defineEmits<{
  pageChange: [page: number]
  skillClick: [skill: Top50Item]
}>()

const skeletonRows = Array.from({ length: 7 }, (_, index) => index)
const featureBadges = [
  {
    label: '官方认证推荐',
    icon: BadgeCheck,
    className: 'border-sky-100 bg-sky-50 text-sky-600',
  },
  {
    label: '极速下载',
    icon: Zap,
    className: 'border-amber-100 bg-amber-50 text-amber-600',
  },
  {
    label: '安全审计',
    icon: ShieldCheck,
    className: 'border-emerald-100 bg-emerald-50 text-emerald-600',
  },
] as const

function getRankClass(rank: number) {
  if (rank === 1) {
    return 'bg-[linear-gradient(135deg,#ffcb4d_0%,#ff9c00_100%)] text-white shadow-[0_12px_24px_rgba(255,156,0,0.22)]'
  }

  if (rank === 2) {
    return 'bg-[linear-gradient(135deg,#d7dee8_0%,#aab5c4_100%)] text-white shadow-[0_10px_20px_rgba(148,163,184,0.18)]'
  }

  if (rank === 3) {
    return 'bg-[linear-gradient(135deg,#d9a566_0%,#b97733_100%)] text-white shadow-[0_10px_20px_rgba(180,119,51,0.18)]'
  }

  return 'bg-slate-50 text-slate-500'
}
</script>

<template>
  <section id="top50" class="scroll-mt-28 py-12">
    <div class="page-container">
      <RevealBlock>
        <div class="text-center">
          <div class="mb-5 flex items-center justify-center gap-3">
            <span
              v-for="item in featureBadges"
              :key="item.label"
              :class="item.className"
              class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
            >
              <component :is="item.icon" class="h-3.5 w-3.5" />
              {{ item.label }}
            </span>
          </div>
          <p class="text-sm font-medium tracking-[0.24em] text-slate-400">精选推荐</p>
          <h2 class="mt-4 font-['Outfit'] text-[42px] font-semibold tracking-[-0.05em] text-slate-950">
            精选 TOP 50 AI Skills 榜单
          </h2>
          <p class="mx-auto mt-4 max-w-[640px] text-[15px] leading-7 text-slate-500">
            以高下载量、高安装量和高活跃度为参考，优先展示更适合在中文场景下快速上手的热门技能。
          </p>
        </div>
      </RevealBlock>

      <RevealBlock :delay="120" :y="32">
        <div v-if="props.error" class="mt-10 rounded-[24px] bg-rose-50 px-5 py-4 text-sm text-rose-500">
          {{ props.error }}
        </div>

        <div v-else class="mt-10">
          <div class="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_32px_84px_rgba(15,23,42,0.1)]">
            <div class="divide-y divide-slate-100">
              <div
                v-if="props.loading && !props.response"
                v-for="index in skeletonRows"
                :key="`skeleton-${index}`"
                class="flex items-center gap-4 px-5 py-4"
              >
                <div class="h-10 w-10 animate-pulse rounded-full bg-slate-100"></div>
                <div class="flex-1">
                  <div class="h-4 w-48 animate-pulse rounded-full bg-slate-100"></div>
                  <div class="mt-3 h-3 w-72 animate-pulse rounded-full bg-slate-100"></div>
                </div>
                <div class="h-8 w-24 animate-pulse rounded-full bg-slate-100"></div>
              </div>

              <button
                v-for="skill in props.response?.items ?? []"
                :key="`${props.response?.pagination.page}-${skill.slug}`"
                type="button"
                class="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-slate-50/80"
                @click="emit('skillClick', skill)"
              >
                <div
                  :class="getRankClass(skill.rank)"
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-['Outfit'] text-sm font-semibold"
                >
                  {{ skill.rank }}
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-3">
                    <p class="truncate text-sm font-semibold text-slate-900">{{ skill.name }}</p>
                    <span
                      :class="getCategoryTone(skill.primaryCategory).tagClass"
                      class="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                    >
                      {{ skill.primaryCategory }}
                    </span>
                  </div>
                  <p class="mt-1 clamp-1 pr-4 text-[13px] leading-6 text-slate-500">
                    {{ skill.summary || '暂无描述，点击查看详情。' }}
                  </p>
                </div>

                <div class="flex shrink-0 items-center gap-5 text-xs text-slate-400">
                  <div class="inline-flex min-w-[48px] items-center justify-end gap-1.5">
                    <Download class="h-3.5 w-3.5 text-sky-500" />
                    <p class="text-sm font-semibold text-slate-900">
                      {{ formatCompactNumber(skill.downloads) }}
                    </p>
                  </div>
                  <div class="inline-flex min-w-[48px] items-center justify-end gap-1.5">
                    <Star class="h-3.5 w-3.5 text-amber-500" />
                    <p class="text-sm font-semibold text-slate-900">
                      {{ formatCompactNumber(skill.stars) }}
                    </p>
                  </div>
                  <div class="inline-flex min-w-[48px] items-center justify-end gap-1.5">
                    <Zap class="h-3.5 w-3.5 text-emerald-500" />
                    <p class="text-sm font-semibold text-slate-900">
                      {{ formatCompactNumber(skill.installs) }}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div class="mt-6">
            <PaginationBar
              mode="dots"
              :page="props.response?.pagination.page ?? 1"
              :total-pages="props.response?.pagination.totalPages ?? 1"
              @change="emit('pageChange', $event)"
            />
          </div>
        </div>
      </RevealBlock>
    </div>
  </section>
</template>
