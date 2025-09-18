import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: true,
  }),
  actions: {
    showLoading() {
      this.isLoading = true
    },
    hideLoading() {
      this.isLoading = false
    },
  },
})