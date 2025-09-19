<script lang="ts" setup>
import { useLoadingStore } from "~/store/loading";
import { useSchoolStore } from "~/store/school";

const schoolStore = useSchoolStore();
const loadingStore = useLoadingStore();
onMounted(async () => {
    await schoolStore.fetchQuizzes().finally(() => loadingStore.hideLoading());
});
</script>
<template>
    <ClientOnly>
        <div class="py-2 px-4 flex justify-between items-center">
            <p class="font-bold text-xl">Quiz</p>
        </div>
        <div class="p-2 flex flex-wrap">
            <QuizDisplayItem
                v-for="quiz in schoolStore.quizzes"
                :key="quiz.quizId"
                :quizItem="quiz"
            />
        </div>
    </ClientOnly>
</template>

<style></style>
