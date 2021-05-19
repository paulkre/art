<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
});

const festivalRoute = computed(() => `/strapi/${props.festival.slug}`);
</script>

<template>
  <router-link :to="festivalRoute" class="strapi-festival">
    <div><h2 v-html="festival.title" /></div>
  </router-link>
</template>

<style scoped>
.strapi-festival {
  display: grid;
  aspect-ratio: 1;
  background: red;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 32px;
  border-radius: 5000px;
}
.strapi-festival > * {
  width: 100%;
}
</style>

<!--
<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
});

const festivalRoute = computed(() => `/strapi/${props.festival.slug}`);
</script>

<template>
  <router-link :to="festivalRoute">
    <vertical>
      <h2>{{ festival.title }}</h2>
    </vertical>
  </router-link>
</template>
-->
