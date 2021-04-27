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
  replace,
  range,
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
    new Tone.Loop((time) => {
      Tone.Draw.schedule(() => {
        a.value = time * 60 * 1;
      });
    }, 1 / 60).start(0);
    Tone.Transport.start();
    p.start();
  });
};

const linePos = computed(() => pol2car(a.value, 250));

const feedbackDelay = new Tone.FeedbackDelay("16n", 0.5).toDestination();

const tom = new Tone.MonoSynth({}).connect(feedbackDelay);

const colliding3 = ref(false);

const userColliding = ref({});

const sampler = new Tone.Sampler({
  urls: {
    A1: "floaty01.mp3",
  },
  baseUrl: replace(config.corsUrl, {
    url: "http://www.unseen-music.com/yume/loops/trimmed/",
  }),
  attack: 0.1,
  decay: 0.2,
  sustain: 1,
  release: 1,
})
  .connect(new Tone.Reverb(1))
  .toDestination();

const filter = new Tone.Filter(2000, "lowpass").toDestination();
filter.frequency.rampTo(500, 1);

const p = new Tone.GrainPlayer({
  url: replace(config.corsUrl, {
    url: "http://www.unseen-music.com/yume/loops/trimmed/drums01.mp3",
  }),
  loop: true,
  grainSize: 0.1,
  overlap: 0.05,
  reverse: false,
  detune: -1000,
  //loopStart: "1n",
})
  .connect(filter)
  .connect(new Tone.Reverb(10))
  .toDestination();

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

    const coll = myColl.collides(lineColl, new Result());

    const hz = scale(d, -250, 250, 100, 10);

    if (coll) {
      sampler.triggerAttackRelease(`${hz}hz`, 10);
    }

    userColliding.value = {
      ...userColliding.value,
      [userId.value]: { colliding: !!coll, distance: d },
    };

    otherUsers.value.forEach((u) => {
      const d = distance(0, 0, u.value.userX, u.value.userY);
      const r = scale(d, 0, 250, 2, 15);
      const userColl = new Circle(u.value.userX, u.value.userY, r);
      const coll = userColl.collides(lineColl, new Result());
      if (coll) {
        const hz = scale(d, -250, 250, 100, 10);
        sampler.triggerAttackRelease(`${hz}hz`, 10);
      }
      userColliding.value = {
        ...userColliding.value,
        [userId]: { colliding: !!coll, distance: d },
      };
    });
  },
  { immediate: true, debounce: 200 }
);
</script>

<template>
  <div>
    <!-- {{ circles }} -->
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
      <circle
        v-for="(c, i) in circles"
        :key="i"
        r="10"
        :cx="c.x"
        :cy="c.y"
        stroke="red"
        stroke-width="2"
        fill="none"
      />
      <g v-for="(user, i) in userColliding" :key="i">
        <transition name="fade">
          <circle
            v-if="user.colliding"
            :r="user.distance"
            cx="0"
            cy="0"
            stroke="white"
            stroke-width="2"
            fill="none"
            opacity="0.1"
          />
        </transition>
      </g>
      <line :x2="linePos.x" :y2="linePos.y" stroke="white" stroke-width="2" />
    </svg>
    <br />
    <transition name="fade">
      <vertical v-show="showMessages" class="about-panel">
        <h3 class="mobilehide">
          <span
            style="display: inline-block; color: red; transform: scale(0.8)"
          >
            ⬤
          </span>
          Let's make music!
        </h3>
        <button-big style="justify-self: stretch" @click="onStart">
          Start
        </button-big>

        <small>
          <span style="opacity: 0.5">Your name is {{ userName }}</span
          >&ensp;
          <span @click="onUserNameChange" style="cursor: pointer"
            >Change the name</span
          >
        </small>
        <textarea
          ref="textareaRef"
          v-model="userAbout"
          placeholder="Write here a message"
        />
      </vertical>
    </transition>
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
        <div
          style="animation-delay: 20ms"
          trans
          :style="{
            animation: userColliding[otherUser.userId]?.colliding
              ? 'move 1000ms ease'
              : '',
          }"
        >
          <dot
            color="#8800FF"
            style="transition: opacity 1000ms"
            :opacity="showMessages ? 1 : otherUser.opacity / 2"
          />
        </div>
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

<style>
.about-panel {
  position: fixed;
  left: 16px;
  bottom: 16px;
  padding: 16px;
  background: var(--bglight);
  border-radius: 6px;
  display: grid;
  grid-auto-rows: max-height;
  gap: 8px;
  width: 300px;
}
@media (max-width: 800px) {
  .about-panel {
    width: calc(100vw - 16px - 16px);
  }
  .mobilehide {
    display: none;
  }
}
</style>
