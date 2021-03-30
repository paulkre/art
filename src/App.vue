<script setup>
import { ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";

import {
  loadEvents,
  loadMessages,
  loadPages,
  refreshUser,
  refreshUsers,
} from "./lib";

loadEvents();
loadMessages();
loadPages();
refreshUser();
refreshUsers();

const route = useRoute();
const showUsers = ref(false);

watch(
  () => route.matched,
  () => {
    showUsers.value = route.matched?.[0]?.path !== "/:eventid";
  },
  { immediate: true }
);
</script>

<template>
  <div class="App">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" appear>
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
.App {
  min-height: 100vh;
}
</style>
