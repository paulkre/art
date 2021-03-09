<script setup>
import { computed } from "vue";
import { differenceInMilliseconds } from "date-fns";
import { users, config, scale } from "../lib";

const updatedUsers = computed(() =>
  users.value
    .map((user) => {
      user.updatedSince = differenceInMilliseconds(
        new Date(),
        new Date(user.datetime)
      );
      user.opacity = scale(
        Math.max(user.updatedSince, 10000),
        0,
        config.userUpdatedSinceLimit,
        1,
        0.1
      );
      return user;
    })
    .filter((user) => user.updatedSince < config.userUpdatedSinceLimit)
    .sort((a, b) => a.userId.localeCompare(b.userId))
);
</script>

<template>
  <div style="padding: 32px">
    <h1>Users</h1>
    <pre>{{ updatedUsers }}</pre>
  </div>
</template>
