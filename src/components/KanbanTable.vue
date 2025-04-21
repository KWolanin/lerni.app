<template>
  <q-card class="q-pa-md bg radius-15" style="height: 100%">
    <div class="row q-col-gutter-md">
      <div
        v-for="column in columns"
        :key="column.id"
        class="col-12 col-sm-6 col-md-3"
      >
        <q-card flat bordered class="bg radius-15">
          <q-card-section class="text-white">
            <div class="text-h6">{{ column.title }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div
              v-for="task in column.tasks"
              :key="task.id"
              class="q-mb-sm"
            >
              <q-card class="q-pa-sm bg-grey-3">
                <div>{{ task.title }}</div>
              </q-card>
            </div>

            <q-btn
              flat
              color="primary"
              icon="add"
              label="Dodaj zadanie"
              @click="addTask(column.id)"
              class="q-mt-sm"
              size="sm"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Task {
  id: string
  title: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const columns = ref<Column[]>([
  {
    id: 'todo',
    title: 'Do zrobienia',
    tasks: [
      { id: '1', title: 'Zadanie A' },
      { id: '2', title: 'Zadanie B' }
    ]
  },
  {
    id: 'inprogress',
    title: 'W trakcie',
    tasks: [
      { id: '3', title: 'Zadanie C' }
    ]
  },
  {
    id: 'done',
    title: 'Gotowe',
    tasks: [
      { id: '4', title: 'Zadanie D' }
    ]
  }
])

function addTask(columnId: string) {
  const column = columns.value.find(c => c.id === columnId)
  if (!column) return

  const newId = Date.now().toString()
  column.tasks.push({
    id: newId,
    title: 'Nowe zadanie'
  })
}
</script>
