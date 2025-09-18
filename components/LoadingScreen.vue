<template>
    <Transition
        mode="out-in"
        enter-active-class="transition-all duration-500 ease-in-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-500 ease-in-out"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
    >
        <div
            v-if="isLoading"
            class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
            <div
                class="flex flex-col items-center gap-4 transform transition-transform duration-300"
            >
                <div class="relative">
                    <div
                        class="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"
                    ></div>
                </div>
                <p class="text-lg font-medium text-foreground">Loading...</p>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useLoadingStore } from "~/store/loading";

const loadingStore = useLoadingStore();
const { isLoading } = storeToRefs(loadingStore);
</script>
