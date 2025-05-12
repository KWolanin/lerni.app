<template>
  <q-dialog backdrop-filter="blur(8px) saturate(150%) brightness(100%)">
    <q-card class="bg radius-15 q-pa-sm calsans-font">
      <q-card-section class="row justify-center q-pb-none text-h6 user-font">
        {{ $t('change_font_color') }}
      </q-card-section>
      <q-card-section>
        <q-color v-model="color" no-header no-footer class="my-picker" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import{ ref, watch } from 'vue'
import { useFontColorStore } from 'stores/fontColor'

const fontColorStore = useFontColorStore()
const color = ref(fontColorStore.fontColor)

watch(color, (newColor) => {
  fontColorStore.setFontColor(newColor)
})
</script>

<style scoped>
/* bar color */
::v-deep(.q-color-picker .q-tab-panels) {
  background: var(--user-font-color);
}
</style>

