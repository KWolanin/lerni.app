<template>
  <q-card class="q-pa-sm bg flex column fit justify-between radius-15">

    <!-- HEADER -->
    <div class="flex row items-center q-mb-sm">
      <h6 class="q-ma-sm text-italic user-font">{{ $t('todo') }}</h6>
      <q-space />
      <q-btn
        size="sm"
        icon="delete"
        color="user-font"
        flat
        class="q-ml-sm"
        @click="clear"
      >
        <q-tooltip class="bg-blur text-weight-bold" anchor="center left" self="center right">
          {{ $t('clear_list') }}
        </q-tooltip>
      </q-btn>
      <q-btn
        size="sm"
        icon="done"
        color="user-font"
        flat
        class="q-ml-sm"
        @click="switchMarks"
      >
        <q-tooltip class="bg-blur text-weight-bold" anchor="center left" self="center right">
          {{ $t('mark_as') }}
        </q-tooltip>
      </q-btn>
    </div>

    <!-- TASK LIST -->
    <q-scroll-area class="q-mb-md" style="flex: 1 1 auto; min-height: 100px;">
      <q-list dense v-if="tasks && Object.keys(tasks).length">
        <q-item
          dense
          clickable
          v-ripple
          v-for="([label, checked], index) in Object.entries(tasks)"
          :key="index"
        >
          <q-item-section>
            <q-checkbox
              dense
              keep-color
              color="user-font"
              :class="{ strike: checked }"
              v-model="tasks[label]"
              :label="label"
              checked-icon="check_circle"
              unchecked-icon="radio_button_unchecked"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" size="sm" flat round color="user-font" @click="removeTask(label)" />
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else class="text-caption text-grey-3 flex items-center justify-center" style="height: 100px">
        {{ $t('nothing_here') }}
      </div>
    </q-scroll-area>

    <!-- ADD NEW TASK -->
    <div class="q-mt-sm column full-width">
      <q-input
        v-model="newTaskName"
        :label="$t('new_task')"
        dense
        standout="transparent"
        class="q-mb-sm user-font"
        @keyup.enter="addTask"
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
  color: var(--user-font-color);}


::v-deep(.q-field__label) {
  color: var(--user-font-color);
}
::v-deep(.q-field__native) {
  color: var(--user-font-color);
}

.strike {
  text-decoration: line-through;
}

.fit {
  width: 100%;
  height: 100%;
}


</style>
