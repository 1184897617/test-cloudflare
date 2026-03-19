<script setup lang="ts">
import { Bot, Check, Copy, Sparkles, UserRound } from "lucide-vue-next";
import { computed, onBeforeUnmount, ref } from "vue";
import RevealBlock from "@/components/base/RevealBlock.vue";

defineProps<{
  totalSkills: number;
}>();

const emit = defineEmits<{
  navigate: [target: "top50" | "explore"];
}>();

const previewModeOrder = ["agent", "human"] as const;

type PreviewModeKey = (typeof previewModeOrder)[number];

const installPreviewModes = {
  agent: {
    label: "我是 Agent",
    blocks: [
      {
        description: "将此提示发送给你的 Agent，以安装 SkillHub CLI",
        content:
          "根据 https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/skillhub.md 安装 SkillHub 商店，但是只安装 CLI。",
        isCode: false,
      },
      {
        description:
          "将此提示发送给你的 Agent，以安装 SkillHub CLI，并且优先采用 SkillHub 加速安装技能",
        content:
          "根据 https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/skillhub.md 安装 SkillHub 商店。",
        isCode: false,
      },
    ],
  },
  human: {
    label: "我是 Human",
    blocks: [
      {
        description: "在终端中执行以下命令，即可安装 SkillHub CLI",
        content:
          "curl -fsSL https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash  -s -- --no-skills",
        isCode: true,
      },
      {
        description:
          "在终端中执行以下命令，即可安装 SkillHub CLI，并且优先采用 SkillHub 加速安装技能",
        content:
          "curl -fsSL https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash",
        isCode: true,
      },
    ],
  },
} as const;

const activePreviewMode = ref<PreviewModeKey>("agent");
const copiedKey = ref<string | null>(null);
const activePreviewBlocks = computed(
  () => installPreviewModes[activePreviewMode.value].blocks,
);

let copyResetTimer: number | null = null;

async function copyPreviewContent(key: string, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    copiedKey.value = key;

    if (copyResetTimer !== null) {
      window.clearTimeout(copyResetTimer);
    }

    copyResetTimer = window.setTimeout(() => {
      copiedKey.value = null;
      copyResetTimer = null;
    }, 2200);
  } catch {
    // Ignore clipboard failures in unsupported environments.
  }
}

onBeforeUnmount(() => {
  if (copyResetTimer !== null) {
    window.clearTimeout(copyResetTimer);
  }
});
</script>

