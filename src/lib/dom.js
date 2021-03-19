export const useTextarea = (callback = () => {}) => {
  const el = ref(null);

  const onKeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      callback();
      el.value.style.height = "auto";
    }
  };

  const onInput = (e) => {
    el.value.style.height = "auto";
    el.value.style.height = el.value.scrollHeight + "px";
  };

  onMounted(() => {
    if (el.value) {
      //el.value.focus();
      el.value.addEventListener("keydown", onKeydown);
      // @TODO Run when event exists
      onInput();
      el.value.addEventListener("input", onInput);
    }
  });

  onUnmounted(() => {
    if (el.value) {
      el.value.removeEventListener("keydown", onKeydown);
    }
  });

  return el;
};

export const useScrollToBottom = () => {
  const el = ref(null);
  onMounted(() => {
    if (el.value) {
      el.value.scrollTop = el.value.scrollHeight;
      const observer = new MutationObserver(
        () => (el.value.scrollTop = el.value.scrollHeight)
      );
      observer.observe(el.value, { childList: true });
    }
  });
  return el;
};
