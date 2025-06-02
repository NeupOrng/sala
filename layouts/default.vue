<template>
  <ClientOnly>
    <div class="w-full flex min-h-screen relative">
      <AppNavigation />
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </ClientOnly>
</template>
