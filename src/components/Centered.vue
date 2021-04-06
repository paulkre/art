<template>
  <div class="centered">
    <slot />
  </div>
</template>

<style>
.centered {
  display: grid;
  gap: 16px;
  text-align: center;
  justify-content: center;
  align-content: center;
  grid-auto-rows: min-content;
}
.centered > * {
  justify-self: center;
}
</style>
