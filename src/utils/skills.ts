const accentPairs = [
  ['#4f8cff', '#245cff'],
  ['#57c4ff', '#1098f7'],
  ['#7c6cff', '#5344ff'],
  ['#28c59d', '#10906f'],
  ['#ffb44f', '#ff8a1f'],
  ['#ff7a90', '#ff4d6d'],
]

const categoryToneMap: Record<
  string,
  {
    tagClass: string
    solidClass: string
  }
> = {
  'AI 智能': {
    tagClass: 'border-sky-100 bg-sky-50 text-sky-600',
    solidClass: 'bg-sky-50 text-sky-600',
  },
  开发工具: {
    tagClass: 'border-emerald-100 bg-emerald-50 text-emerald-600',
    solidClass: 'bg-emerald-50 text-emerald-600',
  },
  效率提升: {
    tagClass: 'border-amber-100 bg-amber-50 text-amber-600',
    solidClass: 'bg-amber-50 text-amber-600',
  },
  数据分析: {
    tagClass: 'border-orange-100 bg-orange-50 text-orange-600',
    solidClass: 'bg-orange-50 text-orange-600',
  },
  内容创作: {
    tagClass: 'border-rose-100 bg-rose-50 text-rose-600',
    solidClass: 'bg-rose-50 text-rose-600',
  },
  安全合规: {
    tagClass: 'border-cyan-100 bg-cyan-50 text-cyan-600',
    solidClass: 'bg-cyan-50 text-cyan-600',
  },
  通讯协作: {
    tagClass: 'border-lime-100 bg-lime-50 text-lime-600',
    solidClass: 'bg-lime-50 text-lime-600',
  },
  未分类: {
    tagClass: 'border-slate-100 bg-slate-50 text-slate-500',
    solidClass: 'bg-slate-50 text-slate-500',
  },
}

function trimDecimal(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '')
}

function hashString(value: string) {
  return [...value].reduce((hash, char) => hash * 31 + char.charCodeAt(0), 7)
}

export function formatCompactNumber(value: number) {
  if (value >= 100000000) {
    return `${trimDecimal(value / 100000000)}亿`
  }

  if (value >= 10000) {
    return `${trimDecimal(value / 10000)}万`
  }

  return new Intl.NumberFormat('zh-CN').format(value)
}

export function formatFullNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value)
}

export function formatUpdateDate(value: number) {
  if (!value) {
    return '刚刚更新'
  }

  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

export function getSkillInitials(name: string) {
  const cleaned = name.trim()

  if (!cleaned) {
    return 'S'
  }

  const chars = cleaned.match(/[A-Za-z0-9\u4e00-\u9fa5]/g) ?? []

  return chars.slice(0, 2).join('').toUpperCase()
}

export function getSkillAccent(slug: string) {
  const index = Math.abs(hashString(slug)) % accentPairs.length
  const [from, to] = accentPairs[index]

  return {
    from,
    to,
    soft: `${from}20`,
  }
}

export function fillSkillTemplate(template: string, slug: string) {
  return template.replaceAll('<slug>', slug)
}

export function getCategoryTone(label: string) {
  return categoryToneMap[label] ?? categoryToneMap['未分类']
}
