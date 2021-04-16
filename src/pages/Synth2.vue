<script setup>
import { computed, watch, ref } from "vue";
import * as Tone from "tone";
import { randomint, randomId, debounce } from "../lib";

const useObjectBuffer = (length = 10, def = null) => {
  const buffer = ref(Array.from({ length }));
  const add = (item) => {
    buffer.value.shift();
    buffer.value = [...buffer.value, { ...item, key: randomId() }];
  };
  return { buffer, add };
};

const { buffer, add } = useObjectBuffer(8);

const onAdd = debounce(({ x, y }) => {
  add({
    userX: x,
    userY: y,
  });
}, 5);
</script>

<template>
  <div>
    <div
      style="
        position: relative;
        border: 2px solid red;
        width: 500px;
        height: 500px;
      "
    >
      <div
        v-for="b in buffer.filter((b) => b)"
        :key="b.key"
        style="position: absolute"
        :style="{ top: b.userY + 'px', left: b.userX + 'px', opacity: 0.2 }"
      >
        ⬤
      </div>
      <draggable @drag="onAdd">⬤</draggable>
      <br />
    </div>
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
