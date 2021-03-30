<script setup>
import { useAdmin, superuser, toBeUpdated, updated } from "../lib";
const { sendUpdate, beforeUpdate, runUpdate, runPostUpdate } = useAdmin();
</script>

<template>
  <Button v-if="superuser && !toBeUpdated && !updated" @click="sendUpdate"
    >Send update</Button
  >
  <Button v-if="toBeUpdated" @click="runUpdate" style="--fg: orange"
    >The site is has new version. Click to run the update</Button
  >
  <Button v-if="updated" @click="runPostUpdate" style="--fg: orange">
    Update run fine, now click to turn the volume back on
  </Button>
</template>
