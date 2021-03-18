<template>
  <div class="HStack">
    <slot />
  </div>
</template>

<style>
.HStack {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(8px, 5vw, 64px);
}
@media (max-width: 800px) {
  .HStack {
    grid-template-columns: 1fr;
  }
}
</style>
