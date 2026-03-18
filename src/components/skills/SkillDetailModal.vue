<script setup lang="ts">
import {
  BadgeCheck,
  Bot,
  Copy,
  Download,
  Package,
  Star,
  UserRound,
  X,
  Zap,
} from "lucide-vue-next";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { SkillCard, SkillDetailResponse } from "@/types/skills";
import {
  fillSkillTemplate,
  formatCompactNumber,
  getCategoryTone,
  getSkillAccent,
  getSkillInitials,
} from "@/utils/skills";

const props = defineProps<{
  skill: SkillCard | null;
  detail: SkillDetailResponse | null;
  loading: boolean;
  error: string;
  activeMode: "agent" | "human";
}>();

const emit = defineEmits<{
  close: [];
  modeChange: [mode: "agent" | "human"];
}>();

const copiedKeys = ref(new Set<string>());
const copyResetTimers = new Map<string, ReturnType<typeof window.setTimeout>>();

const accent = computed(() =>
  props.skill
    ? getSkillAccent(props.skill.slug)
    : { from: "#4f8cff", to: "#245cff", soft: "#4f8cff20" },
);

const initials = computed(() =>
  props.skill ? getSkillInitials(props.skill.name) : "S",
);

const activeInstallMode = computed(() => {
  if (!props.detail) {
    return null;
  }

  return (
    props.detail.installModes.find(mode => mode.key === props.activeMode) ??
    props.detail.installModes[0] ??
    null
  );
});

const isHumanMode = computed(() => props.activeMode === "human");

const footerTip = computed(() => props.detail?.footerTips?.[0] ?? "");

function resolveBlockContent(template: string) {
  if (!props.skill) {
    return template;
  }

  return fillSkillTemplate(template, props.skill.slug);
}

function resetCopyState() {
  copyResetTimers.forEach(timer => {
    window.clearTimeout(timer);
  });
  copyResetTimers.clear();
  copiedKeys.value = new Set();
}

async function copyCode(key: string, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    copiedKeys.value = new Set(copiedKeys.value).add(key);

    const existingTimer = copyResetTimers.get(key);

    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    const resetTimer = window.setTimeout(() => {
      const nextKeys = new Set(copiedKeys.value);
      nextKeys.delete(key);
      copiedKeys.value = nextKeys;
      copyResetTimers.delete(key);
    }, 3000);

    copyResetTimers.set(key, resetTimer);
  } catch {
    // Swallow clipboard failures in unsupported environments.
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    emit("close");
  }
}

watch(
  () => props.skill?.slug,
  () => {
    resetCopyState();
  },
  { immediate: true },
);

