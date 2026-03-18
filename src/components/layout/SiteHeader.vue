<script setup lang="ts">
import logoUrl from "@/assets/logo.svg";

const props = defineProps<{
  scrolled: boolean;
}>();

const emit = defineEmits<{
  navigate: [target: "hero" | "top50" | "explore" | "community"];
}>();

const navItems = [
  { label: "精选榜单", target: "top50" },
  { label: "全部技能", target: "explore" },
  { label: "社区定位", target: "community" },
] as const;
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40">
    <div class="page-container pt-4">
      <div
        :class="
          props.scrolled
            ? 'border-white/80 bg-white/78 shadow-[0_20px_60px_rgba(15,23,42,0.12)]'
            : 'border-white/65 bg-white/60 shadow-[0_12px_36px_rgba(15,23,42,0.08)]'
        "
        class="flex items-center justify-between rounded-full border px-4 py-3 backdrop-blur-2xl transition-all duration-500"
      >
        <button
          type="button"
          class="flex items-center gap-3 rounded-full px-2 py-1 text-left"
          @click="emit('navigate', 'hero')"
        >
          <img
            :src="logoUrl"
            alt="夕牛 logo"
            class="h-9 w-9 rounded-[10px] object-cover shadow-[0_10px_24px_rgba(15,23,42,0.16)]"
          />
          <span>
            <span
              class="block font-['Outfit'] text-sm font-semibold tracking-[0.28em] text-slate-900"
            >
              夕牛技能库
            </span>
          </span>
        </button>

        <nav class="flex items-center gap-8 text-sm text-slate-500">
          <button
            v-for="item in navItems"
            :key="item.target"
            type="button"
            class="transition-colors duration-300 hover:text-slate-900"
            @click="emit('navigate', item.target)"
          >
            {{ item.label }}
          </button>
        </nav>

        <div class="flex items-center gap-3">
          <span
            class="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600"
          >
            精选 AI 技能
          </span>
          <button
            type="button"
            class="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-[0_14px_32px_rgba(15,23,42,0.18)] transition-transform duration-300 hover:-translate-y-0.5"
            @click="emit('navigate', 'explore')"
          >
            立即探索
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
