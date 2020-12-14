<template>
  <div>
    <span>Default component for unit tests</span>
  </div>
</template>

<script>
export default {
  name: 'DefaultComponent',
  props: {},
  computed: {
    cells() {
      const cells = []
      const dObj = new Date(2018, 2, 1)

      for (let i = 0; i < 35; i += 1) {
        cells.push({
          id: i,
          date: this.utils.getDate(dObj),
          timestamp: dObj.valueOf(),
        })
      }
      return cells
    },
  },
}
</script>
