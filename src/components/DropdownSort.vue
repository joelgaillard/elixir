<template>
  <div class="dropdown-sort">
    <button @click="toggleDropdown" class="dropdown-button">
      {{ displayText }}
      <span class="icon"><i class="fa-solid fa-arrow-down-short-wide"></i></span>
    </button>
    <ul v-if="showDropdown" class="dropdown-menu">
      <li v-for="option in options" :key="option.value" @click="selectSort(option)"
        :class="{ 'selected': selectedSort === option.value }">
        <input type="radio" :checked="selectedSort === option.value">
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  defaultText: {
    type: String,
    default: "Trier par",
  },
});

const emit = defineEmits(['sort-selected']);

const selectedSort = ref(null);
const showDropdown = ref(false);

const displayText = computed(() => {
  if (!selectedSort.value) return props.defaultText;
  const selectedOption = props.options.find(option => option.value === selectedSort.value);
  return selectedOption ? selectedOption.label : props.defaultText;
});

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function selectSort(option) {
  selectedSort.value = option.value;
  showDropdown.value = false;
  emit('sort-selected', selectedSort.value);
}
</script>






<style scoped>
.dropdown-sort {
  position: relative;
  width: auto;
  max-width: 100%;
  flex: 1 1 auto;
  box-sizing: border-box;
}

.dropdown-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  color: var(--text-color);
  border: 1px solid #ccc;
  border-radius: 1.875rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 1rem;
  padding: 0.5rem;
  list-style: none;
  max-height: 15rem;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-button:hover,
.dropdown-button:focus {
  border-color: var(--primary-color);
}

.dropdown-menu li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.dropdown-menu li:hover {
  background-color: lightgray;
}

.dropdown-menu li.selected {
  background-color: lightgray;
}

.icon {
  margin-left: 0.5rem;
}
</style>