import ListPageList from './listPage/List.vue'
import UpdatePageList from './updatePage/List.vue'

export default {
  components: {
    ListPageList,
    UpdatePageList
  },
  data() {
    return {
      activeName: 'list'
    }  
  },
  mounted() {
    this.activeName = this.$route.params.type
  },
  methods: {
    handleChange(tab) {
      this.$router.push(`/page/list/${tab.name}`)
    }
  }
}