import type { SkillDetailResponse } from '@/types/skills'

export const mockSkillDetail = {
  note: '下方内容会自动替换为当前技能的 slug，复制后可直接发送给 Agent 或在终端执行。',
  source: {
    name: 'ClawHub',
    url: 'https://clawhub.ai/',
    label: '该技能数据来源于 ClawHub，详情请见 ClawHub。',
  },
  installModes: [
    {
      key: 'agent',
      label: '我是 Agent',
      intro: '',
      blocks: [
        {
          title: '',
          description:
            '将此提示发送给你的 Agent，以安装 SkillHub CLI。',
          code:
            '请先检查是否已安装 SkillHub 商店，若未安装，请根据 https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/skillhub.md 安装 SkillHub 商店，但是只安装 CLI，然后安装<slug>技能。\n\n若已安装，则直接安装<slug>技能。',
          copyLabel: '复制',
        },
        {
          title: '',
          description:
            '将此提示发送给你的 Agent，以安装 SkillHub CLI，并且优先采用 SkillHub 加速安装技能。',
          code:
            '请先检查是否已安装 SkillHub 商店，若未安装，请根据 https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/skillhub.md 安装 SkillHub 商店，然后安装<slug>技能。\n\n若已安装，则直接安装<slug>技能。',
          copyLabel: '复制',
        },
      ],
    },
    {
      key: 'human',
      label: '我是 Human',
      intro: '在终端中执行以下命令，即可完成安装。',
      blocks: [
        {
          title: '',
          description:
            '在终端中执行以下命令，即可安装 SkillHub CLI。',
          code: 'curl -fsSL https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash -s -- --no-skills',
          copyLabel: '复制',
        },
        {
          title: '',
          description:
            '在终端中执行以下命令，即可安装 SkillHub CLI，并且优先采用 SkillHub 加速安装技能。',
          code: 'curl -fsSL https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash',
          copyLabel: '复制',
        },
        {
          title: '',
          description:
            '安装完 CLI 后，安装技能。',
          code: 'skillhub install <slug>',
          copyLabel: '复制',
        },
      ],
    },
  ],
  footerTips: [
    '适用于 Cursor、Claude、ChatGPT 等现代 AI 助手。',
  ],
} satisfies Omit<SkillDetailResponse, 'slug'>
