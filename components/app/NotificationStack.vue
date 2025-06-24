<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
    <TransitionGroup
      name="toast"
      tag="div"
    >
      <Alert
        v-for="n in notifications"
        :key="n.id"
        :variant="n.type ?? 'default'"
        class="transition-all duration-300"
      >
        <AlertTitle>{{ n.title }}</AlertTitle>
        <AlertDescription>{{ n.description }}</AlertDescription>
      </Alert>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const { notifications } = useNotification()
</script>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
</style>
