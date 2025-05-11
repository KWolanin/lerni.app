<template>
  <q-item class="user-font q-ma-sm text-bold flex row items-center">
    <q-icon :name="icon" size="20px" color="blur" class="icon-lightbulb q-mr-sm" />
    <span>{{ $t(sectionName) }}</span>
  </q-item>
  <q-list v-if="elements" class="flex flex-wrap gap-4 justify-between">
    <q-item
      v-for="theme in elements"
      :key="theme.name"
      tag="label"
      v-ripple
      style="width: 50%"
      clickable
      @click="saveSelected(theme.name)"
    >
      <q-item-section thumbnail>
        <img :src="theme.preview" width="150px" height="100px" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="user-font text-center">{{ theme.name }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import type { Theme } from '../themes';

defineProps({
  elements: {
    type: Array as () => Theme[],
    required: true,
  },
  saveSelected: {
    type: Function,
    required: true,
  },
  sectionName: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
});
</script>
