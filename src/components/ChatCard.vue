<script setup>
defineProps({ chat: { type: Object } });
</script>

<template>
  <div>
    <div style="font-size: 0.8em; opacity: 0.5">
      {{ chat.userName }}
    </div>
    <div style="font-size: 0.9em">{{ chat.value }}</div>
  </div>
</template>
