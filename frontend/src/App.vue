<script setup lang="ts">
import type { Component } from 'vue'
import CookieNotice from './components/ui/CookieNotice.vue'

defineProps<{ page: Component }>()
</script>

<template>
  <component :is="page" />
  <div id="cookie-notice-root"><CookieNotice /></div>
</template>
