import { defineStore } from 'pinia';

export const useSchoolStore = defineStore('schools', {
  state: () => ({
    schools: [] as Array<{ id: string; name: string }>,
  }),
  actions: {
    async fetchSchools() {
      this.schools = await $fetch('/api/schools');
    },
  },
});
