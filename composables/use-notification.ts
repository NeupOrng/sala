// composables/NotificationStore.ts
import { ref } from 'vue'

interface Notification {
  id: number
  title: string
  description: string
  type?: 'default' | 'destructive'
  duration?: number
}

const notifications = ref<Notification[]>([])

let id = 0

export function useNotification() {
  function addNotification(notification: Omit<Notification, 'id'>) {
    const newNotification = { ...notification, id: ++id }
    notifications.value.push(newNotification)

    setTimeout(() => {
      removeNotification(newNotification.id)
    }, notification.duration ?? 3000)
  }

  function removeNotification(id: number) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return { notifications, addNotification, removeNotification }
}
