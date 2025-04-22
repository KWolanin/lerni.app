<template>
  <q-page>
    <GridLayout
      :ref="setRef"
      id="grid-layout-test"
      :margin="[Number(state.marginX), Number(state.marginY)]"
      v-model:layout="state.layout"
      :col-num="Number(state.colNum)"
      :row-height="state.rowHeight"
      :is-draggable="state.draggable"
      :is-resizable="state.resizable"
      :is-mirrored="state.mirrored"
      :is-bounded="state.bounded"
      :prevent-collision="state.preventCollision"
      :vertical-compact="state.compact"
      :restore-on-drag="state.restoreOnDrag"
      :use-css-transforms="true"
      :responsive="state.responsive"
      :transform-scale="state.transformScale"
      @layout-updated="layoutUpdatedEvent"
    >
      <GridItem
        v-for="item in state.layout"
        :key="item.i"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-w="item.minW"
        :max-w="item.maxW"
        :min-x="item.minX"
        :max-x="item.maxX"
        :min-y="item.minY"
        :max-y="item.maxY"
        :preserve-aspect-ratio="item.preserveAspectRatio"
        :drag-ignore-from="item.dragIgnoreFrom"
      >
        <component :is="item.name" class="grid-item-content" />
      </GridItem>
    </GridLayout>
  </q-page>
</template>

<script setup lang="ts">
import { debounce, isEqual } from 'lodash';
import { useAuthStore } from '../stores/auth';
import { loadLayout, loadSelectedWidgets, saveLayout } from 'src/service/firebase';
import type { Widget } from 'src/types';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
// @ts-expect-error('no types')
import { GridLayout, GridItem } from 'vue-grid-layout-v3';
import defaults from '../defaults'
import eventBus from '../eventBus'


const authStore = useAuthStore();

const widgets = ref<Widget[]>([]);

const state = reactive({
  layout: JSON.parse(JSON.stringify(widgets.value)),
  layout2: JSON.parse(JSON.stringify(widgets.value)),
  draggable: true,
  resizable: false,
  mirrored: false,
  responsive: true,
  bounded: false,
  transformScale: 1,
  preventCollision: false,
  compact: true,
  restoreOnDrag: true,
  rowHeight: 50,
  colNum: 12,
  index: 0,
  marginX: 15,
  marginY: 15,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let layoutRef;

function setRef(e: object) {
  layoutRef = e;
}

function layoutUpdatedEvent(newLayout: Widget[]) {
  if (!isEqual(previous, newLayout)) {
    debouncedSave(newLayout);
    previous = newLayout;
  }
}

const defaultWidget = (name: string): Widget | null => {
  const found = defaults.find(w => w.name === name)
  if (!found) return null
  return JSON.parse(JSON.stringify(found))
}

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      setLayout(newUid);
    }
  },
  { immediate: true },
);

let previous: Widget[] | null = null;

const debouncedSave = debounce((newData: Widget[]) => {
  saveLayout(authStore.uid, newData).catch((err) => console.error(err));
}, 1000);

function setLayout(newUid: string) {
  loadLayout(newUid)
    .then(async (data) => {
      const selected = await loadSelectedWidgets(newUid);

      const allWidgets: Widget[] = [];

      selected?.forEach((name) => {
        const existing = data?.find((w) => w.name === name);
        if (existing) {
          allWidgets.push(existing);
        } else {
          const widget = defaultWidget(name);
          if (widget) {
            allWidgets.push(widget);
          }
        }
      });

      widgets.value = allWidgets;
      state.layout = JSON.parse(JSON.stringify(allWidgets));
      state.index = allWidgets.length;
    })
    .catch((err) => {
      console.error(err);
      widgets.value = [];
      state.layout = [];
    });
}

const refreshDashboard = () => {
  setLayout(authStore.uid)
}

onMounted(() => {
  eventBus.on('refresh-dashboard', refreshDashboard)
})

onUnmounted(() => {
  eventBus.off('refresh-dashboard', refreshDashboard)
})


</script>

<style scoped>
:deep(.grid-item-content) {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
