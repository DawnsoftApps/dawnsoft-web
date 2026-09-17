<script setup>
import { computed, ref, watch } from 'vue'
import {
  languageOptions,
  normalizeLanguage,
  resolveLanguage,
} from '../privacy/language.js'

const supportFiles = import.meta.glob('./locales/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const supportPages = Object.fromEntries(
  Object.entries(supportFiles).map(([path, page]) => [
    path.match(/\/([^/]+)\.html$/)[1],
    page,
  ]),
)

const pageText = {
  en: {
    title: 'Tabs Keeper Support',
    description: 'Get help with Tabs Keeper for iPhone, iPad, Mac, and Safari.',
    language: 'Language',
    automatic: 'Auto (browser language)',
  },
  'zh-Hans': {
    title: 'Tabs Keeper 技术支持',
    description: '获取 Tabs Keeper 在 iPhone、iPad、Mac 和 Safari 上的使用帮助。',
    language: '语言',
    automatic: '自动（浏览器语言）',
  },
  'zh-Hant': {
    title: 'Tabs Keeper 技術支援',
    description: '取得 Tabs Keeper 在 iPhone、iPad、Mac 和 Safari 上的使用協助。',
    language: '語言',
    automatic: '自動（瀏覽器語言）',
  },
  ja: {
    title: 'Tabs Keeper サポート',
    description: 'iPhone、iPad、Mac、Safari での Tabs Keeper の使い方をご案内します。',
    language: '言語',
    automatic: '自動（ブラウザの言語）',
  },
  ko: {
    title: 'Tabs Keeper 지원',
    description: 'iPhone, iPad, Mac 및 Safari용 Tabs Keeper 도움말을 확인하세요.',
    language: '언어',
    automatic: '자동(브라우저 언어)',
  },
  de: {
    title: 'Tabs Keeper Support',
    description: 'Hilfe zu Tabs Keeper für iPhone, iPad, Mac und Safari.',
    language: 'Sprache',
    automatic: 'Automatisch (Browsersprache)',
  },
  fr: {
    title: 'Assistance Tabs Keeper',
    description: 'Obtenez de l’aide pour Tabs Keeper sur iPhone, iPad, Mac et Safari.',
    language: 'Langue',
    automatic: 'Automatique (langue du navigateur)',
  },
}

const browserLanguages = navigator.languages?.length
  ? navigator.languages
  : [navigator.language]
const requestedLanguage = new URLSearchParams(window.location.search).get('lang')
const locale = ref(resolveLanguage(window.location.search, browserLanguages))
const selection = ref(
  requestedLanguage === null
    ? 'auto'
    : normalizeLanguage(requestedLanguage) ?? 'en',
)

const text = computed(() => pageText[locale.value])
const support = computed(
  () => supportPages[locale.value] ?? supportPages.en,
)

watch(
  locale,
  (language) => {
    document.documentElement.lang = language
    document.title = pageText[language].title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', pageText[language].description)
  },
  { immediate: true },
)

function changeLanguage() {
  const url = new URL(window.location.href)

  if (selection.value === 'auto') {
    url.searchParams.delete('lang')
    locale.value = resolveLanguage('', browserLanguages)
  } else {
    url.searchParams.set('lang', selection.value)
    locale.value = selection.value
  }

  window.history.replaceState(null, '', url)
}
</script>

<template>
  <header class="toolbar">
    <a class="brand" href="./" aria-label="Tabs Keeper">
      <img class="brand-mark" src="../privacy/icon.png" alt="" />
      <span>Tabs Keeper</span>
    </a>

    <label class="language-picker">
      <span>{{ text.language }}</span>
      <select v-model="selection" @change="changeLanguage">
        <option value="auto">{{ text.automatic }}</option>
        <option
          v-for="option in languageOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </label>
  </header>

  <main>
    <article class="policy" v-html="support"></article>
  </main>
</template>
