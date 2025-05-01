<template>
  <q-dialog backdrop-filter="blur(4px) saturate(150%) brightness(50%)">
    <q-card class="bg radius-15 q-pa-sm">
      <q-card-section class="row justify-center q-pb-none text-h6 user-font">
        {{ $t('customize_language') }}
      </q-card-section>
      <q-card-section>
        <q-list v-if="languages" class="flex flex-wrap gap-4 justify-between">
          <q-item v-for="language in languages"
          :key="language.name"
          tag="label"
          v-ripple
          style="width: 50%"
          clickable
          @click="saveSelected(language.value)"
          >
            <q-item-section thumbnail>
              <img :src="language.flag" width="150px" height="100px" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="user-font text-bold text-center">{{ language.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { languages } from 'src/languages';

const emit = defineEmits(['changeLanguage'])


const saveSelected  = (language: string) => {
  emit('changeLanguage', language);

}

</script>

<style scoped>

::v-deep(.q-color-picker .q-tab-panels) {
  background: var(--user-font-color) !important;
}

</style>

