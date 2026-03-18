<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import CommunitySection from '@/components/sections/CommunitySection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import SkillsExplorerSection from '@/components/sections/SkillsExplorerSection.vue'
import Top50Section from '@/components/sections/Top50Section.vue'
import SkillDetailModal from '@/components/skills/SkillDetailModal.vue'
import { useSkillsHubData } from '@/composables/useSkillsHubData'

const isHeaderScrolled = ref(false)

const {
  top50Response,
  skillsResponse,
  detailResponse,
  selectedSkill,
  top50Loading,
  skillsLoading,
  detailLoading,
  top50Error,
  skillsError,
  detailError,
  searchQuery,
  selectedCategory,
  sortBy,
  activeInstallMode,
  loadInitial,
  openSkill,
  closeSkill,
  changeTop50Page,
  changeSkillsPage,
  updateSearch,
  updateCategory,
  updateSort,
  setInstallMode,
} = useSkillsHubData()

const totalSkills = computed(() => skillsResponse.value?.meta.totalSkills ?? 0)

function handleScroll() {
  isHeaderScrolled.value = window.scrollY > 20
}

function scrollTo(target: 'hero' | 'top50' | 'explore' | 'community') {
  document.getElementById(target)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

onMounted(() => {
  void loadInitial()
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div
    class="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(69,149,255,0.14),_transparent_28%),radial-gradient(circle_at_85%_12%,_rgba(129,140,248,0.12),_transparent_20%),linear-gradient(180deg,_#f8fbff_0%,_#f5f7fb_38%,_#eef2f8_100%)] text-slate-900"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.62),_transparent_70%)]"></div>

    <SiteHeader :scrolled="isHeaderScrolled" @navigate="scrollTo" />

    <div class="relative z-10">
      <HeroSection :total-skills="totalSkills" @navigate="scrollTo" />
      <Top50Section
        :response="top50Response"
        :loading="top50Loading"
        :error="top50Error"
        @page-change="changeTop50Page"
        @skill-click="openSkill"
      />
      <SkillsExplorerSection
        :response="skillsResponse"
        :loading="skillsLoading"
        :error="skillsError"
        :query="searchQuery"
        :selected-category="selectedCategory"
        :sort-by="sortBy"
        @search="updateSearch"
        @category-change="updateCategory"
        @sort-change="updateSort"
        @page-change="changeSkillsPage"
        @skill-click="openSkill"
      />
      <CommunitySection />
    </div>

    <SkillDetailModal
      :skill="selectedSkill"
      :detail="detailResponse"
      :loading="detailLoading"
      :error="detailError"
      :active-mode="activeInstallMode"
      @close="closeSkill"
      @mode-change="setInstallMode"
    />
  </div>
</template>
