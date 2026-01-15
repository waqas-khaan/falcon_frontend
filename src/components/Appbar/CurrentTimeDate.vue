<template>
  <div class="current-time-date">
    <span class="current-date">{{ formattedDate }}</span>
    <span class="time-separator">•</span>
    <span class="current-time">{{ formattedTime }}</span>
  </div>
</template>

<script>
export default {
  name: "CurrentTimeDate",
  data() {
    return {
      now: new Date(),
      timerId: null,
    };
  },
  computed: {
    formattedDate() {
      return this.now.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    },
    formattedTime() {
      const timeString = this.now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // display time in AM/PM format
      });
      // Ensure AM/PM is always uppercase
      return timeString.replace(/am|pm/i, (match) => match.toUpperCase());
    },
  },
  mounted() {
    this.timerId = setInterval(() => {
      this.now = new Date();
    }, 1000);
  },
  beforeDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  },
};
</script>


