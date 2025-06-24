<script setup lang="ts">
import { useNotification } from '~/composables/use-notification'

const { addNotification } = useNotification()

</script>
<template>
  <ClientOnly>
    <div class="w-full flex min-h-screen relative">
      <AppNavigation />
      <AppNotificationStack />
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </ClientOnly>
</template>
