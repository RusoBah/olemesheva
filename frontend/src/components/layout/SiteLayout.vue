<script setup lang="ts">
import BackToTop from '../ui/BackToTop.vue'
import OffcanvasMenu from './OffcanvasMenu.vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>

<template>
<BackToTop />
<OffcanvasMenu />
<AppHeader />
<slot />
<AppFooter />
</template>
