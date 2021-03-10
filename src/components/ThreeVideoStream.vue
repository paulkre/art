<script setup>
import { watchEffect, inject, defineProps, useContext, watch } from "vue";
import { SphereGeometry, MeshBasicMaterial, Mesh, VideoTexture } from "three";
import { deg2rad } from "../lib";

const props = defineProps(["r"]);
const { slots } = useContext();

const scene = inject("scene");

watchEffect(() => console.log(props));

// if (slots?.default?.().length) {
// watch(
//   () => slots.default(),
//   (slot) => {
//     console.log(slot[0]);
//   },
//   { immediate: true }
// );

const geometry = new SphereGeometry(100, 60, 40);
// invert the geometry on the x-axis so that all of the faces point inward
// to avoid x-flipping of the video texture
geometry.scale(-1, 1, 1);

const texture = new VideoTexture(props.r);
const material = new MeshBasicMaterial({
  map: texture,
});

const mesh = new Mesh(geometry, material);
mesh.rotation.y = deg2rad(-90);
scene.add(mesh);
//}
</script>

<template><slot /></template>
