<template>
  <q-card class="q-pa-sm bg flex column justify-center radius-15">
    <div class="flex row">
      <h6 class="q-ma-sm text-italic text-white">{{ $t('todo') }}</h6>
      <q-space />
      <q-btn
        size="sm"
        icon="delete"
        color="white"
        class="q-ml-sm q-pl-sm q-pr-sm q-mt-sm q-mb-sm"
        flat
        @click="clear"
      >
        <q-tooltip
          class="text-pink-14 transparent text-weight-bold"
          anchor="center left"
          self="center right"
          >{{$t('clear_list')}}</q-tooltip
        >
      </q-btn>
      <q-btn
        size="sm"
        icon="done"
        color="white"
        class="q-ml-sm q-pl-sm q-pr-sm q-mt-sm q-mb-sm"
        flat
        @click="switchMarks"
      >
        <q-tooltip
          class="text-pink-14 transparent text-weight-bold"
          anchor="top right"
          self="center right"
          >{{ $t('mark_as') }}</q-tooltip
        >
      </q-btn>
    </div>

    <q-scroll-area style="height: 30vh; max-width: 100%">
      <q-list dense v-if="tasks && Object.keys(tasks).length">
        <q-item dense clickable v-ripple v-for="([label, checked], index) in Object.entries(tasks)" :key="index">
          <q-item-section>
            <q-checkbox
              dense
              keep-color
              color="white"
              :class="{ strike: checked }"
              v-model="tasks[label]"
              :label="label"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" size="sm" flat round color="white" @click="removeTask(label)" />
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else class="text-caption text-grey-3 flex items-center justify-center" style="height: 30vh">
        {{ $t('nothing_here') }}
      </div>
    </q-scroll-area>
    <div class="q-ma-md flex column justify-center">
      <q-input
        v-model="newTaskName"
        :label="$t('new_task')"
        dense
        class="q-mt-sm q-mb-sm text-white"
        standout="transparent text-pink-12"
        @keyup.enter="addTask"
      />
      <q-btn
        :label="$t('add')"
        outline
        @click="addTask"
        color="pink-14"
        text-color="white"
        class="q-mt-sm"
      />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { loadTodo, saveTodo } from '../service/firebase';
import type { DocumentData } from 'firebase/firestore';
import { useAuthStore } from '../stores/auth';
import { debounce, isEqual } from 'lodash';


const authStore = useAuthStore();

const tasks = ref<DocumentData | null>(null);

const newTaskName = ref('');

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadTodo(newUid)
        .then((data) => {
          if (!tasks.value) {
            tasks.value = {};
          }
          tasks.value = data;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  { immediate: true },
);

let previous: Record<string, boolean> | null = null;

watch(
  tasks,
  (newVal) => {
    if (!newVal) return;
    if (!isEqual(previous, newVal)) {
      debouncedSave({ ...newVal });
      previous = { ...newVal };
    }

  },
  { deep: true },
);

const debouncedSave = debounce((newData: Record<string, boolean>) => {
  saveTodo(authStore.uid, newData).catch((err) => console.error(err));
}, 1000);

// todo: map -> object with date to be able to sort by last added
const addTask = () => {
  if (newTaskName.value.trim() === '') return;
  if (!tasks.value) {
    tasks.value = {};
  }
  tasks.value[newTaskName.value.trim()] = false
  newTaskName.value = '';
};

const removeTask = (label: string) => {
  delete tasks.value![label];
};

const clear = () => {
  tasks.value = {};
};

const switchMarks = () => {
  for (const task in tasks.value) {
  tasks.value[task] = !tasks.value[task]
}
};
</script>

<style scoped>
::v-deep(.q-checkbox--dense) {
  color: white;
}

::v-deep(.q-field__label) {
  color: white;
}

.strike {
  text-decoration: line-through;
}
</style>
