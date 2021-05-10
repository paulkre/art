<script setup>
import { config } from "../lib";
</script>

<template>
  <div class="social">
    <a v-if="config.facebookUrl" :href="config.facebookUrl" target="_blank">
      <icon-facebook />
    </a>
    <a v-if="config.instagramUrl" :href="config.instagramUrl" target="_blank">
      <icon-instagram />
    </a>
    <a v-if="config.twitterUrl" :href="config.twitterUrl" target="_blank">
      <icon-twitter />
    </a>
    <a v-if="config.youtubeUrl" :href="config.youtubeUrl" target="_blank">
      <icon-youtube />
    </a>
    <a v-if="config.emailUrl" :href="config.emailUrl" target="_blank">
      <icon-email />
    </a>
  </div>
</template>

<style>
.social {
  display: flex;
  justify-content: center;
}
.social > a {
  display: grid;
  place-items: center;
  background: var(--fg);
  color: var(--bg);
  width: 48px;
  height: 48px;
  border-radius: 10000px;
  margin-right: 8px;
}
.social > a:last-child {
  margin-right: 0;
}
.social > a > svg {
  transform: scale(1.3);
}
</style>
