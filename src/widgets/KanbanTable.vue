<template>
  <q-card class="q-pa-md bg radius-15" style="height: 100%">
    <div class="row q-col-gutter-md">
      <div v-for="column in columns" :key="column.id" class="col-4">
        <q-card flat class="radius-15 bg-second-transparent">
          <q-card-section class="user-font">
            <div class="text-subtitle2">{{ getTitle(column) }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <VueDraggable
              v-model="column.tasks"
              group="tasks"
              item-key="id"
              class="q-mb-md draggable"
            >
              <q-card flat v-for="task in column.tasks" :key="task.id" class="q-pa-sm q-ma-sm radius-15 bg-more user-font">
                <div>{{ task.title }}</div>
              </q-card>
            </VueDraggable>

            <q-input
              v-model="newTaskTitles[column.id]"
              :label="$t('new_task_placeholder')"
              class="q-mb-sm q-mt-sm"
              dense
              standout="transparent"
              @keyup.enter="addTask(column.id, newTaskTitles[column.id]!)"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { useI18n } from 'vue-i18n';
import { saveKanbanTasks, loadKanban } from '../service/firebase';  // Importujemy metodę
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
      loadKanban(newUid).then((data) => {
        columns.value.forEach((column) => {
          column.tasks = data ? data[column.id] ?? [] : [];
        });
      }).catch((err) => {
        console.error(err);
      });
    }
  },
  { immediate: true }
);

function addTask(columnId: string, task: string) {
  const column = columns.value.find((c) => c.id === columnId);
  if (!column) return;

  const newId = Date.now().toString();
  column.tasks.push({
    id: newId,
    title: task,
  });
  newTaskTitles.value[columnId] = '';
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
  { deep: true }
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
</style>
