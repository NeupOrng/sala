<script setup lang="ts">
import { useNotification } from '~/composables/use-notification'

const { addNotification } = useNotification()
</script>

<template>
  <ClientOnly>
    <div class="min-h-screen flex flex-col">

      <!-- Notification stack -->
      <AppNotificationStack />

      <!-- Main public section -->
      <main class="w-full relative">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="w-full mt-auto border-t">
        <div class="container mx-auto px-6 py-4 text-center text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }} MyApp. All rights reserved.
        </div>
      </footer>
    </div>
  </ClientOnly>
</template>
