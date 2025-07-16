<template>
  <div :class="styles['notfound-container']">
    <h1 :class="styles['notfound-title']">404</h1>
    <p :class="styles['notfound-text']">Страница не найдена</p>
    <router-link :class="styles['notfound-link']" to="/">На главную</router-link>
  </div>
</template>

<script setup>
import styles from '../styles/NotFoundPage.module.scss'
</script> 