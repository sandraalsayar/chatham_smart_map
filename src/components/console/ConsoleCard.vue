<template>
  <div class="card" :class="{ scroll: scrollable }">
    <h2>{{ heading }}</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      required: true
    },
    scrollable: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.card {
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 3px;
  padding: 5px;
}

.card:hover {
  box-shadow: 0 10px 18px 0 rgba(0, 0, 0, 0.2);
}

.scroll {
  max-height: 265px;
  overflow-y: scroll;
}

h2 {
  margin: 5px;
  margin-left: 0.7em;
  margin-right: 0.7em;
  font-size: 14px;
  line-height: 20px;
}
</style>
