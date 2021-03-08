<template>
  <div class="Overlay">
    <div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.Overlay {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 24px;
}
</style>
