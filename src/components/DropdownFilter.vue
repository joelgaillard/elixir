<template>
  <div class="dropdown-filter">
    <button @click="toggleDropdown" class="dropdown-button">
      {{ displayText }}
      <span class="icon"><i class="fa-solid fa-filter"></i></span>
    </button>
    <ul v-if="showDropdown" class="dropdown-menu">
      <li class="reset-filters" @click="resetFilters">
        <button class="reset-button">Réinitialiser les filtres</button>
      </li>
      <li v-for="option in options" :key="option" @click="toggleFilter(option)"
        :class="{ 'selected': selectedFilters.includes(option) }">
        <input type="checkbox" :checked="selectedFilters.includes(option)">
        {{ option }}
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
    default: "Filtrer par type",
  },
});

const emit = defineEmits(['filter-selected', 'reset-filters']);

const selectedFilters = ref([]);
const showDropdown = ref(false);

const displayText = computed(() => {
  if (selectedFilters.value.length === 1) {
    return `${selectedFilters.value.length} ingrédient sélectionné`;
  } else if (selectedFilters.value.length > 1) {
    return `${selectedFilters.value.length} ingrédients sélectionnés`;
  } else {
    return props.defaultText;
  }
});
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function toggleFilter(option) {
  const index = selectedFilters.value.indexOf(option);
  if (index === -1) {
    selectedFilters.value.push(option);
  } else {
    selectedFilters.value.splice(index, 1);
  }
  emit('filter-selected', selectedFilters.value);
}

function resetFilters() {
  selectedFilters.value = [];
  emit('reset-filters');
  showDropdown.value = false;
}
</script>

<style scoped>
.dropdown-filter {
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
  z-index: 10;
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

.reset-filters {
  margin-top: 0.5rem;
  text-align: center;
}

.reset-button {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  transition: color 0.3s;
}

.reset-button:hover {
  color: darkred;
}

.icon {
  margin-left: 0.5rem;
}
</style>