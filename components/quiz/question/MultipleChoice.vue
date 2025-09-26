<template>
    <form class="my-4" @submit.prevent="onSaveQuestion">
        <FormField name="text" v-slot="{ componentField }">
            <FormItem class="mb-4">
                <FormLabel>Question Text</FormLabel>
                <FormControl>
                    <Textarea
                        placeholder="Enter question text"
                        class="mt-1"
                        v-bind="componentField"
                        v-model="questionModel.text"
                    />
                </FormControl>
                <FormMessage class="text-sm text-red-500 mt-1" />
            </FormItem>
        </FormField>
        <FormField name="options" v-slot="{ field: componentField }">
            <FormItem class="mb-4">
                <FormLabel class="flex justify-between items-center">
                    <p>Options</p>
                    <Button
                        type="button"
                        variant="outline"
                        class="mb-2"
                        @click="addOption()"
                    >
                        Add Option
                    </Button>
                </FormLabel>
                <FormControl>
                    <div v-for="(option, index) in optionFields" :key="index">
                        <FormField
                            :name="`options[${index}]`"
                            v-slot="{ field: componentField }"
                        >
                            <FormItem class="mb-2 flex items-center gap-2">
                                <FormControl class="flex-1">
                                    <Input
                                        placeholder="Enter option text"
                                        v-bind="componentField"
                                        v-model="questionModel.options[index]"
                                    />
                                </FormControl>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    class="px-2 py-1"
                                    @click="removeOption(index)"
                                >
                                    Remove
                                </Button>
                            </FormItem>
                            <FormMessage class="text-sm text-red-500 mt-1" />
                        </FormField>
                    </div>
                </FormControl>
                <FormMessage class="text-sm text-red-500 mt-1" />
            </FormItem>
        </FormField>

        <FormField name="correctAnswer" v-slot="{ field: componentField }">
            <FormItem>
                <FormLabel>Correct Answer</FormLabel>
                <FormControl>
                    <Select v-bind="componentField" v-model="questionModel.correctAnswer" >
                        <SelectTrigger class="w-full mt-1">
                            <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="(option, index) in questionModel.options"
                                :key="index"
                                :value="index"
                            >
                                {{ `[${index + 1}]  ${option}` }}
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
import { useFieldArray } from "vee-validate";

const props = defineProps<{
    quizId: string;
}>();

const emit = defineEmits<{
    (e: "save", question: QuestionDto): void;
}>();

const questionModel = ref(new MultipleChoiceQuestionModelDto());

const {
    fields: optionFields,
    push,
    remove,
    replace,
} = useFieldArray("options");

// Initialize with sample data (optional)
questionModel.value.values = {
    content: JSON.stringify({
        text: "",
        options: [],
        correctAnswer: "",
    }),
};
replace(questionModel.value.options);

const onSaveQuestion = questionModel.value.formContext.handleSubmit(() => {
    emit("save", questionModel.value.getQuestionDto(props.quizId));
});
const addOption = () => {
    // questionModel.value.options.push('')
    push("");
};
const removeOption = (index: number) => {
    questionModel.value.options.splice(index, 1);
    remove(index);
};
</script>

<style></style>
