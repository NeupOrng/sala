<template>
    <form @submit.prevent="onSaveQuiz">
        <div
            v-if="quizModel"
            class="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
            <!-- Quiz Details -->
            <FormField name="title" v-slot="{ componentField }">
                <FormItem class="mb-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input
                            placeholder="Enter quiz title"
                            class="mt-1"
                            v-bind="componentField"
                            v-model="quizModel.title"
                        />
                    </FormControl>
                    <FormMessage class="text-sm text-red-500 mt-1" />
                </FormItem>
            </FormField>
            <FormField name="description" v-slot="{ componentField }">
                <FormItem class="mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Enter quiz description"
                            class="mt-1"
                            v-bind="componentField"
                            v-model="quizModel.description"
                        />
                    </FormControl>
                    <FormMessage class="text-sm text-red-500 mt-1" />
                </FormItem>
            </FormField>
            <div class="flex items-start gap-4">
                <FormField name="startTime" v-slot="{ componentField }">
                    <FormItem class="mb-4">
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                            <Input
                                type="datetime-local"
                                v-bind="componentField"
                                v-model="quizModel.startTime"
                            />
                        </FormControl>
                        <FormMessage class="text-sm text-red-500 mt-1" />
                    </FormItem>
                </FormField>
                <FormField name="endTime" v-slot="{ componentField }">
                    <FormItem class="mb-4">
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                            <Input
                                type="datetime-local"
                                v-bind="componentField"
                                v-model="quizModel.endTime"
                            />
                        </FormControl>
                        <FormMessage class="text-sm text-red-500 mt-1" />
                    </FormItem>
                </FormField>
                <FormField name="classId" v-slot="{ componentField }">
                    <FormItem class="mb-4">
                        <FormLabel>Class</FormLabel>
                        <FormControl>
                            <Select
                                class="mt-1"
                                v-bind="componentField"
                                v-model="quizModel.classId"
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder="Select a class"
                                        :value="quizModel.classId"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="classItem in availableClasses"
                                        :key="classItem.id"
                                        :value="classItem.id"
                                    >
                                        {{ classItem.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage class="text-sm text-red-500 mt-1" />
                    </FormItem>
                </FormField>
            </div>

            <!-- Questions Section -->

            <Dialog v-model:open="isQuestionModalOpen">
                <div class="flex items-center justify-between mb-2">
                    <Label>Questions</Label>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            class="mb-4"
                            @click="onOpenQuestionModal(null)"
                        >
                            Add Question
                        </Button>
                    </DialogTrigger>
                </div>
                <DialogContent class="max-w-2xl overflow-y-auto max-h-[70vh]">
                    <DialogHeader>
                        <DialogTitle>{{
                            editingQuestionIndex !== null
                                ? "Edit Question"
                                : "Add Question"
                        }}</DialogTitle>
                    </DialogHeader>
                    <main>
                        <form>
                            <!-- select type and render question component -->
                            <Select
                                v-model="currentQuestion.type"
                                class="mb-4 w-full"
                                :disabled="editingQuestionIndex !== null"
                            >
                                <SelectTrigger class="w-full mt-1">
                                    <SelectValue
                                        placeholder="Select question type"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="multiple-choice">
                                        Multiple Choice
                                    </SelectItem>
                                    <SelectItem value="true-false">
                                        True / False
                                    </SelectItem>
                                    <SelectItem value="short-answer">
                                        Short Answer
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <QuizQuestionMultipleChoiceForm
                                v-if="
                                    currentQuestion.type === 'multiple-choice'
                                "
                                :quizId="quizDto.quizId"
                                :isEdit="editingQuestionIndex !== null"
                                :questionModel="currentQuestion"
                                @save="onAddQuestion"
                            />
                        </form>
                    </main>
                </DialogContent>
            </Dialog>

            <!-- Question Render -->
             <section>
                <div v-for="(question, index) in questionsForRender" :key="index" class="mb-4">
                    <QuizQuestionMultipleChoiceReview
                        v-if="question.type === 'multiple-choice'"
                        :question="question.getModel<MultipleChoiceQuestionModelDto>()"
                        @edit="onOpenQuestionModal(index)"
                    />
                    <!-- Add other question type reviews here -->

                </div>
             </section>

            <!-- Save Button -->
            <div class="mt-6 flex justify-end gap-4">
                <Button variant="outline" type="button" @click="onCancel"
                    >Cancel</Button
                >
                <Button type="submit" class="flex items-center gap-2">
                    <span>Save Quiz</span>
                </Button>
            </div>
        </div>
    </form>
    {{ questionsForRender }}
    <!-- For debugging purposes -->
</template>

<script lang="ts" setup>
import { QuizQuestionMultipleChoiceReview } from '#components';


const isQuestionModalOpen = ref(false);
const editingQuestionIndex = ref<number | null>(null);
const currentQuestion = ref<QuestionModelDto>(new QuestionModelDto());

const props = defineProps<{
    quizDto: QuizDto;
    availableClasses: ClassDto[];
}>();

const quizModel = ref<QuizModelDto>(new QuizModelDto());
quizModel.value.values = props.quizDto;

const emit = defineEmits<{
    (e: "save", quiz: QuizDto): void;
    (e: "cancel"): void;
}>();

const onSaveQuiz = () => {
    console.log(quizModel.value);
    emit("save", props.quizDto);
};

const onAddQuestion = (value: QuestionDto) => {
    quizModel.value.questions.push(value);
    console.log(quizModel.value);
    isQuestionModalOpen.value = false;
};

const onOpenQuestionModal = (index: number | null) => {
    editingQuestionIndex.value = index;
    isQuestionModalOpen.value = true;
    const tempQuestion =
        index !== null ? quizModel.value.questions[index] : null;
    if (index !== null && tempQuestion) {
        currentQuestion.value = new QuestionModelDto();
        currentQuestion.value.values = tempQuestion;
    } else {
        currentQuestion.value = new QuestionModelDto();
    }
};

const onCancel = () => {
    emit("cancel");
};



const questionsForRender = computed(() => {
    return quizModel.value.questions;
})
</script>

<style></style>
