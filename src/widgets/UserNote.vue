<template>
  <q-card class="q-pa-sm q-ma-sm flex column justify-between radius-15 bg calsans-font" style="height: 100%">
      <q-scroll-area class="full-height full-width">
        <q-editor
        v-model="note"
        min-height="9rem"
        class="full-width"
        dense
        content-class="bg-second-transparent user-font"
        toolbar-text-color="user-font"
        toolbar-toggle-color="accent"
        toolbar-outline
        :toolbar="[
          ['bold', 'italic', 'strike', 'underline'],
          ['unordered', 'ordered'],
        ]"
      /></q-scroll-area>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { loadNote, saveNote } from '../service/firebase';
import { useAuthStore } from '../stores/auth';
import { debounce, isEqual } from 'lodash';
import { useFontColorStore } from 'src/stores/fontColor';
import { setCssVar } from 'quasar';

const fontStore = useFontColorStore();

const authStore = useAuthStore();

const note = ref('');

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadNote(newUid)
        .then((data) => {
          note.value = data ? data : '';
        })
        .catch((err) => {
          console.error(err);
          note.value = '';
        });
    }
  },
  { immediate: true },
);

let previous: string | null = null;

watch(
  note,
  (newVal) => {
    if (!newVal) return;
    if (!isEqual(previous, newVal)) {
      debouncedSave(newVal);
      previous = newVal;
    }
  },
  { deep: true },
);

const debouncedSave = debounce((newData: string) => {
  saveNote(authStore.uid, newData).catch((err) => console.error(err));
}, 1000);

watch(
  () => fontStore.fontColor,
  (newVal) => {
    setCssVar('accent', invertRgb(newVal));
  },
);

function invertRgb(color: string): string {
  const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
  const match = color.match(regex);
  if (match) {
    const r = 255 - parseInt(match[1] || '0');
    const g = 255 - parseInt(match[2] || '0');
    const b = 255 - parseInt(match[3] || '0');
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } else {
    throw new Error('Invalid RGB color format');
  }
}
</script>

<style scoped>
::v-deep(.q-editor) {
  background-color: transparent;
  border: none;

}

::v-deep(.q-editor__content) {
  border-radius: 15px;
}

::v-deep(.q-editor__toolbar) {
  border-bottom: none;
}


</style>
