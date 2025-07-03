<script setup lang="ts">
import { useNotification } from '~/composables/use-notification'
import { useAuthStore } from '~/store/auth';

const { addNotification } = useNotification()
const authStore = useAuthStore();

definePageMeta({
  layout: 'before-auth'
})

function onSubmit(e: Event) {
  e.preventDefault()
  
}
</script>

<template>
  <ClientOnly>
    <div class="min-h-[calc(100vh-50px)] flex flex-col">

      <!-- Notifications -->
      <AppNotificationStack />

      <!-- Login Form -->
      <main class="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <form @submit="onSubmit" class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 class="text-2xl font-bold text-center mb-6">Sign in to your account</h2>

          <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring"
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="********"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring"
            />
          </div>

          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center text-sm">
              <input type="checkbox" class="mr-2 leading-tight" />
              <span class="text-gray-600">Remember me</span>
            </label>
            <NuxtLink to="/forgot-password" class="text-sm text-blue-500 hover:underline">
              Forgot password?
            </NuxtLink>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
          >
            Sign In
          </button>

        </form>
      </main>
    </div>
  </ClientOnly>
</template>
