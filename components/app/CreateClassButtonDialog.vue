<script setup lang="ts">
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
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
