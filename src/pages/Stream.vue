<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { formatStreamUrl } from "../lib";

const route = useRoute();

const streamkeys = computed(() =>
  route.params.streamkey.split(",").map((s) => s.trim())
);

const streamurls = computed(() => streamkeys.value.map(formatStreamUrl));
</script>

<template>
  <horizontal style="--cols: 3.5fr 300px; gap: 0">
    <div style="padding: 48px">
      <video-stream
        v-for="(src, i) in streamurls"
        :key="i"
        :src="src"
        :streamkey="streamkeys[i]"
        style="width: 100%"
      />
    </div>
    <div>
      <event-panel
        title="Chat"
        style="background: var(--bglighter); position: sticky; top: 0"
      >
        <chat :channel="streamkeys[0]" />
      </event-panel>
    </div>
    <users />
    <layout>
      <template #top-left>
        <back-button />
      </template>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <users-button />
      </template>
    </layout>
  </horizontal>
</template>
