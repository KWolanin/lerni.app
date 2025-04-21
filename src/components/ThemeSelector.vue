<template>
  <q-dialog backdrop-filter="blur(4px) saturate(150%) brightness(50%)">
    <q-card class="bg radius-15 q-pa-sm">
      <q-card-section class="row items-center q-pb-none text-h6 text-white">
        {{ $t('customize_theme') }}
      </q-card-section>
      <q-card-section>
        <q-list v-if="themes" class="flex flex-wrap gap-4 justify-between">
          <q-item v-for="theme in themes"
          :key="theme.name"
          tag="label"
          v-ripple
          style="width: 50%"
          clickable
          @click="saveSelected(theme.name)"
          >
            <q-item-section thumbnail>
              <img :src="theme.preview" width="150px" height="100px" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-white text-bold">{{ theme.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { themes } from 'src/themes';

const emit = defineEmits(['changeTheme'])

defineProps({
  currentTheme: {
    type: String,
    default: 'default',
  },
})

const saveSelected = (theme: string) => {
  emit('changeTheme', theme);
};

</script>
