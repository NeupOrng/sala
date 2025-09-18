<template>
  <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div class="flex flex-col items-center gap-4">
      <div class="relative">
        <div class="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
      <p class="text-lg font-medium text-foreground">Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '~/store/loading'

const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)
</script>