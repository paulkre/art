<template>
  <div class="Stack">
    <slot />
  </div>
</template>

<style scoped>
.Stack {
  display: grid;
  gap: 16px;
  text-align: center;
  justify-content: center;
}
.Stack > * {
  justify-self: center;
  border: 2px solid blueviolet;
}
</style>
