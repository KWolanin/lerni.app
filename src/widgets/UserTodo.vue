<template>
  <q-card class="q-pa-sm bg flex column fit justify-between radius-15 calsans-font">

    <!-- HEADER -->
    <div class="flex row items-center q-mb-sm">
      <p class="q-ma-sm user-font text-subtitle2">{{ $t('todo') }}</p>
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
        icon="check_circle"
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
      <q-scroll-area class="q-mb-md" style="flex: 1 1 auto; min-height: 100px; position: relative;">
      <q-list dense v-if="sortedTask && sortedTask.length">
        <q-item
          dense
          clickable
          v-ripple
          v-for="(task, index) in sortedTask"
          :key="index"
        >
          <q-item-section>
            <q-checkbox
              dense
              keep-color
              color="user-font"
              :class="{ strike: task.checked }"
              v-model="task.checked"
              :label="task.label"
              checked-icon="check_circle"
              unchecked-icon="radio_button_unchecked"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" size="sm" flat round color="user-font" @click="removeTask(task.date)" />
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else
      class="text-caption user-font flex items-center justify-center absolute-top-left full-height full-width">
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
import { computed, ref, watch } from 'vue';
import { loadTodo, saveTodo } from '../service/firebase';
import { useAuthStore } from '../stores/auth';
import { debounce, isEqual } from 'lodash';
import type { TodoTask } from 'src/types';

const authStore = useAuthStore();

const tasks = ref<TodoTask[] | null>(null);

const newTaskName = ref('');

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadTodo(newUid)
        .then((data) => {
          if (!tasks.value) {
            tasks.value = [];
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

let previous: TodoTask[] | null = null;

watch(
  tasks,
  (newVal) => {
    if (!newVal) return;
    if (!isEqual(previous, newVal)) {
      debouncedSave(newVal)
      previous = JSON.parse(JSON.stringify(newVal))
    }
  },
  { deep: true }
)


const debouncedSave = debounce((newData: TodoTask[]) => {
  saveTodo(authStore.uid, newData).catch((err) => console.error(err));
}, 1000);

const addTask = () => {
  if (newTaskName.value.trim() === '') return;
  if (!tasks.value) {
    tasks.value = [];
  }
  const newTask: TodoTask = {
    date: new Date().toISOString(),
    label: newTaskName.value,
    checked: false,
  };
  tasks.value.push(newTask)
  newTaskName.value = '';
};

const removeTask = (date: string) => {
  tasks.value = tasks.value?.filter(task => task.date !== date) || null;
};

const clear = () => {
  tasks.value = [];
};

const switchMarks = () => {
tasks.value?.forEach(task => {
  task.checked = !task.checked;
});
};

const sortedTask = computed((): TodoTask[] => {
  if (tasks.value?.length) {
    return tasks.value.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }
  return []
})

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
::v-deep(.q-field--standout.q-field--highlighted .q-field__native) {
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
