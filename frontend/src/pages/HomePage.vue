<script setup lang="ts">
import SiteLayout from '../components/layout/SiteLayout.vue'
import SectionDivider from '../components/ui/SectionDivider.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import EducationSection from '../components/sections/EducationSection.vue'
import ServicesSection from '../components/sections/ServicesSection.vue'
import PoetrySection from '../components/sections/PoetrySection.vue'
import PricingSection from '../components/sections/PricingSection.vue'
import LocationSection from '../components/sections/LocationSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import SocialSection from '../components/sections/SocialSection.vue'
</script>

<template>
<SiteLayout>
  <main>
    <HeroSection />
    <AboutSection />
    <SectionDivider />
    <EducationSection />
    <SectionDivider />
    <ServicesSection />
    <PoetrySection />
    <PricingSection />
    <LocationSection />
    <ContactSection />
    <SectionDivider />
    <SocialSection />
  </main>
</SiteLayout>
</template>
