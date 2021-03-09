<script setup>
import { users } from "../lib/index.js";
</script>

<template>
  <div style="padding: 32px">
    <h1>Users</h1>
    <pre>{{ users.sort((a, b) => a.userId.localeCompare(b.userId)) }}</pre>
  </div>
</template>
