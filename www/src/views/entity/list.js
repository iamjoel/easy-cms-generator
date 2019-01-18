import EntityList from './entity/List.vue'
import EntityTypeList from './entity-type/List.vue'
import Config from './config/List.vue'

export default {
  components: {
    EntityList,
    EntityTypeList,
    Config,
  },
  data() {
    return {
      activeName: 'entity'
    }  
  },
  mounted() {
    this.activeName = this.$route.params.type
  },
  methods: {
    handleChange(tab) {
      this.$router.push(`/entity/list/${tab.name}`)
    }
  }
}