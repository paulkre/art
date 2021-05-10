<script setup>
import { defineProps } from "vue";
const props = defineProps({
  page: { type: Object },
});
</script>
<template>
  <Link
    :src="
      page.link
        ? page.link
        : page.event?.eventid
        ? '/' + page.event?.eventid
        : '/page/' + page.pageid
    "
  >
    <disc
      :style="{
        width: '192px',
        height: '192px',
        color: 'var(--fg)',
        backgroundColor: 'var(--bglight)',
        backgroundSize: 'cover',
        textAlign: 'center',
      }"
    >
      <h3>
        {{ page.title }}
      </h3>
    </disc>
  </Link>
</template>
