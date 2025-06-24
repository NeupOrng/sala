import { defineStore } from "pinia";
import type { ISchool } from "./model/school";

export const useSchoolStore = defineStore("schools", {
  state: () => ({
    school: {
      id: "",
      name: "",
    } as ISchool,
  }),
  actions: {
    async fetchSchools() {
      this.school = await $fetch("/api/schools");
    },

    async initialize() {
        const { addNotification } = useNotification();
      this.school = {
        id: "5b8ad78c-3a3c-402b-9739-237d41b7ec7a",
        name: "DataU Academy",
      };
    //   addNotification({
    //     title: 'Noted!',
    //     description: 'Fetch School',
    //     type: 'default',
    //     duration: 4000,
    //   })
    },
  },
});
