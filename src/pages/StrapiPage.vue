<script setup>
import { toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import { strapiPages } from "../lib";

const { params } = toRefs(useRoute());
const page = computed(() =>
  (strapiPages.value || []).find((p) => p.slug === params.value.page_slug)
);
</script>
<template>
  <horizontal style="padding: 48px; grid-template-columns: 1fr 5fr 1fr">
    <div />
    <vertical>
      <h1>{{ page?.title }}</h1>
      <vertical v-html="page?.description_estonian" />
      <vertical v-html="page?.description_english" />
    </vertical>
    <layout>
      <template #top-left>
        <back-button to="/strapi" />
      </template>
    </layout>
    <layout>
      <template #top-left> <back-button to="/strapi" /> </template>
    </layout>
  </horizontal>
</template>
