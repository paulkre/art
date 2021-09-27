<script setup>
import { loadMessages, refreshUser, refreshUsers, plausible } from "./lib";

loadMessages();
refreshUser();
refreshUsers();
plausible.enableAutoPageviews();
</script>

<template>
  <users />
  <layout>
    <template #top-right>
      <theme-button />
    </template>
    <template #bottom-left>
      <users-button />
    </template>
  </layout>
</template>
