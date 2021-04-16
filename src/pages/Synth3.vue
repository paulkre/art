<script setup>
import { computed, watch, ref } from "vue";
import * as Tone from "tone";
import { randomint, randomId, debounce } from "../lib";

const ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 1.0,
  release: 10.8,
}).toDestination();
const osc = new Tone.Oscillator().connect(ampEnv).start();

const onStart = () => {
  Tone.start().then(() => {
    console.log("s");
    ampEnv.triggerAttackRelease("200hz");
  });
};
</script>

<template>
  <div><button-medium @click="onStart">Start</button-medium></div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-move {
  transition: transform 1s ease;
}
</style>
