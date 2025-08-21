<script setup lang="ts">
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
const props = defineProps<{
    onCreateClass: () => Promise<void>;
}>();
const isOpen = ref(false);
const handleOpen = () => {
    isOpen.value = true;
};
const handleClose = () => {
    isOpen.value = false;
};
</script>
<template>
    <Button variant="default" @click="handleOpen">Add</Button>
     <Dialog :open="isOpen" @update:open="handleClose">
        <DialogContent class="max-h-[80vh] overflow-hidden"></DialogContent>
     </Dialog>
</template>
