<template>
  <q-page class="flex calsans-font flex-center text-white default-bg">
    <div class="background-grid">
      <!-- Placeholder cards -->
      <q-card
        v-for="(position, index) in cardPositions"
        :key="index"
        class="placeholder-card"
        :class="index % 2 === 0 ? 'bg' : 'bg-black'"
        :style="{ top: `${position.top}%`, left: `${position.left}%`, position: 'absolute' }"
      >
      </q-card>
    </div>

    <!-- Main login card -->
    <q-card class="q-pa-md bg radius-15 login-card">
      <div class="icon-wrapper">
        <q-icon name="person" size="50px" class="icon-center" />
      </div>
      <p class="text-center  text-h3 ">Welcome to Lerni.app</p>
      <p class="text-center  text-h6">Your daily study dashboard</p>
      <div class="icon-wrapper">
        <q-icon name="dashboard" size="10rem" color="blur" class="icon-lightbulb q-mt-sm" />
      </div>
      <p class="text-center  text-description">Please log in to continue.</p>
      <div class="flex row justify-center">
        <q-btn outline size="lg" class="q-ma-md" color="white" @click="login">Login via Google</q-btn>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { loginWithGoogle } from '../service/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

async function login() {
  const success = await loginWithGoogle()
  if (success) {
    await router.push('/')
  }
}

function generateUniquePositions(count: number, cardSize: number) {
  const positions: { top: number; left: number }[] = []

  for (let i = 0; i < count; i++) {
    let position
    let isOverlapping

    do {
      isOverlapping = false
      const top = Math.random() * (100 - cardSize)
      const left = Math.random() * (100 - cardSize)

      position = { top, left }

      for (const existing of positions) {
        const distance = Math.sqrt(
          Math.pow(existing.top - position.top, 2) +
          Math.pow(existing.left - position.left, 2)
        )
        if (distance < cardSize) {
          isOverlapping = true
          break
        }
      }
    } while (isOverlapping)

    positions.push(position)
  }

  return positions
}

const cardPositions = generateUniquePositions(20, 10)
</script>

<style scoped>
.background-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.placeholder-card {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-card {
  position: relative;
  z-index: 1;
  width: 400px;
  max-width: 90%;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-top: -50px;
}

.icon-center {
  background-color: #f0f0f0;
  border-radius: 50%;
  padding: 10px;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.icon-lightbulb {
  border-radius: 50%;
  padding: 10px;
  color:  rgba(255, 255, 255, 0.4);
}

@media (max-width: 600px) {
  .login-card {
    width: 90%;
    padding: 16px;
  }

  .icon-wrapper {
    margin-top: -50px;
  }

  .icon-center {
    padding: 8px;
  }
}

.default-bg {
  background: linear-gradient(43deg,rgba(131, 58, 180, 1) 0%,rgba(253, 29, 29, 0.5226541300113796) 50%,rgba(252, 176, 69, 1) 100%);
}

</style>
