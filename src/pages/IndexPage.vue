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
      >
        <component :is="item.name" class="grid-item-content" />
      </GridItem>
    </GridLayout>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
// @ts-expect-error('no types')
import { GridLayout, GridItem } from 'vue-grid-layout-v3';

const widgets = [
  {
    name: 'PomodoroItem',
    x: 0,
    y: 0,
    w: 3,
    h: 5.5,
    i: '0',
    resizable: false,
    draggable: true,
    static: false,
    minW: 3,
    minH: 5.5,
  },
  {
    name: 'TimeSelector',
    x: 3,
    y: 0,
    w: 2,
    h: 5.5,
    i: '1',
    resizable: false,
    draggable: true,
    static: false,
  },
  {
    name: 'UserTodo',
    x: 5,
    y: 0,
    w: 3,
    h: 8,
    i: '2',
    resizable: false,
    draggable: true,
    static: false,
  },
  {
    name: 'StartTodo',
    x: 8,
    y: 0,
    w: 4,
    h: 9,
    i: '3',
    resizable: false,
    draggable: true,
    static: false,
  },
  {
    name: 'MusicPlayer',
    x: 0,
    y: 6,
    w: 2,
    h: 4,
    i: '4',
    resizable: false,
    draggable: true,
    static: false,
  },
  {
    name: 'UserNote',
    x: 2,
    y: 6,
    w: 3,
    h: 3.5,
    i: '5',
    resizable: false,
    draggable: true,
    static: false,
  },
];

const state = reactive({
  layout: JSON.parse(JSON.stringify(widgets)),
  layout2: JSON.parse(JSON.stringify(widgets)),
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

onMounted(() => {
  state.index = state.layout.length;
});

function setRef(e: object) {
  layoutRef = e;
}
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
