<template>
  <v-app>
    <v-main>
      <v-container class="d-flex align-center justify-center" style="min-height: 100vh;">
        <v-card max-width="400" class="w-100">
          <slot />
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
</script> 