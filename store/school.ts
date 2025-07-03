import { defineStore } from "pinia";
import type { ISchool } from "./model/school";

export const useSchoolStore = defineStore("schoolStore", {
  state: () => ({
    school: {
      id: "",
      name: "",
      shortName: "",
    } as ISchool,
  }),
  actions: {
    async fetchSchools() {
      this.school = await $fetch("/api/schools") as unknown as ISchool;
    },

    async initialize() {
        const { addNotification } = useNotification();
      this.school = {
        id: "5b8ad78c-3a3c-402b-9739-237d41b7ec7a",
        name: "DataU Academy",
        shortName: "DAU",
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
