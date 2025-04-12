<template>
  <q-page>
    <div class="grid-stack" ref="gridContainer">
      <div
        v-for="(widget, index) in widgets"
        :key="index"
        class="grid-stack-item"
        :gs-x="widget.x"
        :gs-y="widget.y"
        :gs-w="widget.w"
        :gs-min-w="widget.w"
        :gs-max-w="widget.w"
        :gs-max-h="widget.h"
      >
        <div class="grid-stack-item-content">
          <component :is="widget.name" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import { GridStack } from 'gridstack';

const widgets = ref([
  { name: 'PomodoroItem', x: 0, y: 0, w: 3, h: 3 },
  { name: 'TimeSelector', x: 3, y: 0, w: 2, h: 3 },
  { name: 'UserTodo', x: 5, y: 0, w: 3, h: 4 },
  { name: 'StartTodo', x: 8, y: 0, w: 4, h: 4 },
  { name: 'MusicPlayer', x: 0, y: 3, w: 3, h: 2 },
  { name: 'UserNote', x: 0, y: 3, w: 3, h: 3 },
]);

const gridContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (gridContainer.value) {
    const grid = GridStack.init(
      {
        disableResize: true,
        column: 12,
        cellHeight: 150,
        placeholderClass: 'grid-test',
        sizeToContent: true,
        float: true
      },
      gridContainer.value,
    );

    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) {
        grid.column(1);
      } else if (width < 1024) {
        grid.column(6);
      } else {
        grid.column(12);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);

    const adjustHeightToContent = async () => {
      await nextTick()
      grid.engine.nodes.forEach((node) => {
        const content = node.el!.querySelector('.grid-stack-item-content')
        if (content) {
          const contentHeight = content.scrollHeight
          grid.update(node.el!, { h: contentHeight })
        }
      })
    }

    void adjustHeightToContent();

    grid.on('change', () => {
      void adjustHeightToContent();
    });
    grid.on('dragstop', () => {
      void adjustHeightToContent();
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const observer = new MutationObserver(adjustHeightToContent);
    grid.engine.nodes.forEach((node) => {
      const content = node.el!.querySelector('.grid-stack-item-content');
      if (content) {
        observer.observe(content, { childList: true, subtree: true, characterData: true });
      }
    });

    onUnmounted(() => {
      observer.disconnect();
      window.removeEventListener('resize', updateColumns);
      grid.off('change');
      grid.off('dragstop');
    });
  }
});
</script>

<style scoped>

.grid-stack > .grid-stack-item>.grid-stack-item-content {
  height: max-content !important;
}

.grid-stack-item  {
  height: max-content !important;
}

.grid-stack-item-content {
  height: auto !important;
  margin: 0;
  padding: 0;
  overflow: visible;
  box-sizing: border-box;
}


</style>
