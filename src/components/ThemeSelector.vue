<template>
  <q-dialog backdrop-filter="blur(8px) saturate(150%) brightness(100%)">
    <q-card class="bg radius-15 q-pa-sm calsans-font">
      <q-card-section class="row justify-center q-pb-none text-h6 user-font">
        {{ $t('customize_theme') }}
      </q-card-section>
      <q-card-section>
        <list-section
          :elements="plainThemes"
          section-name="plain_themes_desc"
          :saveSelected="saveSelected"
          icon="square"
        />
        <q-separator />
        <list-section
          :elements="patternThemes"
          section-name="pattern_themes_desc"
          :saveSelected="saveSelected"
          icon="pattern"
        />
        <q-separator />
        <list-section
          :elements="gradientThemes"
          section-name="gradient_themes_desc"
          :saveSelected="saveSelected"
          icon="gradient"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { themes, ThemeType } from 'src/themes';
import ListSection from './ListSection.vue';

const emit = defineEmits(['changeTheme']);

defineProps({
  currentTheme: {
    type: String,
    default: 'default',
  },
});

const saveSelected = (theme: string) => {
  emit('changeTheme', theme);
};

const plainThemes = themes.filter((theme) => theme.type === ThemeType.PLAIN);
const gradientThemes = themes.filter((theme) => theme.type === ThemeType.GRADIENT);
const patternThemes = themes.filter((theme) => theme.type === ThemeType.PATTERN);
</script>
