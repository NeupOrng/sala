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
        genderCount: [] as IGenderCount[],
    }),
    actions: {
        async fetchSchools() {
            const { $apiFetch } = useNuxtApp();
            this.school = (await $apiFetch("/api/schools", {
                credentials: "include",
            })) as unknown as ISchool;
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
            await this.fetchOnLoad();
        },
    },
});
