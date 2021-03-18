<template>
  <div class="Stack">
    <slot />
  </div>
</template>

<style>
.Stack {
  display: grid;
  gap: 16px;
  text-align: center;
  justify-content: center;
  display: grid;
  gap: 16px;
  text-align: center;
  justify-content: center;
  grid-auto-rows: min-content;
  align-content: center;
}
.Stack > * {
  justify-self: center;
}
</style>
