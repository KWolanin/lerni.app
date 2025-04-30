<template>
  <q-card class="q-pa-md bg radius-15" style="height: 100%">
    <div class="row q-col-gutter-md">
      <div v-for="column in columns" :key="column.id" class="col-4">
        <q-card flat class="radius-15 bg-second-transparent">
          <q-card-section class="user-font">
            <div class="text-h6">{{ getTitle(column) }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <VueDraggable
              v-model="column.tasks"
              group="tasks"
              @end="onDragEnd"
              item-key="id"
              class="q-mb-sm draggable"
            >
              <q-card flat v-for="task in column.tasks" :key="task.id" class="q-pa-sm q-ma-sm bg">
                <div>{{ task.title }}</div>
              </q-card>
            </VueDraggable>

            <q-input
              v-model="newTaskTitles[column.id]"
              :label="$t('new_task_placeholder')"
              class="q-mb-sm input"
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
import { onMounted, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Task {
  id: string;
  title: string;
}

interface Column {
  id: string;
  tasks: Task[];
}

const newTaskTitles = ref<Record<string, string>>({});

onMounted(() => {
  columns.value.forEach((column) => {
    newTaskTitles.value[column.id] = '';
  });
});

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

const columns = ref<Column[]>([
  {
    id: 'todo',
    tasks: [],
  },
  {
    id: 'inprogress',
    tasks: [],
  },
  {
    id: 'done',
    tasks: [],
  },
]);

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

function onDragEnd(event: Event) {
  console.log(event);
}
</script>

<style scoped>
::v-deep(.q-field__label) {
  color: var(--user-font-color);
}
::v-deep(.q-field__native) {
  color: var(--user-font-color);
}
</style>
