import { useLoadingStore } from "~/store/loading"

export default defineNuxtPlugin((nuxtApp) => {
  const loadingStore = useLoadingStore()

  // Show loading screen when a page transition starts
  nuxtApp.hook('page:start', () => {
    console.log("page:start")
    loadingStore.showLoading()
  })

  // Handle route errors to ensure loading screen hides
  nuxtApp.hook('app:error', async () => {
    loadingStore.hideLoading()
  })

  // Ensure loading screen shows on initial client-side load
  nuxtApp.hook('app:created', () => {
    if (process.client) {
      loadingStore.showLoading()
      // Delay hiding slightly to ensure initial render is smooth
      setTimeout(() => {
        loadingStore.hideLoading()
      }, 100)
    }
  })
})