<script setup>
import { config } from "../lib";
</script>

<template>
  <div class="strapi-social">
    <a v-if="config.instagramUrl" :href="config.instagramUrl" target="_blank">
      <icon-instagram />
    </a>
    <a v-if="config.youtubeUrl" :href="config.youtubeUrl" target="_blank">
      <icon-youtube />
    </a>
    <a v-if="config.emailUrl" :href="config.emailUrl" target="_blank">
      <icon-email />
    </a>
    <a v-if="config.twitterUrl" :href="config.twitterUrl" target="_blank">
      <icon-twitter />
    </a>
    <a v-if="config.facebookUrl" :href="config.facebookUrl" target="_blank">
      <icon-facebook />
    </a>
  </div>
</template>

<style scoped>
.strapi-social {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  /* gap: 8px; */
}
@media (max-width: 800px) {
  .strapi-social {
    grid-auto-rows: auto;
  }
}
.strapi-social > a {
  display: grid;
  place-items: center;
  /* border: 2px solid var(--fg); */
  color: var(--fg);
  width: 48px;
  height: 48px;
  border-radius: 10000px;
}
.strapi-social > a > svg {
  transform: scale(1.5);
}
</style>
