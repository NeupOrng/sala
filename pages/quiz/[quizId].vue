<template>
    <div class="container mx-auto p-6 max-w-4xl">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Quiz</h1>

        <!-- Quiz Form -->
        <QuizForm
            v-if="quizModel"
            :quizDto="quizModel"
            :availableClasses="schoolStore.classes"
            :onOpenQuestionModal="openQuestionModal"
            :onDeleteQuestion="deleteQuestion"
            :onUpdateQuiz="updateQuiz"
            :saving="saving"
            :onCancel="navigateBack"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Plus, Edit, Trash } from "lucide-vue-next";

const loadingStore = useLoadingStore();
const schoolStore = useSchoolStore();
const route = useRoute();
const router = useRouter();

const quizModel = ref<QuizDto>();
const isQuestionModalOpen = ref(false);
const currentQuestion = ref<QuestionDto>(new QuestionDto({}));
const editingQuestionIndex = ref<number | null>(null);
const saving = ref(false);

async function fetchClassById() {
    quizModel.value = await schoolStore.fetchQuizById(
        route.params.quizId.toString()
    );
}
onMounted(async () => {
    Promise.all([
        await schoolStore.fetchClasses(),
        await fetchClassById(),
    ]).finally(() => loadingStore.hideLoading());
});

const openQuestionModal = (index: number | null) => {
    editingQuestionIndex.value = index;
    currentQuestion.value =
        index !== null
            ? new QuestionDto({
                  ...quizModel.value!.questions[index],
              })
            : new QuestionDto({ options: ["", "", "", ""] });
    isQuestionModalOpen.value = true;
};

const addOption = () => {
    currentQuestion.value.options.push("");
};

const removeOption = (index: number) => {
    if (currentQuestion.value.options.length > 2) {
        currentQuestion.value.options.splice(index, 1);
        if (
            currentQuestion.value.correctAnswer >=
            currentQuestion.value.options.length
        ) {
            currentQuestion.value.correctAnswer =
                currentQuestion.value.options.length - 1;
        }
    }
};

const deleteQuestion = (index: number) => {
    if (quizModel.value) {
        quizModel.value.questions.splice(index, 1);
    }
};

const updateQuiz = async (updateQuiz: UpdateQuizRequestDto) => {
    if (!quizModel.value) return;
    saving.value = true;
    try {
        await schoolStore.updateQuiz(updateQuiz);
        router.push("/quiz"); // Redirect to quizzes list or dashboard
    } catch (error) {
        console.error("Failed to save quiz:", error);
    } finally {
        saving.value = false;
    }
};

const navigateBack = () => {
    router.push("/quiz");
};
</script>