watch(
  () => Boolean(props.skill),
  isOpen => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    if (isOpen) {
      window.addEventListener("keydown", handleKeydown);
    } else {
      window.removeEventListener("keydown", handleKeydown);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  resetCopyState();
  document.body.style.overflow = "";
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="props.skill"
        class="fixed inset-0 z-50 flex cursor-pointer items-start justify-center overflow-y-auto bg-[rgba(15,23,42,0.18)] px-4 py-4 backdrop-blur-md sm:items-center sm:px-6 sm:py-8"
        @click.self="emit('close')"
      >
        <Transition name="modal-panel">
          <div
            class="relative w-full max-w-[620px] max-h-[calc(100vh-2rem)] cursor-default overflow-y-auto rounded-[34px] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,248,252,0.94)_100%)] shadow-[0_40px_120px_rgba(15,23,42,0.18)] sm:max-h-[calc(100vh-4rem)]"
          >
            <div class="px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
              <div class="flex items-start justify-between gap-4">
                <div class="flex min-w-0 items-start gap-4">
                  <div
                    class="flex h-14 w-14 items-center justify-center rounded-[20px] text-base font-semibold text-white shadow-[0_16px_32px_rgba(37,99,235,0.22)]"
                    :style="{
                      background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
                    }"
                  >
                    {{ initials }}
                  </div>

                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <h3
                        class="clamp-1 font-['Outfit'] text-[24px] font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-[26px]"
                      >
                        {{ props.skill.name }}
                      </h3>
                      <span
                        v-if="props.skill.isFeatured"
                        class="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-600"
                      >
                        <BadgeCheck class="h-3 w-3" />
                        精选
                      </span>
                    </div>
                    <p
                      class="mt-1 clamp-1 font-['JetBrains_Mono'] text-[12px] text-slate-400"
                    >
                      {{ props.skill.slug }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors duration-200 hover:text-slate-900"
                    @click="emit('close')"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div class="mt-3.5 space-y-3.5 sm:mt-4 sm:space-y-4">
                <div>
                  <div class="flex items-center gap-2.5">
                    <span
                      class="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600"
                    >
                      v{{ props.skill.version }}
                    </span>
                    <span
                      v-if="props.skill.isFeatured"
                      class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-600"
                    >
                      <Zap class="h-3 w-3" />
                      加速安装
                    </span>
                    <span
                      :class="
                        getCategoryTone(props.skill.primaryCategory).solidClass
                      "
                      class="inline-flex rounded-full px-3 py-1 text-[11px] font-medium"
                    >
                      {{ props.skill.primaryCategory }}
                    </span>
                  </div>

                  <p class="mt-3 clamp-2 text-[14px] leading-6 text-slate-600">
                    {{ props.skill.summary || "当前技能暂无补充描述。" }}
                  </p>
                </div>

                <div class="grid grid-cols-3 gap-2.5">
                  <div
                    class="rounded-[20px] bg-white px-3.5 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
                  >
                    <p
                      class="inline-flex items-center gap-1 text-[11px] text-slate-400"
                    >
                      <Download class="h-3 w-3 text-sky-500" />
                      下载量
                    </p>
                    <p
                      class="mt-1.5 font-['Outfit'] text-[24px] font-semibold leading-none tracking-[-0.04em] text-slate-950 sm:text-[26px]"
                    >
                      {{ formatCompactNumber(props.skill.downloads) }}
                    </p>
                    <p class="mt-1 text-[11px] text-slate-400">下载量</p>
                  </div>
                  <div
                    class="rounded-[20px] bg-white px-3.5 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
                  >
                    <p
                      class="inline-flex items-center gap-1 text-[11px] text-slate-400"
                    >
                      <Star class="h-3 w-3 text-amber-500" />
                      收藏
                    </p>
                    <p
                      class="mt-1.5 font-['Outfit'] text-[24px] font-semibold leading-none tracking-[-0.04em] text-slate-950 sm:text-[26px]"
                    >
                      {{ formatCompactNumber(props.skill.stars) }}
                    </p>
                    <p class="mt-1 text-[11px] text-slate-400">收藏</p>
                  </div>
                  <div
                    class="rounded-[20px] bg-white px-3.5 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
                  >
                    <p
                      class="inline-flex items-center gap-1 text-[11px] text-slate-400"
                    >
                      <Package class="h-3 w-3 text-emerald-500" />
                      安装量
                    </p>
                    <p
                      class="mt-1.5 font-['Outfit'] text-[24px] font-semibold leading-none tracking-[-0.04em] text-slate-950 sm:text-[26px]"
                    >
                      {{ formatCompactNumber(props.skill.installs) }}
                    </p>
                    <p class="mt-1 text-[11px] text-slate-400">安装量</p>
                  </div>
                </div>

                <div>
                  <p class="text-[18px] font-semibold text-slate-900">
                    安装方式
                  </p>
                  <p
                    v-if="props.detail"
                    class="mt-1 text-xs leading-5 text-slate-400"
                  >
                    {{ props.detail.note }}
                  </p>

                  <div class="mt-3 rounded-full bg-slate-100/90 p-1">
                    <div class="grid grid-cols-2 gap-1">
                      <button
                        v-for="mode in props.detail?.installModes ?? []"
                        :key="mode.key"
                        type="button"
                        :class="
                          props.activeMode === mode.key
                            ? 'bg-white text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.1)]'
                            : 'text-slate-400'
                        "
                        class="h-10 rounded-full px-4 text-sm font-medium transition-colors duration-200"
                        @click="emit('modeChange', mode.key)"
                      >
                        <span class="inline-flex items-center gap-2">
                          <Bot v-if="mode.key === 'agent'" class="h-4 w-4" />
                          <UserRound v-else class="h-4 w-4" />
                          {{ mode.label }}
                        </span>
                      </button>
                    </div>
                  </div>

                  <p
                    v-if="activeInstallMode?.intro"
                    class="mt-2.5 text-[12px] leading-5 text-slate-500"
                  >
                    {{ activeInstallMode.intro }}
                  </p>

                  <div v-if="props.loading" class="mt-3 space-y-3">
                    <div
                      v-for="index in 2"
                      :key="index"
                      class="rounded-[22px] bg-slate-50 px-4 py-4 animate-pulse"
                    >
                      <div class="h-4 w-36 rounded-full bg-slate-200"></div>
                      <div
                        class="mt-3 h-3 w-11/12 rounded-full bg-slate-200"
                      ></div>
                      <div class="mt-4 h-14 rounded-[16px] bg-slate-200"></div>
                    </div>
                  </div>

                  <div
                    v-else-if="props.error"
                    class="mt-3 rounded-[22px] bg-rose-50 px-4 py-4 text-sm text-rose-500"
                  >
                    {{ props.error }}
                  </div>

                  <div
                    v-else-if="activeInstallMode"
                    :class="isHumanMode ? 'mt-3 space-y-3' : 'mt-2.5 space-y-2'"
                  >
                    <div
                      v-for="(block, index) in activeInstallMode.blocks"
                      :key="`${activeInstallMode.key}-${index}`"
                    >
                      <p
                        :class="
                          isHumanMode
                            ? 'mb-2 text-[11px] leading-5 text-slate-400'
                            : 'mb-1.5 text-[11px] leading-4 text-slate-400'
                        "
                      >
                        {{ block.description }}
                      </p>

                      <div
                        v-if="!isHumanMode"
                        class="rounded-[18px] border border-slate-300/85 bg-[#eef2f7] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]"
                      >
                        <div class="flex items-start justify-between gap-3">
                          <p
                            class="min-w-0 flex-1 whitespace-pre-line text-[12px] leading-5 text-slate-600"
                          >
                            {{ resolveBlockContent(block.code) }}
                          </p>
                          <button
                            type="button"
                            class="mt-0.5 inline-flex h-7 w-[80px] shrink-0 items-center justify-center gap-1 rounded-[11px] border border-slate-200 bg-white/95 px-2 text-[9px] font-medium text-slate-500 shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition-colors duration-200 hover:text-slate-900"
                            @click="
                              copyCode(
                                `${activeInstallMode.key}-${index}`,
                                resolveBlockContent(block.code),
                              )
                            "
                          >
                            <span
                              class="inline-flex items-center gap-1 whitespace-nowrap"
                              style="font-size: 13px; line-height: 1"
                            >
                              <Copy class="h-3 w-3" />
                              {{
                                copiedKeys.has(
                                  `${activeInstallMode.key}-${index}`,
                                )
                                  ? "已复制"
                                  : block.copyLabel
                              }}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div
                        v-else
                        class="flex items-center gap-3 overflow-hidden rounded-[18px] bg-[#0a0d1d] px-3.5 py-3.5 shadow-[0_18px_30px_rgba(10,13,29,0.22)]"
                      >
                        <code
                          :title="resolveBlockContent(block.code)"
                          class="block min-w-0 flex-1 truncate font-['JetBrains_Mono'] text-[12px] leading-6 text-white"
                        >
                          {{ resolveBlockContent(block.code) }}
                        </code>
                        <button
                          type="button"
                          class="inline-flex h-7 w-[84px] shrink-0 items-center justify-center gap-1 rounded-[11px] bg-white/10 px-2 text-[9px] font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/16"
                          @click="
                            copyCode(
                              `${activeInstallMode.key}-${index}`,
                              resolveBlockContent(block.code),
                            )
                          "
                        >
                          <span
                            class="inline-flex items-center gap-1 whitespace-nowrap"
                            style="font-size: 13px; line-height: 1"
                          >
                            <Copy class="h-3 w-3" />
                            {{
                              copiedKeys.has(
                                `${activeInstallMode.key}-${index}`,
                              )
                                ? "已复制"
                                : block.copyLabel
                            }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <p
                  v-if="footerTip"
                  class="text-[12px] leading-5 text-slate-500"
                >
                  {{ footerTip }}
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.24s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-panel-enter-active,
.modal-panel-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
</style>
