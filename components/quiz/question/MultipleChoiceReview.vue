<template>
    <div class="my-4 p-6 bg-white rounded-lg shadow-md">
        <!-- Question Text -->
        <div class="flex items-start justify-between">
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-700">
                    Question Text
                </h3>
                <p class="mt-2 text-gray-900">
                    {{ question.text || "No question text provided" }}
                </p>
            </div>
            <Button @click="emit('delete')" variant="destructive"
                >Remove</Button
            >
        </div>

        <!-- Options -->
        <div class="mb-6">
            <h3
                class="text-lg font-semibold text-gray-700 flex justify-between items-center"
            >
                Options
            </h3>
            <div class="mt-2">
                <div
                    v-for="(option, index) in question.options"
                    :key="index"
                    class="flex items-center gap-2 mb-2 p-2 rounded-md"
                    :class="{
                        'bg-green-100': index === question.correctAnswer,
                        'bg-gray-50': index !== question.correctAnswer,
                    }"
                >
                    <span class="font-medium text-gray-700"
                        >[{{ index + 1 }}]</span
                    >
                    <span class="flex-1">{{ option || "No option text" }}</span>
                    <span
                        v-if="index === question.correctAnswer"
                        class="text-green-600 font-semibold"
                    >
                        (Correct Answer)
                    </span>
                </div>
                <p
                    v-if="!question.options || question.options.length === 0"
                    class="text-gray-500"
                >
                    No options provided
                </p>
            </div>
        </div>

        <!-- Correct Answer -->
        <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-700">Correct Answer</h3>
            <p class="mt-2 text-gray-900">
                {{
                    question.options[question.correctAnswer] ??
                    "No correct answer selected"
                }}
            </p>
        </div>

        <!-- Footer with Edit Action -->
        <footer class="flex justify-end items-center gap-2">
            <Button
                type="button"
                variant="default"
                class="px-4 py-2"
                @click="emit('edit', question)"
            >
                Edit Question
            </Button>
        </footer>
    </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button"; // Assuming Shadcn/Vue components are used

defineProps<{
    question: MultipleChoiceQuestionModelDto;
}>();

const emit = defineEmits<{
    (e: "edit", question: MultipleChoiceQuestionModelDto): void;
    (e: "delete"): void;
}>();
</script>

<style scoped>
/* Tailwind CSS is assumed to be available globally, so no additional styles are needed */
</style>
