<template>
  <AuthLayout>
    <v-card-title>Регистрация</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field label="Email" type="email" required></v-text-field>
        <v-text-field label="Пароль" type="password" required></v-text-field>
        <v-text-field label="Подтвердите пароль" type="password" required></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block @click="$emit('close')">Зарегистрироваться</v-btn>
      <v-btn variant="text" block @click="$emit('close')">Отмена</v-btn>
    </v-card-actions>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../layouts/AuthLayout.vue'
import styles from '../styles/RegisterPage.module.scss'
const emit = defineEmits(['close'])
</script> 