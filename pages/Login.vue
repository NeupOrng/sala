<script setup lang="ts">
import { useNotification } from "~/composables/use-notification";
import { Form, FormField } from "~/components/ui/form";
import { LoginModel, type ILoginModel } from "~/models/auth/login";
import { useAuthStore } from "~/store/auth";

const { addNotification } = useNotification();
const authStore = useAuthStore();
const loginModel:ILoginModel = {
    email: "",
    password: "",
};

definePageMeta({
    layout: "before-auth",
});

const loginModelObj = new LoginModel(loginModel);
const formContext = loginModelObj.getForm();

const onSubmit = formContext.handleSubmit(async (values) => {
    try {
        // const success = await authStore.login(values); // assuming you have a login action
        // if (success) {
        //     addNotification("Login successful!", "success");
        // } else {
        //     addNotification("Invalid credentials", "error");
        // }
        console.log(values)
        addNotification({
            title: "Login Success",
            description: "Login success successfully",
            type: "default",
            duration: 4000,
        })
    } catch (err) {
        addNotification({
            title: "Login Success",
            description: "Login success successfully",
            type: "destructive",
            duration: 4000,
        })
    }
});
</script>

<template>
    <ClientOnly>
        <div class="min-h-[calc(100vh-50px)] flex flex-col">
            <AppNotificationStack />
            <main class="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
                <form
                    @submit="onSubmit"
                    class="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
                >
                    <h2 class="text-2xl font-bold text-center mb-6">
                        Sign in to your account
                    </h2>

                    <!-- Email -->
                    <FormField name="email"" v-slot="{ componentField }">
                        <FormItem class="mb-4">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <!-- Password -->
                    <FormField name="password" v-slot="{ componentField }">
                        <FormItem class="mb-4">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <div class="flex items-center justify-between mb-6">
                        <label class="flex items-center text-sm">
                            <input type="checkbox" class="mr-2 leading-tight" />
                            <span class="text-gray-600">Remember me</span>
                        </label>
                        <NuxtLink to="/forgot-password" class="text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </NuxtLink>
                    </div>

                    <button
                        type="submit"
                        class="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
                    >
                        Sign In
                    </button>
                </form>
            </main>
        </div>
    </ClientOnly>
</template>
