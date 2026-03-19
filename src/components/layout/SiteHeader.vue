<script setup lang="ts">
import { ref } from "vue";

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

const coinFlipTurns = ref(0);

function flipCoin() {
  coinFlipTurns.value += 1;
}
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
          class="brand-trigger flex items-center gap-3 rounded-full px-2 py-1 text-left"
          @click="emit('navigate', 'hero')"
        >
          <div
            class="coin-mark flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] select-none"
            aria-label="翻转品牌硬币"
            @click.stop="flipCoin"
          >
            <span class="coin-mark__glow"></span>
            <span class="coin-mark__ring"></span>
            <span class="coin-mark__shine"></span>
            <span
              class="coin-mark__spin"
              :style="{ transform: `rotateY(${coinFlipTurns * 180}deg)` }"
            >
              <span class="coin-mark__core">
                <span class="coin-mark__face coin-mark__face--front">￥</span>
                <span class="coin-mark__face coin-mark__face--back">财</span>
              </span>
            </span>
          </div>
          <span>
            <span
              class="block font-['Outfit'] text-sm font-semibold tracking-[0.28em] text-slate-900"
            >
              来财技能库
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

<style scoped>
.brand-trigger {
  transition: transform 0.35s ease;
}

.coin-mark {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  perspective: 900px;
  transform-style: preserve-3d;
  border: 1px solid rgba(255, 255, 255, 0.82);
  background:
    radial-gradient(circle at 28% 28%, rgba(255, 255, 255, 0.96), transparent 42%),
    linear-gradient(145deg, #fff4d0 0%, #ffd76f 45%, #ffb723 100%);
  box-shadow:
    0 12px 28px rgba(245, 158, 11, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    inset 0 -8px 16px rgba(180, 83, 9, 0.16);
  animation: coin-float 4.6s ease-in-out infinite;
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    filter 0.35s ease;
}

.coin-mark::after {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: 9px;
  border: 1px solid rgba(255, 248, 220, 0.28);
  box-shadow:
    inset 1px 0 0 rgba(255, 255, 255, 0.28),
    inset -1px 0 0 rgba(146, 64, 14, 0.12);
  pointer-events: none;
  z-index: 1;
}

.coin-mark__glow,
.coin-mark__ring,
.coin-mark__shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.coin-mark__glow {
  inset: -30%;
  background: radial-gradient(circle, rgba(250, 204, 21, 0.5) 0%, transparent 72%);
  filter: blur(10px);
  opacity: 0.75;
  animation: coin-pulse 3.2s ease-in-out infinite;
  z-index: 0;
}

.coin-mark__ring {
  inset: 4px;
  border: 1px solid rgba(255, 255, 255, 0.52);
  border-radius: 8px;
  opacity: 0.95;
  z-index: 1;
}

.coin-mark__shine {
  inset: -20% auto -20% -55%;
  width: 58%;
  transform: rotate(18deg);
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.18) 20%,
    rgba(255, 255, 255, 0.82) 50%,
    rgba(255, 255, 255, 0.16) 78%,
    transparent 100%
  );
  mix-blend-mode: screen;
  animation: coin-shimmer 4.8s ease-in-out infinite;
  z-index: 2;
}

.coin-mark__core {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: coin-tilt 4.2s ease-in-out infinite;
}

.coin-mark__spin {
  position: relative;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.coin-mark__face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: "Outfit", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  color: #6b3d00;
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.35),
    0 4px 10px rgba(120, 53, 15, 0.18);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.coin-mark__face--front {
  transform: translateZ(6px);
}

.coin-mark__face--back {
  transform: rotateY(180deg) translateZ(6px);
  color: #7c2d12;
}

.brand-trigger:hover {
  transform: translateY(-1px);
}

.brand-trigger:hover .coin-mark {
  transform: translateY(-2px) scale(1.06) rotate(-6deg);
  box-shadow:
    0 18px 36px rgba(245, 158, 11, 0.34),
    0 0 0 6px rgba(255, 215, 111, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    inset 0 -10px 18px rgba(180, 83, 9, 0.2);
  filter: saturate(1.08);
}

.brand-trigger:hover .coin-mark__shine {
  animation-duration: 1.5s;
}

@keyframes coin-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-2px) rotate(3deg);
  }
}

@keyframes coin-pulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.9);
  }

  50% {
    opacity: 0.82;
    transform: scale(1.08);
  }
}

@keyframes coin-tilt {
  0%,
  100% {
    transform: rotateY(0deg) rotateX(0deg);
  }

  25% {
    transform: rotateY(-18deg) rotateX(8deg);
  }

  50% {
    transform: rotateY(8deg) rotateX(-5deg);
  }

  75% {
    transform: rotateY(18deg) rotateX(6deg);
  }
}

@keyframes coin-shimmer {
  0% {
    transform: translateX(0) rotate(18deg);
    opacity: 0;
  }

  14% {
    opacity: 0.95;
  }

  50% {
    transform: translateX(220%) rotate(18deg);
    opacity: 0.4;
  }

  100% {
    transform: translateX(220%) rotate(18deg);
    opacity: 0;
  }
}
</style>
