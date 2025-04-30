<template>
  <q-card class="q-pa-sm flex column justify-between radius-15 bg" style="height: 100%">
    <q-editor
      v-model="note"
      class="q-ma-sm"
      min-height="9rem"
      dense
      content-class="bg-second-transparent user-font"
      toolbar-text-color="user-font"
      toolbar-toggle-color="blue-5"
      toolbar-outline
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['unordered', 'ordered'],
      ]"
    />
  </q-card>
</template>

<script setup lang="ts">
import {  ref, watch, computed } from 'vue';
import { loadNote, saveNote } from '../service/firebase';
import { useAuthStore } from '../stores/auth';
import { debounce, isEqual } from 'lodash';
import { useFontColorStore } from 'src/stores/fontColor';

const fontStore = useFontColorStore()

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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const color = computed(() =>{
  return fontStore.fontColor
} )

</script>

<style scoped>


::v-deep(.q-editor) {
  background-color: transparent;
}

::v-deep(.q-editor__content) {
  border-radius: 15px;
}

::v-deep(.q-editor__toolbar) {
  border-bottom: none;
}

</style>
