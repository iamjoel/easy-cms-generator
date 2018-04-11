import { fetchList, deleteModel } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'listPage',
      list: [],
      entities: []
    }
  },
  methods: {
    getName(entityId) {
      var res = this.entities.filter(item => item.key === entityId)[0]
      return res ? res.label : '未知实体'
    },
    remove(id, index) {
      deleteModel(this.KEY, id).then(({data})=> {
        this.list.splice(index, 1)
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      })
    }
  },
  mounted() {
    fetchList('entity').then(({data}) => {
      this.entities = data.data
      fetchList(this.KEY).then(({data}) => {
        this.list = data.data.map(item => {
          return {
            id: item.id,
            name: this.getName(JSON.parse(item.basic).entity),
          }
        })
      })
    })
    
  }
}