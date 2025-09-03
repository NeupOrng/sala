<script setup lang="ts">
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import type { TeacherDto } from "~/store/model/teacher";
const props = defineProps<{
    onCreateClass: () => Promise<void>;
    teachers: TeacherDto[];
}>();
const isOpen = ref(false);
const handleClose = () => {
    isOpen.value = false;
};
</script>
<template>
    <Dialog @update:open="handleClose">
        <DialogTrigger>
            <Button variant="default">Add</Button>
        </DialogTrigger>

        <DialogContent class="max-h-[80vh] w-fit overflow-hidden">
            <DialogHeader>
                <DialogTitle class="text-xl font-semibold text-gray-800">
                    <span>Create Class</span>
                    <div class="mt-2 h-1 w-16 bg-blue-500 rounded"></div>
                </DialogTitle>
            </DialogHeader>
            <div>
                <Form>
                    <div class="flex justify-between items-center gap-4">
                        <FormField name="className" v-slot="{ componentField }">
                            <FormItem class="mb-4">
                                <FormLabel>Class Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="class name"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField name="teacher" v-slot="{ componentField }">
                            <FormItem class="mb-4">
                                <FormLabel>Teacher</FormLabel>
                                <FormControl>
                                    <Select v-bind="componentField">
                                        <SelectTrigger class="w-[180px]">
                                            <SelectValue
                                                placeholder="Select a teacher"
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel
                                                    >Teachers</SelectLabel
                                                >
                                                <SelectItem v-for="(teacher, index) in teachers" :key="index" :value="teacher.id">
                                                    {{ teacher.fullName }}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <FormField name="description" v-slot="{ componentField }">
                        <FormItem class="mb-4">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="class name"
                                    v-bind="componentField"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </Form>
            </div>
            <DialogFooter class="flex gap-4 justify-end">
                <Button variant="destructive">Cancel</Button>
                <Button variant="default">Submit</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
