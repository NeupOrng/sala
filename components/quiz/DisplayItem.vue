<template>
    <NuxtLink :to="`/school/quiz/${quizItem.quizId}`">
        <Card
            class="w-[24rem] m-1 cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
        >
            <CardHeader class="pb-1 px-4 pt-3">
                <CardTitle
                    class="text-xl font-bold text-gray-900 truncate flex items-center gap-2"
                >
                    <Icon name="BookOpen" class="w-5 h-5 text-indigo-600" />
                    {{ quizItem.title }}
                </CardTitle>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                    {{ quizItem.description }}
                </p>
            </CardHeader>
            <CardContent class="px-4 pt-3 pb-4 flex-1">
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center space-x-2">
                        <Icon name="HelpCircle" class="w-4 h-4 text-gray-500" />
                        <div>
                            <span class="text-xs text-gray-500">Questions</span>
                            <span
                                class="block text-sm font-semibold text-gray-800"
                                >{{ quizItem.questions.length }}</span
                            >
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <Icon name="User" class="w-4 h-4 text-gray-500" />
                        <div>
                            <span class="text-xs text-gray-500">Teacher</span>
                            <span
                                class="block text-sm font-semibold text-gray-800 truncate"
                                >{{ quizItem.teacher.fullName }}</span
                            >
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <Icon name="Clock" class="w-4 h-4 text-gray-500" />
                        <div>
                            <span class="text-xs text-gray-500">Start At</span>
                            <span
                                class="block text-sm font-semibold text-gray-800"
                                >{{ quizItem.startTimeForDisplay }}</span
                            >
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <Icon name="Timer" class="w-4 h-4 text-gray-500" />
                        <div>
                            <span class="text-xs text-gray-500">Duration</span>
                            <span
                                class="block text-sm font-semibold text-gray-800"
                                >{{ quizItem.duration }}</span
                            >
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </NuxtLink>
</template>
<script setup lang="ts">
import _ from "lodash";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QuizDto } from "~/model/quiz";

defineProps<{
    quizItem: QuizDto;
}>();
</script>
