<script setup>
import { computed, watch, ref } from "vue";
import { differenceInMilliseconds } from "date-fns";
import { Circle, Polygon, Result } from "collisions";
import * as Tone from "tone";
import { debouncedWatch } from "@vueuse/core";

import {
  ws,
  createMessage,
  debounce,
  config,
  users,
  userId,
  useWindow,
  scale,
  userName,
  userAbout,
  userData,
  onUserNameChange,
  useAboutTextarea,
  emitter,
  showMessages,
  pol2car,
  distance,
} from "../lib";

const props = defineProps({
  about: { type: Boolean, default: true },
});

emitter.on("USERS_ON", () => {
  showMessages.value = true;
});

emitter.on("USERS_OFF", () => {
  showMessages.value = false;
});

emitter.emit("USERS_ON");

const updatedUsers = computed(() =>
  users.value
    .map((user) => {
      user.updatedSince = differenceInMilliseconds(
        new Date(),
        new Date(user.datetime)
      );
      user.opacity = Math.min(
        0.8,
        scale(user.updatedSince, 0, config.userUpdatedSinceLimit, 1, 0.1)
      );
      return user;
    })
    .filter((user) => user.updatedSince < config.userUpdatedSinceLimit)
    .sort((a, b) => a.userId.localeCompare(b.userId))
);

const otherUsers = computed(() =>
  updatedUsers.value
    .filter(
      (user) =>
        user.userId !== userId.value && user.value.userX && user.value.userY
    )
    .sort((a, b) => a.userId > b.userId)
);

const { centerX, centerY } = useWindow();

const onLocalDrag = ({ x, y }) => {
  userData.value = { userX: x - centerX.value, userY: y - centerY.value };
};
const onRemoteDrag = debounce(({ x, y }) => {
  const outgoingMessage = createMessage({
    type: "USER",
    value: {
      userX: x - centerX.value,
      userY: y - centerY.value,
      userName: userName.value,
      userAbout: userAbout.value,
    },
  });
  ws.send(outgoingMessage);
}, config.messageDelay);

const otherUserStyle = (otherUser) =>
  computed(() => ({
    left: `${otherUser.value.userX + centerX.value}px`,
    top: `${otherUser.value.userY + centerY.value}px`,
  }));

const textareaRef = useAboutTextarea(showMessages);

const circle = new Circle(0, 0, 100);
const circle2 = new Circle(-200, -200, 50);
const myCircle = new Circle(userData.value.userX, userData.value.userY, 10);
const result = new Result();
const result2 = new Result();

const colliding = computed(() => {
  myCircle.x = userData.value.userX;
  myCircle.y = userData.value.userY;
  return !!myCircle.collides(circle, result);
});

const colliding2 = computed(() => {
  myCircle.x = userData.value.userX;
  myCircle.y = userData.value.userY;
  return !!myCircle.collides(circle2, result2);
});

const a = ref(0);

const onStart = () => {
  Tone.start().then(() => {
    console.log("start");
    const loop = new Tone.Loop((time) => {
      Tone.Draw.schedule(() => {
        a.value = time * 60 * 1;
      });
    }, 1 / 60).start(0);
    Tone.Transport.start();
  });
};

const linePos = computed(() => pol2car(a.value, 250));

const synth = new Tone.Synth().toDestination();

const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
const tom = new Tone.MembraneSynth({
  octaves: 4,
  pitchDecay: 0.1,
}).connect(feedbackDelay);

const colliding3 = ref(false);

watch(
  [userData, otherUsers, a],
  () => {
    const lineColl = new Polygon(0, 0, [
      [0, 0],
      [0, 0],
      [linePos.value.x, linePos.value.y],
      [linePos.value.x, linePos.value.y],
    ]);

    const d = distance(0, 0, userData.value.userX, userData.value.userY);
    const r = scale(d, 0, 250, 2, 15);
    const myColl = new Circle(userData.value.userX, userData.value.userY, r);

    if (myColl.collides(lineColl, new Result())) {
      const hz = scale(d, -250, 250, 220, 50);
      colliding3.value = true;
      tom.triggerAttackRelease(`${hz}hz`, "16n");
    } else {
      colliding3.value = false;
    }

    otherUsers.value.forEach((u) => {
      const d = distance(0, 0, u.value.userX, u.value.userY);
      const r = scale(d, 0, 250, 2, 15);
      const userColl = new Circle(u.value.userX, u.value.userY, r);
      if (userColl.collides(lineColl, new Result())) {
        console.log("coll");
        const hz = scale(d, -250, 250, 220, 50);
        tom.triggerAttackRelease(`${hz}hz`, "16n");
      }
    });
  },
  { immediate: true, debounce: 200 }
);
</script>

<template>
  <div>
    <button @click="onStart">Start</button>
    <br />
    <svg
      width="500"
      height="500"
      viewBox="-250 -250 500 500"
      style="position: fixed"
      :style="{ top: centerY - 250 + 'px', left: centerX - 250 + 'px' }"
    >
      <circle
        :r="250 - 1"
        cx="0"
        cy="0"
        stroke="white"
        stroke-width="2"
        fill="none"
      />
      <line :x2="linePos.x" :y2="linePos.y" stroke="white" stroke-width="2" />
    </svg>
    <br />
    <!-- <overlay
      v-if="about"
      style="
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        transition: opacity 600ms;
      "
      :style="{ opacity: showMessages ? 0.9 : 0 }"
    />
    -->
    <div
      v-for="otherUser in otherUsers"
      :key="otherUser.userId"
      :style="{
        ...otherUserStyle(otherUser).value,
        position: 'fixed',
        transition: 'all ' + config.messageDelay * 10 + 'ms linear',
      }"
    >
      <div style="display: grid; grid-template-columns: auto 300px; gap: 8px">
        <dot
          color="#8800FF"
          style="transition: opacity 1000ms"
          :opacity="showMessages ? 1 : otherUser.opacity / 2"
        />
        <transition name="fade">
          <div v-if="showMessages">
            <div
              style="
                font-size: 0.8em;
                opacity: 0.5;
                line-height: 1.3em;
                padding-top: 0.5em;
              "
            >
              {{ otherUser.value.userName }}
            </div>
            <div
              style="font-size: 0.9em; line-height: 1.5em; padding-top: 0.3em"
            >
              {{ otherUser.value.userAbout }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <draggable
      :x="userData.userX + centerX"
      :y="userData.userY + centerY"
      @drag="
        (drag) => {
          onLocalDrag(drag);
          onRemoteDrag(drag);
        }
      "
    >
      <div style="display: grid; grid-template-columns: auto 250px; gap: 8px">
        <div
          style="animation-delay: 20ms"
          trans
          :style="{
            animation: colliding3 ? 'move 1000ms ease' : '',
          }"
        >
          <dot color="red" opacity="0.8" />
        </div>
        <transition name="fade">
          <div v-if="showMessages">
            <div
              style="
                font-size: 0.8em;
                opacity: 0.5;
                line-height: 1.3em;
                padding-top: 0.3em;
              "
            >
              {{ userName }}
            </div>
            <div
              style="font-size: 0.9em; line-height: 1.5em; padding-top: 0.3em"
            >
              {{ userAbout }}
            </div>
          </div>
        </transition>
      </div>
    </draggable>
  </div>
</template>
