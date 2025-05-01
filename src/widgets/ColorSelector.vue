<template>
  <q-dialog backdrop-filter="blur(4px) saturate(150%) brightness(50%)">
    <q-card class="bg radius-15 q-pa-sm">
      <q-card-section class="row justify-center q-pb-none text-h6 user-font">
        {{ $t('change_font_color') }}
      </q-card-section>
      <q-card-section>
        <q-color v-model="hex" no-header no-footer class="my-picker" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import{ ref, watch } from 'vue'
import { useFontColorStore } from 'stores/fontColor'

const fontColorStore = useFontColorStore()
const hex = ref(fontColorStore.fontColor)

watch(hex, (newColor) => {
  fontColorStore.setFontColor(newColor)
})
</script>

<style scoped>

::v-deep(.q-color-picker .q-tab-panels) {
  background: var(--user-font-color) !important;
}

</style>

