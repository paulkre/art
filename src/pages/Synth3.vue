<script setup>
import { computed, watch, ref } from "vue";
import * as Tone from "tone";
import { replace, config, randomint, randomId, debounce } from "../lib";

const ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0,
  decay: 0.2,
  sustain: 1,
  release: 1,
}).toDestination();
const osc = new Tone.Oscillator({ type: "square" }).connect(ampEnv).start();

// const feedbackDelay = new Tone.FeedbackDelay(0, 0.25).toDestination();

// const tom = new Tone.MonoSynth({}).toDestination();
// const tom2 = new Tone.MonoSynth({}).connect(feedbackDelay);

// const synth = new Tone.MonoSynth({
//   oscillator: {
//     type: "sine",
//   },
//   envelope: { sustain: 0.01 },
// })
//   .connect(new Tone.FeedbackDelay("1n", 0.25))
//   .connect(new Tone.Reverb(0.1))
//   .toDestination();

const autoFilter = new Tone.AutoFilter("0.5n").toDestination().start();

var synth = new Tone.PolySynth(Tone.Synth)
  //.connect(new Tone.FeedbackDelay("1n", 1))
  //.connect(autoFilter)
  //.connect(new Tone.Reverb(1))
  .toDestination();
synth.set({
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.1,
    release: 1,
  },
});

const sampler = new Tone.Sampler({
  urls: {
    A1: "floaty01.mp3",
  },
  baseUrl: replace(config.corsUrl, {
    url: "http://www.unseen-music.com/yume/loops/trimmed/",
  }),
  attack: 0.1,
  decay: 0.2,
  sustain: 0.1,
  release: 1,
})
  .connect(autoFilter)
  .connect(new Tone.Reverb(1))
  .toDestination();

const sampler2 = new Tone.Sampler({
  urls: {
    A1: "passageDrums01.mp3",
  },
  baseUrl: replace(config.corsUrl, {
    url: "http://www.unseen-music.com/yume/loops/trimmed/",
  }),
  attack: 0.1,
  decay: 0.2,
  sustain: 0.1,
  release: 1,
})
  .connect(autoFilter)
  .connect(new Tone.Reverb(1))
  .toDestination();

const player = new Tone.GrainPlayer({
  url: replace(config.corsUrl, {
    url: "http://www.unseen-music.com/yume/loops/trimmed/passageDrums01.mp3",
  }),
  loop: true,
  grainSize: 0.1,
  overlap: 0.05,
  reverse: false,
  detune: -100,
})
  .connect(new Tone.Reverb(1))
  .toDestination();

// const p = new Tone.GrainPlayer({
//   url: replace(config.corsUrl, {
//     url: "http://www.unseen-music.com/yume/loops/trimmed/passageDrums01.mp3",
//   }),
//   loop: true,
//   grainSize: 0.1,
//   overlap: 0.05,
//   reverse: false,
//   detune: -100,
// })
//   .connect(new Tone.Reverb(10))
//   .toDestination();

const onStart = async () => {
  await Tone.start();
  // p.start();
};

const onTrigger = () => {
  synth.triggerAttackRelease("75hz", 1);
};

const onTrigger2 = () => {
  sampler.triggerAttackRelease("50hz", 10);
};

const onTrigger3 = () => {
  player.start();
};

// http://www.unseen-music.com/yume/loops/trimmed/passageDrums01.mp3
</script>

<template>
  <div>
    <button-medium @click="onStart">Start</button-medium>
    <button-medium @click="onTrigger">Trigger</button-medium>
    <button-medium @click="onTrigger2">Trigger2</button-medium>
    <button-medium @click="onTrigger3">Trigger3</button-medium>
  </div>
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
