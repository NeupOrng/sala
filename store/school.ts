import { defineStore } from "pinia";
import type { ISchool } from "./model/school";
import type { IGenderCount } from "~/models/gender-count";

export const useSchoolStore = defineStore("schoolStore", {
    state: () => ({
        school: {
            id: "",
            name: "",
            shortName: "",
        } as ISchool,
        genderCount: [] as IGenderCount[]
    }),
    actions: {
        async fetchSchools() {
            this.school = (await $fetch("/api/schools")) as unknown as ISchool;
        },

        async fetchOnLoad() {
            const { $apiFetch } = useNuxtApp();
            const onloadResponse = await $apiFetch("/api/protected/on-load", {
                credentials: "include",
            })
            if(onloadResponse) {
                this.genderCount = onloadResponse.data.genderCount
            }
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
