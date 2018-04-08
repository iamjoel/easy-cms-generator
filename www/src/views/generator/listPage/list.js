export default {
  data() {
    return {
      pages: []
    }
  },
  methods: {
    getName(entityId) {
      return this.$store.state.entities.filter(item => item.key === entityId)[0].label
    }
  },
  mounted() {
    const pagesConfig = this.$store.state.listPagesConfig
    this.pages = pagesConfig.map(item => {
      return {
        id: item.basic.entity,
        name: this.getName(item.basic.entity),
        ...item
      }
    })
  }
}