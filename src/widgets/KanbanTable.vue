<template>
  <q-card class="q-pa-md bg radius-15 full-height column">
    <div class="row q-col-gutter-md full-height">
      <div v-for="column in columns" :key="column.id" class="col">
        <q-card flat bordered class="radius-15 bg-second-transparent full-height column">
          <q-card-section class="user-font calsans-font q-pb-none">
            <span class="text-subtitle2">{{ getTitle(column) }}</span>
          </q-card-section>

          <div class="column q-pa-sm" style="flex: 1 1 auto; min-height: 0">
            <q-scroll-area style="flex: 1 1 auto; min-height: 0">
              <VueDraggable
                v-model="column.tasks"
                group="tasks"
                item-key="id"
                class="q-mb-md draggable"
                :empty-insert-threshold="80"
              >
                <q-card
                  flat
                  v-for="task in column.tasks"
                  :key="task.id"
                  class="q-pa-sm q-ma-sm radius-15 bg-more user-font calsans-font row items-center"
                >
                  <div class="q-ml-sm">{{ task.title }}</div>
                  <q-space/>
                  <q-btn icon="delete" size="sm" flat round color="user-font" @click="deleteTask(column.id, task.id)"/>
                </q-card>
              </VueDraggable>
            </q-scroll-area>

            <div class="q-my-sm">
              <q-input
                v-model="newTaskTitles[column.id]"
                :label="$t('new_task_placeholder')"
                class="calsans-font"
                dense
                standout="transparent"
                @keyup.enter="addTask(column.id, newTaskTitles[column.id]!)"
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { useI18n } from 'vue-i18n';
import { saveKanbanTasks, loadKanban } from '../service/firebase'; // Importujemy metodę
import { useAuthStore } from '../stores/auth';
import { debounce } from 'lodash';
import type { Column } from 'src/types';
const authStore = useAuthStore();

const { t } = useI18n();

const newTaskTitles = ref<Record<string, string>>({});

const columns = ref<Column[]>([
  { id: 'todo', tasks: [] },
  { id: 'inprogress', tasks: [] },
  { id: 'done', tasks: [] },
]);

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadKanban(newUid)
        .then((data) => {
          columns.value.forEach((column) => {
            column.tasks = data ? (data[column.id] ?? []) : [];
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  { immediate: true },
);

function addTask(columnId: string, task: string) {
  if (task.trim() === '') return;
  const column = columns.value.find((c) => c.id === columnId);
  if (!column) return;

  const newId = Date.now().toString();
  column.tasks.push({
    id: newId,
    title: task,
  });
  newTaskTitles.value[columnId] = '';
}

const deleteTask = (columnId: string, taskId : string) => {
  const column = columns.value.find((c) => c.id === columnId);
  if (!column) return;
  column.tasks = column.tasks.filter(task => task.id !== taskId);
}

const getTitle = (column: Column) => {
  switch (column.id) {
    case 'todo':
      return t('todo');
    case 'inprogress':
      return t('inprogress');
    case 'done':
      return t('done');
    default:
      return '';
  }
};

let previousTasksState = JSON.stringify(columns.value);

const debouncedSave = debounce((newData: Column[]) => {
  saveKanbanTasks(authStore.uid, newData).catch((err) => console.error(err));
}, 1000);

watch(
  columns,
  (newVal) => {
    const newState = JSON.stringify(newVal);
    if (newState !== previousTasksState) {
      debouncedSave(newVal);
      previousTasksState = newState;
    }
  },
  { deep: true },
);




</script>

<style scoped>
::v-deep(.q-field__label) {
  color: var(--user-font-color);
}
::v-deep(.q-field__native) {
  color: var(--user-font-color);
}
::v-deep(.q-field--standout.q-field--highlighted .q-field__native) {
  color: var(--user-font-color);
}
/*
 .draggable {
  min-height: 100% !important;
}  */

</style>
