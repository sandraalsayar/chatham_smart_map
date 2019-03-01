<template>
  <li
    :style="{ color: layer.selected ? layer.color : 'black' }"
    @click="$emit('update-console', layer.id)"
  >
    <i class="material-icons">{{ layer.icon }}</i>
    <div>
      <h2>{{ layer.name }}</h2>
      <small>{{ layer.description }}</small>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    layer: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
li {
  padding-bottom: 8px;
  cursor: pointer;
}

li > * {
  display: inline-block;
  vertical-align: text-top;
}

li > div {
  margin-left: 4px;
}

h2 {
  font-size: 14px;
  line-height: 20px;
  margin: 1.4px;
}

small {
  font-size: 12px;
  line-height: 16px;
  color: #a9a9a9;
}
</style>
