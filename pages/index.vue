<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Navigation Bar -->
        <header class="bg-white shadow-sm">
            <div
                class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center"
            >
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold text-gray-900">MySala</h1>
                </div>
                <div class="flex space-x-4">
                    <NuxtLink to="/login">
                        <Button
                            variant="default"
                            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                        >
                            Login
                        </Button>
                    </NuxtLink>
                    <Button
                        variant="outline"
                        class="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                        Contact Us
                    </Button>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
        >
            <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
                Streamline Your School Management
            </h2>
            <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                SchoolSync empowers educators, administrators, and parents with
                a seamless platform to manage classes, track progress, and
                communicate effectively.
            </p>
            <Button
                variant="default"
                size="lg"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
                Get Started
            </Button>
        </section>

        <!-- Features Section -->
        <section class="bg-white py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 class="text-3xl font-bold text-gray-900 text-center mb-12">
                    Why Choose SchoolSync?
                </h3>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Class Management</CardTitle>
                            <CardDescription
                                >Organize classes, schedules, and assignments
                                effortlessly.</CardDescription
                            >
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Parent Portal</CardTitle>
                            <CardDescription
                                >Keep parents informed with real-time updates on
                                student progress.</CardDescription
                            >
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Communication Hub</CardTitle>
                            <CardDescription
                                >Connect teachers, students, and parents
                                seamlessly.</CardDescription
                            >
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
const loadingStore = useLoadingStore();

definePageMeta({
    layout: "before-auth",
});

onMounted(() => {
    setTimeout(() => {
        loadingStore.hideLoading();
    }, 100);
});
</script>
