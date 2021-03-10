<script setup>
import { ref, onMounted, onBeforeUpdate, provide } from "vue";

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  BackSide,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const el = ref(null);
const width = 640;
const height = 300;

const scene = new Scene();
provide("scene", scene);

const camera = new PerspectiveCamera(75, width / height, 1, 1100);
camera.position.z = 0.000001;

const renderer = new WebGLRenderer();
renderer.setSize(width, height);

const update = () => renderer.render(scene, camera);

// const geometry = new BoxGeometry(1000, 1000, 1000);
// const material = new MeshNormalMaterial({ side: BackSide });
// const cube = new Mesh(geometry, material);
// scene.add(cube);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", update);

onMounted(() => {
  el.value.append(renderer.domElement);
  update();
});

onBeforeUpdate(() => {
  update();
});
</script>

<template>
  <div ref="el" class="debug">
    <slot />
  </div>
</template>
