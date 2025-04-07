<template>
  <q-card class="q-pa-sm bg-pink-12 flex column justify-center radius-15">
    <h6 class="q-ma-sm text-italic text-white">{{ $t('todo') }}</h6>
    <q-list dense>
      <q-item dense clickable v-ripple v-for="(task, index) in tasks" :key="index">
        <q-item-section>
          <q-checkbox
            dense
            keep-color
            color="pink-14"
            :class="{ strike: task.done }"
            v-model="task.done"
            :label="task.name"
          />
        </q-item-section>
        <q-item-section side>
          <q-btn icon="delete" size="sm" flat round color="negative" @click="removeTask(index)" />
        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-ma-md flex column justify-center">
      <q-input
        v-model="newTaskName"
        :label="$t('new_task')"
        dense
        class="q-mt-sm q-mb-sm"
        standout="bg-pink-14 text-pink-12"
        @keyup.enter="addTask"
      />
      <q-btn :label="$t('add')" @click="addTask" color="pink-14" class="q-mt-sm" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Task = {
  name: string;
  done: boolean;
};

const newTaskName = ref('');
const tasks = ref<Task[]>([]);

const addTask = () => {
  if (newTaskName.value.trim() === '') return;
  tasks.value.push({
    name: newTaskName.value.trim(),
    done: false,
  });
  newTaskName.value = '';
};

// todo: save in account
const removeTask = (index: number) => {
  tasks.value.splice(index, 1);
};
</script>

<style scoped>
::v-deep(.q-checkbox--dense) {
  color: #841e4c;
}

.strike {
  text-decoration: line-through;
}
</style>
