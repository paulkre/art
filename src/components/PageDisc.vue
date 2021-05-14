<script setup>
import { defineProps } from "vue";
defineProps({ page: { type: Object } });
</script>

<template>
  <disc
    :style="{
      position: 'absolute',
      top: '-125px',
      left: '50px',
      backgroundColor: page?.background,
      backgroundImage: page?.image ? 'url(' + page.image + ')' : '',
      backgroundSize: 'cover',
      color: 'white',
      textAlign: 'center',
      width: '450px',
      height: '450px',
      pointerEvents: 'none',
      zIndex: -1000,
    }"
  />
</template>
