<template>
  <q-card dense class="q-pa-md flex column justify-center radius-15 bg">
    <h6 class="q-ma-sm text-italic text-white">{{ $t('user_note') }}</h6>
    <q-editor v-model="note" min-height="5rem"
    :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['unordered', 'ordered'],
      ]" />
  </q-card>
</template>

<script setup lang="ts">
import {ref, watch } from 'vue'
import { loadNote, saveNote } from '../service/firebase';
import { useAuthStore } from '../stores/auth';
import { debounce, isEqual } from 'lodash';

const authStore = useAuthStore();

const note = ref('')

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadNote(newUid)
        .then((data) => {
          console.log(typeof data)
          note.value = data ? data : '';
        })
        .catch((err) => {
          console.error(err);
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

</script>
