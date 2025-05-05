<template>
  <q-dialog backdrop-filter="blur(4px) saturate(150%) brightness(100%)">
    <q-card class="bg radius-15 q-pa-sm calsans-font">
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
              <q-item-label class="user-font text-bold text-center">{{ getLanguageNameI18n(language.name) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { languages } from 'src/languages';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' });
const emit = defineEmits(['changeLanguage'])


const saveSelected  = (language: string) => {
  emit('changeLanguage', language);

}

const getLanguageNameI18n = (name: string) => {
  switch (locale.value) {
    case 'en_US':
      return languages.find((lang) => lang.name === name)?.name_EN;
    case 'de':
      return languages.find((lang) => lang.name === name)?.name_DE;
    case 'pl':
      return languages.find((lang) => lang.name === name)?.name_PL;
    case 'ua':
      return languages.find((lang) => lang.name === name)?.name_UA;
    default:
      return languages.find((lang) => lang.name === name)?.name_EN;
  }
};

</script>

<style scoped>

::v-deep(.q-color-picker .q-tab-panels) {
  background: var(--user-font-color) !important;
}

</style>

