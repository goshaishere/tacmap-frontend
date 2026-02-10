<template>
  <AuthLayout>
    <v-card-title>{{ $t('auth.login') }}</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field :label="$t('auth.email')" type="email" required></v-text-field>
        <v-text-field :label="$t('auth.password')" type="password" required></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block @click="$emit('close')">Войти</v-btn>
      <v-btn variant="text" block @click="$emit('close')">Отмена</v-btn>
    </v-card-actions>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../layouts/AuthLayout.vue'
import styles from '../styles/LoginPage.module.scss'
const emit = defineEmits(['close'])
</script> 