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
        :breakpoints="state.breakpoints"
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
import { onMounted, onUnmounted, reactive, ref, watch, computed } from 'vue';
// @ts-expect-error('no types')
import { GridLayout, GridItem } from 'vue-grid-layout-v3';
import{ widgets as defaultWidgets} from '../defaults'
import eventBus from '../eventBus'
import { useQuasar } from 'quasar'

const $q = useQuasar()


const authStore = useAuthStore();

const widgets = ref<Widget[]>([]);

const state = reactive({
  layout: JSON.parse(JSON.stringify(widgets.value)),
  layout2: JSON.parse(JSON.stringify(widgets.value)),
  draggable: true,
  resizable: false,
  mirrored: false,
  responsive: true,
  bounded: true,
  transformScale: 1,
  preventCollision: false,
  compact: true,
  restoreOnDrag: true,
  rowHeight: 50,
  colNum: 12,
  index: 0,
  marginX: 15,
  marginY: 15,
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  useCssTransforms: true,
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
  const found = defaultWidgets.find(w => w.name === name)
  if (!found) return null
  return structuredClone(found)
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

const gridColumns = computed(() => {
  if ($q.screen.lt.sm) return 1
  if ($q.screen.lt.md) return 3
  return 12
})

function setLayout(newUid: string) {
  loadLayout(newUid)
    .then(async (data) => {
      const selected = await loadSelectedWidgets(newUid)

      const allWidgets: Widget[] = []
      const occupied: boolean[][] = []
      const cols = gridColumns.value

      data?.forEach(w => {
        markAreaOccupied(occupied, w.x, w.y, w.w, w.h)
      })

      selected?.forEach((name) => {
        const existing = data?.find(w => w.name === name)
        if (existing) {
          allWidgets.push(existing)
        } else {
          const widget = defaultWidget(name)
          if (widget) {
            const widgetCopy = structuredClone(widget)

            if (widgetCopy.w > cols) {
              console.warn(`Widget "${name}" jest szerszy niż siatka (${widgetCopy.w} > ${cols})`)
              widgetCopy.x = 0
              widgetCopy.y = occupied.length
            } else {
              const pos = findNextFreePosition(occupied, widgetCopy.w, widgetCopy.h, cols)
              widgetCopy.x = pos.x
              widgetCopy.y = pos.y
              markAreaOccupied(occupied, pos.x, pos.y, widgetCopy.w, widgetCopy.h)
            }

            allWidgets.push(widgetCopy)
          }
        }
      })

      widgets.value = allWidgets
      state.layout = JSON.parse(JSON.stringify(allWidgets))
      state.index = allWidgets.length
    })
    .catch((err) => {
      console.error(err)
      widgets.value = []
      state.layout = []
    })
}



function isAreaFree(
  occupied: boolean[][],
  startX: number,
  startY: number,
  w: number,
  h: number,
  cols: number
): boolean {
  for (let y = startY; y < startY + h; y++) {
    for (let x = startX; x < startX + w; x++) {
      if (x >= cols || occupied[y]?.[x]) {
        return false
      }
    }
  }
  return true
}

function markAreaOccupied(
  occupied: boolean[][],
  startX: number,
  startY: number,
  w: number,
  h: number
) {
  for (let y = startY; y < startY + h; y++) {
    if (!occupied[y]) {
      occupied[y] = []
    }
    const row = occupied[y]!

    for (let x = startX; x < startX + w; x++) {
      row[x] = true
    }
  }
}



function findNextFreePosition(
  occupied: boolean[][],
  w: number,
  h: number,
  cols: number
): { x: number, y: number } {
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x <= cols - w; x++) {
      if (isAreaFree(occupied, x, y, w, h, cols)) {
        return { x, y }
      }
    }
  }
  return { x: 0, y: 100 }
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
