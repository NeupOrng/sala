import { defineStore } from 'pinia'

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    username: '',
    role: ''
  }),
  actions: {

  }
})
