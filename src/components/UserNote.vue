<template>
  <q-card  class="q-pa-sm flex column justify-between radius-15 bg" style="height: 100%">
    <h6 class="q-ma-sm text-italic text-white">{{ $t('user_note') }}</h6>
    <q-editor v-model="note" min-height="5.7rem" class="q-mb-sm q-mr-sm q-ml-sm q-mt-sm"
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

</script>
