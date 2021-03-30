<script setup>
import { emitter } from "../lib";
const onClick = () => emitter.emit("TOGGLE_USERS");
</script>

<template>
  <button-plain @click="onClick">
    <icon-message />
  </button-plain>
</template>
