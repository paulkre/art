<template>
  <div class="horizontal">
    <slot />
  </div>
</template>

<style>
.horizontal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(8px, 5vw, 64px);
}

@media (max-width: 800px) {
  .horizontal {
    grid-template-columns: 1fr;
  }
}
</style>
