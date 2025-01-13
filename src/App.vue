<template>
  <div id="app">
    <header>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <Navigation/>
    </footer>
  </div>
</template>

<script setup>
import Navigation from './components/Navigation.vue'
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
}

main {
  padding-left: 5%;
  padding-right: 5%;
  padding-top:0;
  padding-bottom: 4rem;
}
</style>