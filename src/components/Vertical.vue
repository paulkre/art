<template>
  <div class="VStack">
    <slot />
  </div>
</template>

<style>
.VStack {
  display: grid;
  gap: 16px;
  grid-auto-rows: min-content;
}
</style>