<template>
  <section id="hero" class="relative scroll-mt-28 pt-24">
    <div class="page-container pb-24 pt-14">
      <div class="grid grid-cols-[1.08fr_0.92fr] items-center gap-14">
        <RevealBlock :delay="40">
          <div class="relative">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/82 px-4 py-2 text-sm text-sky-600 shadow-[0_14px_32px_rgba(59,130,246,0.08)] backdrop-blur-xl"
            >
              <Sparkles class="h-3.5 w-3.5" />
              精选 AI 技能，连接效率与收益
            </div>

            <h1
              class="mt-8 font-['Outfit'] text-[68px] font-semibold leading-[0.96] tracking-[-0.065em] text-slate-950"
            >
              <span class="block"> 发现真正有用的 </span>
              <span
                class="mt-3 block bg-[linear-gradient(135deg,#1b8eff_0%,#4c6fff_52%,#7a7dff_100%)] bg-clip-text text-transparent"
              >
                AI 技能
              </span>
            </h1>

            <p class="mt-7 max-w-[540px] text-[17px] leading-8 text-slate-500">
              别管那么多，NB就完事了！
            </p>

            <div class="mt-9 flex items-center gap-4">
              <button
                type="button"
                class="rounded-full bg-[linear-gradient(135deg,#1495ff_0%,#2f66ff_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(37,99,235,0.25)] transition-transform duration-300 hover:-translate-y-0.5"
                @click="emit('navigate', 'explore')"
              >
                立即探索
              </button>
              <button
                type="button"
                class="rounded-full border border-white/80 bg-white/78 px-6 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5"
                @click="emit('navigate', 'top50')"
              >
                查看精选技能
              </button>
            </div>

            <div class="mt-12 flex items-center gap-6 text-sm text-slate-500">
              <div
                class="rounded-[24px] border border-white/80 bg-white/72 px-5 py-4 shadow-[0_16px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <p
                  class="font-['Outfit'] text-[30px] font-semibold text-slate-950"
                >
                  {{ totalSkills.toLocaleString("zh-CN") }}
                </p>
                <p class="mt-1">已收录技能总数</p>
              </div>
            </div>
          </div>
        </RevealBlock>

        <RevealBlock :delay="180" :y="36">
          <div class="relative ml-auto max-w-[430px] animate-hero-float">
            <div
              class="absolute -left-8 top-16 h-36 w-36 rounded-full bg-sky-200/45 blur-3xl"
            ></div>
            <div
              class="absolute -right-4 bottom-2 h-40 w-40 rounded-full bg-violet-200/45 blur-3xl"
            ></div>

            <div
              class="relative rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(245,247,251,0.96)_100%)] px-6 py-6 shadow-[0_40px_120px_rgba(15,23,42,0.13),inset_0_1px_0_rgba(255,255,255,0.84)] backdrop-blur-[26px]"
            >
              <div
                role="tablist"
                class="grid grid-cols-2 gap-1 rounded-[18px] bg-[#eef0f5] p-1"
              >
                <button
                  v-for="mode in previewModeOrder"
                  :key="mode"
                  type="button"
                  role="tab"
                  :aria-selected="activePreviewMode === mode"
                  :class="
                    activePreviewMode === mode
                      ? 'bg-white text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.1)]'
                      : 'text-slate-400'
                  "
                  class="flex items-center justify-center gap-2 rounded-[15px] px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                  @click="activePreviewMode = mode"
                >
                  <Bot v-if="mode === 'agent'" class="h-4 w-4" />
                  <UserRound v-else class="h-4 w-4" />
                  {{ installPreviewModes[mode].label }}
                </button>
              </div>

              <Transition name="preview-fade" mode="out-in">
                <div :key="activePreviewMode" class="mt-4 space-y-3.5">
                  <div
                    v-for="(block, index) in activePreviewBlocks"
                    :key="`${activePreviewMode}-${index}`"
                  >
                    <p class="mb-1.5 px-1 text-[11px] leading-5 text-slate-400">
                      {{ block.description }}
                    </p>

                    <div
                      class="flex items-center gap-2.5 rounded-[16px] border border-slate-200/80 bg-[#f5f6fa] px-3.5 py-2.5 shadow-[0_10px_22px_rgba(15,23,42,0.05)]"
                    >
                      <div
                        v-if="block.isCode"
                        class="flex min-w-0 flex-1 items-center gap-2.5"
                      >
                        <span
                          class="font-['JetBrains_Mono'] text-[18px] font-semibold leading-none text-amber-500"
                        >
                          $
                        </span>
                        <code
                          :title="block.content"
                          class="block min-w-0 flex-1 truncate font-['JetBrains_Mono'] text-[12px] leading-5 text-slate-700"
                        >
                          {{ block.content }}
                        </code>
                      </div>

                      <p
                        v-else
                        :title="block.content"
                        class="min-w-0 flex-1 truncate text-[12.5px] leading-5 text-slate-600"
                      >
                        {{ block.content }}
                      </p>

                      <button
                        type="button"
                        class="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[13px] bg-[#ececf1] px-3 text-[12px] font-medium text-slate-500 transition-colors duration-200 hover:bg-[#e4e6ec] hover:text-slate-700"
                        @click="
                          copyPreviewContent(
                            `${activePreviewMode}-${index}`,
                            block.content,
                          )
                        "
                      >
                        <Check
                          v-if="copiedKey === `${activePreviewMode}-${index}`"
                          class="h-3.5 w-3.5"
                        />
                        <Copy v-else class="h-3.5 w-3.5" />
                        {{
                          copiedKey === `${activePreviewMode}-${index}`
                            ? "已复制"
                            : "复制"
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </RevealBlock>
      </div>
    </div>
  </section>
</template>

<style scoped>
.preview-fade-enter-active,
.preview-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
