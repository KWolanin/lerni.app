<template>
  <q-dialog backdrop-filter="blur(4px) saturate(150%) brightness(50%)">
    <q-card class="bg radius-15 q-pa-sm">
      <q-card-section class="row items-center q-pb-none text-h6 user-font">
        <!-- {{ $t('customize_theme') }} -->
          change font color
      </q-card-section>
      <q-card-section>
        <q-color v-model="hex" no-header no-footer class="my-picker" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFontColorStore } from 'stores/fontColor'

const fontColorStore = useFontColorStore()
const hex = ref(fontColorStore.fontColor)

// Gdy użytkownik wybierze nowy kolor, zapisujemy go do store
watch(hex, (newColor) => {
  fontColorStore.setFontColor(newColor)
})
</script>

