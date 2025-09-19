<template>
    <div class="container mx-auto p-6 max-w-4xl">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Quiz</h1>

        <!-- Loading State -->
        <div v-if="loadingStore.isLoading" class="flex justify-center">
            <div class="animate-spin h-8 w-8 text-indigo-600">Loading...</div>
        </div>

        <!-- Quiz Form -->
        <div
            v-else-if="quizModel"
            class="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
            <!-- Quiz Details -->
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700"
                        >Title</label
                    >
                    <Input
                        v-model="quizModel.title"
                        class="mt-1"
                        placeholder="Enter quiz title"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700"
                        >Description</label
                    >
                    <Textarea
                        v-model="quizModel.description"
                        class="mt-1"
                        placeholder="Enter quiz description"
                    />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700"
                            >Start Time</label
                        >
                        <Input
                            v-model="startTimeInput"
                            type="datetime-local"
                            class="mt-1"
                            @input="updateStartTime"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700"
                            >End Time</label
                        >
                        <Input
                            v-model="endTimeInput"
                            type="datetime-local"
                            class="mt-1"
                            @input="updateEndTime"
                        />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700"
                        >Assign Classes</label
                    >
                    <Select v-model="quizModel.classes" multiple class="mt-1">
                        <option
                            v-for="classItem in availableClasses"
                            :key="classItem.classId"
                            :value="classItem"
                        >
                            {{ classItem.name }}
                        </option>
                    </Select>
                </div>
            </div>

            <!-- Questions Section -->
            <div class="mt-8">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">
                        Questions
                    </h2>
                    <Button
                        @click="openQuestionModal(null)"
                        variant="outline"
                        class="flex items-center gap-2"
                    >
                        <Plus class="w-4 h-4" /> Add Question
                    </Button>
                </div>
                <div
                    v-if="quizModel.questions.length === 0"
                    class="text-gray-500 text-sm"
                >
                    No questions added yet.
                </div>
                <div v-else class="space-y-4">
                    <div
                        v-for="(question, index) in quizModel.questions"
                        :key="question.questionId"
                        class="p-4 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center"
                    >
                        <div>
                            <p class="text-sm font-medium text-gray-800">
                                {{ index + 1 }}. {{ question.text }}
                            </p>
                            <p class="text-xs text-gray-600">
                                Options: {{ question.options.join(", ") }}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <Button
                                variant="ghost"
                                @click="openQuestionModal(index)"
                            >
                                <Edit class="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                @click="deleteQuestion(index)"
                            >
                                <Trash class="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Save Button -->
            <div class="mt-6 flex justify-end gap-4">
                <Button variant="outline" @click="navigateBack">Cancel</Button>
                <Button
                    @click="saveQuiz"
                    :disabled="saving"
                    class="flex items-center gap-2"
                >
                    <span v-if="saving">Saving...</span>
                    <span v-else>Save Quiz</span>
                </Button>
            </div>
        </div>

        <!-- Question Modal -->
        <Dialog
            :open="isQuestionModalOpen"
            @update:open="isQuestionModalOpen = $event"
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{{
                        editingQuestionIndex !== null
                            ? "Edit Question"
                            : "Add Question"
                    }}</DialogTitle>
                </DialogHeader>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700"
                            >Question Text</label
                        >
                        <Input
                            v-model="currentQuestion.text"
                            class="mt-1"
                            placeholder="Enter question text"
                        />
                    </div>
                    <div
                        v-for="(option, index) in currentQuestion.options"
                        :key="index"
                        class="flex items-center gap-2"
                    >
                        <Input
                            v-model="currentQuestion.options[index]"
                            placeholder="{`Option"
                            ${index
                            +
                            1}`}
                        />
                        <Button
                            variant="ghost"
                            @click="removeOption(index)"
                            :disabled="currentQuestion.options.length <= 2"
                        >
                            <Trash class="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                    <Button variant="outline" @click="addOption" class="w-full"
                        >Add Option</Button
                    >
                    <div>
                        <label class="block text-sm font-medium text-gray-700"
                            >Correct Answer</label
                        >
                        <Select
                            v-model="currentQuestion.correctAnswer"
                            class="mt-1"
                        >
                            <option
                                v-for="(
                                    option, index
                                ) in currentQuestion.options"
                                :key="index"
                                :value="index"
                            >
                                {{ option || `Option ${index + 1}` }}
                            </option>
                        </Select>
                    </div>
                </div>
                <div class="mt-4 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        @click="isQuestionModalOpen = false"
                        >Cancel</Button
                    >
                    <Button @click="saveQuestion">Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoadingStore } from "~/store/loading";
import { useSchoolStore } from "~/store/school";
import { QuestionDto, QuizDto } from "~/model/quiz";
import {
    Input,
    Textarea,
    Select,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui";
import { Plus, Edit, Trash } from "lucide-vue-next";
import type { ClassDto } from "~/model/class";

const loadingStore = useLoadingStore();
const schoolStore = useSchoolStore();
const route = useRoute();
const router = useRouter();

const quizModel = ref<QuizDto>();
const availableClasses = ref<ClassDto[]>([]);
const isQuestionModalOpen = ref(false);
const currentQuestion = ref<QuestionDto>(new QuestionDto({}));
const editingQuestionIndex = ref<number | null>(null);
const saving = ref(false);

const startTimeInput = computed({
    get: () => quizModel.value?.startTime.toISOString().slice(0, 16),
    set: (value: string) =>
        quizModel.value && (quizModel.value.startTime = new Date(value)),
});
const endTimeInput = computed({
    get: () => quizModel.value?.endTime.toISOString().slice(0, 16),
    set: (value: string) =>
        quizModel.value && (quizModel.value.endTime = new Date(value)),
});
async function fetchClassById() {
    quizModel.value = await schoolStore.fetchQuizById(
        route.params.quizId.toString()
    );
}
onMounted(async () => {
    Promise.all([
        await schoolStore.fetchClasses(),
        await fetchClassById(),
    ]).finally(() => loadingStore.hideLoading())
});

const openQuestionModal = (index: number | null) => {
    editingQuestionIndex.value = index;
    currentQuestion.value =
        index !== null
            ? new QuestionDto({ ...quizModel.value!.questions[index] })
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

const saveQuestion = () => {
    if (!quizModel.value) return;
    if (editingQuestionIndex.value !== null) {
        quizModel.value.questions[editingQuestionIndex.value] = new QuestionDto(
            { ...currentQuestion.value }
        );
    } else {
        quizModel.value.questions.push(
            new QuestionDto({ ...currentQuestion.value })
        );
    }
    isQuestionModalOpen.value = false;
};

const deleteQuestion = (index: number) => {
    if (quizModel.value) {
        quizModel.value.questions.splice(index, 1);
    }
};

const saveQuiz = async () => {
    if (!quizModel.value) return;
    saving.value = true;
    try {
        await schoolStore.updateQuiz(quizModel.value);
        router.push("/quizzes"); // Redirect to quizzes list or dashboard
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
