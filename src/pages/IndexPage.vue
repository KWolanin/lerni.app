<template>
  <q-page class="bg">
    <div class="grid-stack" ref="gridContainer">
      <div
        v-for="(widget, index) in widgets"
        :key="index"
        class="grid-stack-item"
        :gs-x="widget.x"
        :gs-y="widget.y"
        :gs-w="widget.w"
        :gs-h="widget.h"
      >
        <div class="grid-stack-item-content">
          <component :is="widget.name" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import { GridStack } from 'gridstack';


// Lista komponentów
const widgets = ref([
  { name: 'PomodoroItem', x: 0, y: 0, w: 3, h: 3 },
  { name: 'TimeSelector', x: 3, y: 0, w: 2, h: 3 },
  { name: 'UserTodo', x: 5, y: 0, w: 3, h: 4 },
  { name: 'StartTodo', x: 8, y: 0, w: 4, h: 4 },
  { name: 'MusicPlayer', x: 0, y: 8, w: 3, h: 2 },
  { name: 'UserNote', x: 0, y: 8, w: 3, h: 3 },
]);

const gridContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (gridContainer.value) {
    GridStack.init({}, gridContainer.value);
  }
});
</script>

<style scoped>
.bg {
  background: linear-gradient(
    43deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(253, 29, 29, 0.5226541300113796) 50%,
    rgba(252, 176, 69, 1) 100%
  );
}

</style>
