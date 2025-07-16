<template>
  <v-main class="pa-0 fill-height">
    <CustomYandexMap />
  </v-main>
</template>

<script setup>
import CustomYandexMap from '../components/CustomYandexMap.vue'
</script>

<style>
body, html, .v-main {
  overflow: hidden !important;
  overscroll-behavior: none !important;
}
</style> 