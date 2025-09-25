<template>
    <form @submit="onSaveQuestion" class="my-4">
        <FormField name="text" v-slot="{ componentField }">
            <FormItem class="mb-4">
                <FormLabel>Question Text</FormLabel>
                <FormControl>
                    <Textarea
                        placeholder="Enter question text"
                        class="mt-1"
                        v-bind="componentField"
                    />
                </FormControl>
                <FormMessage class="text-sm text-red-500 mt-1" />
            </FormItem>
        </FormField>
        <FieldArray
            name="options"
            class="space-y-2 my-2"
            v-slot="arrayProps"
        >
            <div class="flex flex-col">
                <Label
                name="options"
                :class="`my-2 ${optionValidatedMessage ? 'text-red-500' : ''}`"
                >Options</Label
            >
            <div v-for="(field, index) in fields" :key="field.key">
                <FormField
                    :name="`options[${index}]`"
                    v-slot="{ field: componentField }"
                >
                    <FormItem>
                        <FormControl>
                            <div class="flex items-start gap-2">
                                <Input
                                    v-bind="componentField"
                                    placeholder="Enter option text"
                                    class="flex-1"
                                    v-model="componentField.value"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    @click="remove(index)"
                                >
                                    Remove
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage class="text-sm text-red-500 mt-1" />
                    </FormItem>
                </FormField>
            </div>
            <span class="text-sm text-red-500 mt-1">{{
                optionValidatedMessage
            }}</span>
            </div>
        </FieldArray>
        <Button type="button" variant="outline" class="mb-2" @click="push('')">
            Add Option
        </Button>
        <FormField name="correctAnswer" v-slot="{ field: componentField }">
            <FormItem>
                <FormLabel>Correct Answer</FormLabel>
                <FormControl>
                    <Select v-bind="componentField">
                        <SelectTrigger class="w-full mt-1">
                            <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="(option, index) in fields"
                                :key="index"
                                :value="String(index)"
                            >
                                {{ option.value || `Option ${index + 1}` }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage class="text-sm text-red-500 mt-1" />
            </FormItem>
        </FormField>

        <footer class="flex justify-end items-center gap-2">
            <Button type="button" variant="destructive" class="mt-4 px-4 py-2">
                Cancel
            </Button>
            <Button type="submit" variant="default" class="mt-4 px-4 py-2">
                Save Question
            </Button>
        </footer>
    </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
    Form,
    FieldArray,
    useFieldArray,
    type InvalidSubmissionContext,
} from "vee-validate";

const props = defineProps<{
    quizId: string;
}>();

const emit = defineEmits<{
    (e: "save", question: QuestionDto): void;
}>();

const questionModel = ref<MultipleChoiceQuestionModelDto>(
    new MultipleChoiceQuestionModelDto()
);

const { fields, push, remove, replace } = useFieldArray("options");

// Initialize with sample data (optional)
questionModel.value.values = {
    content: JSON.stringify({
        text: "",
        options: [],
        correctAnswer: "",
    }),
};
replace(questionModel.value.options);

const optionValidatedMessage = computed(() => {
    return questionModel.value.validateOptionsMessage;
});

const onSaveQuestion = questionModel.value.formContext.handleSubmit(
    async (values: any) => {
        // Update questionModel with form values
        questionModel.value.text = values.text;
        questionModel.value.options = values.options;
        questionModel.value.correctAnswer = values.correctAnswer;
        const questionDto = questionModel.value.getQuestionDto(props.quizId);
        console.log("Saving question:", values, questionDto);
        questionModel.value.formContext.resetForm();
        replace([]);
        emit("save", questionDto);
    },
    (err) => {
        console.log("Validation errors:", err);
    }
);
</script>

<style></style>
