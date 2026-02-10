<template>
  <div :class="styles['notfound-container']">
    <h1 :class="styles['notfound-title']">404</h1>
    <p :class="styles['notfound-text']">{{ $t('notFound.title') }}</p>
    <router-link :class="styles['notfound-link']" to="/">{{ $t('nav.home') }}</router-link>
  </div>
</template>

<script setup>
import styles from '../styles/NotFoundPage.module.scss'
</script> 