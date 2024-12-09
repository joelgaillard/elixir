<template>
  <div class="search-bar">
    <input 
      v-model="query" 
      @input="onSearch" 
      type="text" 
      placeholder="Rechercher" 
      class="search-input"
    />

  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      query: ''
    };
  },
  methods: {
    onSearch() {
      this.$emit('search', this.query);
    }
  }
};
</script>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
}

.search-input {
  width: 300px;
  padding: 10px 10px 10px 40px; 
  border: 1px solid #ccc;
  border-radius: 50px;
  font-size: 16px;
  background: url('../assets/loupe.svg') no-repeat 10px center; 
  background-size: 20px 20px; 
}


</style>