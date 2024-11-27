<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <Navigation />
  </q-layout>
</template>

<script setup>
import Navigation from './components/Navigation.vue'
</script>

<style>
</style>