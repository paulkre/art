<script setup>
import { ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";

import {
  loadMessages,
  loadPages,
  loadEvents,
  refreshUser,
  refreshUsers,
  toggleTheme,
  activeTheme,
  config,
  userName,
  userAbout,
  onUserNameChange,
  useAdmin,
  debug,
  admin,
  update,
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

const { sendUpdate, applyUpdate } = useAdmin();
</script>

<template>
  <div class="App">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" appear>
        <component :is="Component" />
      </Transition>
    </RouterView>

    <div style="position: fixed; right: 16px; top: 16px; display: flex">
      {{ debug ? "a" : "b" }} <IconDarkmode @click="toggleTheme" />
    </div>
    <Users v-if="showUsers" />
    <div style="position: fixed; left: 100px; top: 16px; display: flex">
      <Button v-if="debug" @click="sendUpdate">Send update</Button>
      <Button v-if="update" @click="applyUpdate">Apply update</Button>
    </div>
  </div>
</template>

<style>
.App {
  min-height: 100vh;
}
</style>
