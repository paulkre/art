<script setup>
import { inject } from "vue";
import {
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  VideoTexture,
  BackSide,
} from "three";
import Hls from "hls.js";

const scene = inject("scene");

const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);

var hls = new Hls();
var video = document.createElement("video");
video.muted = true;
//   const src = "https://le25.babahhcdn.com/bb1150-le/360/index.m3u8";
const src =
  "https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8";

hls.loadSource(src);
hls.attachMedia(video);

hls.on(Hls.Events.MANIFEST_PARSED, function () {
  video.play();
});

const texture = new VideoTexture(video);
const material = new MeshBasicMaterial({
  map: texture,
});

const mesh = new Mesh(geometry, material);
scene.add(mesh);
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template></template>
