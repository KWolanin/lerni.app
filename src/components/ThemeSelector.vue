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
          :is-user-premium="isPremium"
        />
        <q-separator />
        <list-section
          :elements="patternThemes"
          section-name="pattern_themes_desc"
          :saveSelected="saveSelected"
          icon="pattern"
          :is-user-premium="isPremium"
        />
        <q-separator />
        <list-section
          :elements="gradientThemes"
          section-name="gradient_themes_desc"
          :saveSelected="saveSelected"
          icon="gradient"
          :is-user-premium="isPremium"
        />
        <q-separator v-if="!isPremium" />
        <q-item v-if="!isPremium" class="flex row items-center justify-center user-font">
          <q-btn icon="star" flat to="premium">{{ $t('unlock_all_themes') }}</q-btn>
        </q-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { themes, ThemeType } from 'src/themes';
import ListSection from './ListSection.vue';

const emit = defineEmits(['changeTheme']);

const props = defineProps({
  currentTheme: {
    type: String,
    default: 'default',
  },
  isPremium: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const saveSelected = (theme: string) => {
  const selectedTheme = themes.find((t) => t.name === theme);
  if (selectedTheme?.premium && !props.isPremium) {
    return;
  }
  emit('changeTheme', theme);
};

const plainThemes = themes.filter((theme) => theme.type === ThemeType.PLAIN);
const gradientThemes = themes.filter((theme) => theme.type === ThemeType.GRADIENT);
const patternThemes = themes.filter((theme) => theme.type === ThemeType.PATTERN);
</script>
