<script setup lang="ts">
import {
  BarChart3,
  BrainCircuit,
  ChevronDown,
  Code2,
  MessageCircle,
  PenTool,
  Rocket,
  Search,
  ShieldCheck,
} from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import RevealBlock from '@/components/base/RevealBlock.vue'
import SkillCard from '@/components/skills/SkillCard.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'
import type { SkillCard as SkillCardModel, SkillsResponse, SkillsSortKey } from '@/types/skills'

const props = defineProps<{
  response: SkillsResponse | null
  loading: boolean
  error: string
  query: string
  selectedCategory: string
  sortBy: SkillsSortKey
}>()

const emit = defineEmits<{
  search: [query: string]
  categoryChange: [category: string]
  pageChange: [page: number]
  sortChange: [sort: SkillsSortKey]
  skillClick: [skill: SkillCardModel]
}>()

const sortMenuRef = ref<HTMLElement | null>(null)
const isSortMenuOpen = ref(false)

const sortOptions: Array<{ key: SkillsSortKey; label: string }> = [
  { key: 'score', label: '综合排序' },
  { key: 'downloads', label: '下载量' },
  { key: 'stars', label: '收藏数' },
  { key: 'installs', label: '安装量' },
  { key: 'name', label: '名称' },
]

const categoryDecorMap: Record<string, { icon: Component; iconClass: string }> = {
  'AI 智能': { icon: BrainCircuit, iconClass: 'bg-sky-50 text-sky-500' },
  开发工具: { icon: Code2, iconClass: 'bg-violet-50 text-violet-500' },
  效率提升: { icon: Rocket, iconClass: 'bg-emerald-50 text-emerald-500' },
  数据分析: { icon: BarChart3, iconClass: 'bg-amber-50 text-amber-500' },
  内容创作: { icon: PenTool, iconClass: 'bg-rose-50 text-rose-500' },
  安全合规: { icon: ShieldCheck, iconClass: 'bg-cyan-50 text-cyan-500' },
  通讯协作: { icon: MessageCircle, iconClass: 'bg-lime-50 text-lime-500' },
}

const categories = computed(() =>
  (props.response?.categories ?? []).map((item) => ({
    ...item,
    icon: categoryDecorMap[item.label]?.icon ?? BrainCircuit,
    iconClass: categoryDecorMap[item.label]?.iconClass ?? 'bg-slate-100 text-slate-500',
  })),
)

const skeletonCards = Array.from({ length: 6 }, (_, index) => index)
const currentSortLabel = computed(
  () => sortOptions.find((option) => option.key === props.sortBy)?.label ?? '综合排序',
)

function toggleSortMenu() {
  isSortMenuOpen.value = !isSortMenuOpen.value
}

function selectSort(sort: SkillsSortKey) {
  isSortMenuOpen.value = false
  emit('sortChange', sort)
}

function handleClickOutside(event: MouseEvent) {
  if (!sortMenuRef.value) {
    return
  }

  if (!(event.target instanceof Node)) {
    return
  }

  if (!sortMenuRef.value.contains(event.target)) {
    isSortMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <section id="explore" class="scroll-mt-28 py-12">
    <div class="page-container">
      <RevealBlock>
        <div class="text-center">
          <p class="text-sm font-medium tracking-[0.24em] text-slate-400">探索全部技能</p>
          <h2 class="mt-4 font-['Outfit'] text-[42px] font-semibold tracking-[-0.05em] text-slate-950">
            探索全部技能
          </h2>
          <p class="mx-auto mt-4 max-w-[640px] text-[15px] leading-7 text-slate-500">
            支持按关键词搜索与分类筛选，所有卡片均可直接点开详情弹窗，优先满足桌面端信息浏览效率。
          </p>
        </div>
      </RevealBlock>

      <RevealBlock :delay="100" :y="28">
        <div class="mt-10">
          <div class="flex justify-center gap-[14px]">
            <button
              v-for="item in categories"
              :key="item.label"
              type="button"
              :class="
                props.selectedCategory === item.label
                  ? 'border-sky-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(240,247,255,0.98)_100%)] text-slate-900 shadow-[0_18px_40px_rgba(48,126,255,0.24)]'
                  : 'border-white/80 bg-white/76 text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.07)]'
              "
              class="flex h-[120px] w-[105px] shrink-0 flex-col items-center justify-center rounded-[28px] border px-3 py-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
              @click="emit('categoryChange', props.selectedCategory === item.label ? '' : item.label)"
            >
              <span
                :class="item.iconClass"
                class="flex h-12 w-12 items-center justify-center rounded-[18px] text-[11px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              >
                <component :is="item.icon" class="h-5 w-5" />
              </span>
              <span class="mt-3 text-[12px] font-medium leading-5">{{ item.label }}</span>
            </button>
          </div>

          <div class="mt-8 flex items-center gap-4">
            <label class="relative block flex-1">
              <input
                :value="props.query"
                type="text"
                placeholder="搜索关键词..."
                class="h-14 w-full rounded-full border border-white/80 bg-white/88 px-6 pr-12 text-sm text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] outline-none placeholder:text-slate-400 focus:border-sky-200"
                @input="emit('search', ($event.target as HTMLInputElement).value)"
              />
              <span
                class="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-base text-slate-400"
              >
                <Search class="h-4 w-4" />
              </span>
            </label>

            <div ref="sortMenuRef" class="relative">
              <button
                type="button"
                class="flex h-14 w-[126px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/80 bg-white/88 text-sm font-medium text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition-colors duration-200 hover:text-slate-900"
                @click.stop="toggleSortMenu"
              >
                {{ currentSortLabel }}
                <ChevronDown
                  :class="isSortMenuOpen ? 'rotate-180' : ''"
                  class="h-4 w-4 text-slate-400 transition-transform duration-200"
                />
              </button>

              <div
                v-if="isSortMenuOpen"
                class="absolute right-0 top-[calc(100%+10px)] z-20 w-[136px] overflow-hidden rounded-[24px] border border-slate-200 bg-white/96 p-2 shadow-[0_26px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl"
              >
                <button
                  v-for="option in sortOptions"
                  :key="option.key"
                  type="button"
                  :class="
                    props.sortBy === option.key
                      ? 'bg-[linear-gradient(135deg,#2b81ff_0%,#2563eb_100%)] text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)]'
                      : 'text-slate-700 hover:bg-slate-50'
                  "
                  class="flex w-full items-center justify-center rounded-[16px] px-3 py-2.5 text-sm transition-colors duration-200"
                  @click.stop="selectSort(option.key)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between text-sm text-slate-400">
            <p>共 {{ props.response?.pagination.totalItems ?? 0 }} 条结果</p>
            <p>
              {{
                props.loading && props.response
                  ? '结果更新中...'
                  : `当前分类：${props.selectedCategory || '全部技能'}`
              }}
            </p>
          </div>

          <div v-if="props.error" class="mt-6 rounded-[24px] bg-rose-50 px-5 py-4 text-sm text-rose-500">
            {{ props.error }}
          </div>

          <div v-else class="mt-6">
            <div class="grid grid-cols-3 gap-4">
              <div
                v-if="props.loading && !props.response"
                v-for="index in skeletonCards"
                :key="`skeleton-${index}`"
                class="h-[188px] animate-pulse rounded-[24px] bg-slate-100"
              ></div>

              <SkillCard
                v-for="skill in props.response?.items ?? []"
                :key="`${props.response?.pagination.page}-${skill.slug}`"
                :skill="skill"
                @click="emit('skillClick', $event)"
              />
            </div>
          </div>

          <div class="mt-8">
            <PaginationBar
              mode="numbers"
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
