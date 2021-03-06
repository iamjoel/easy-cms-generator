import { fetchList, deleteModel } from '@/service/api'
import {SERVER_PREFIX} from '@/setting'
export default {
  data() {
    return {
      KEY: 'listPage',
      list: [],
      entities: [],
      entityTypeList: [],
    }
  },
  methods: {
    getTypeName(entityTypeId) {
      var res = this.entityTypeList.filter(item => item.id === entityTypeId)[0]
      return res ? res.label : '-'
    },
    remove(id, index) {
      this.$confirm(`确认删除: ${this.list[index].name} 对应的列表页?`,  {
        type: 'warning'
      }).then(() => {
        deleteModel(this.KEY, id).then(({data})=> {
          this.list.splice(index, 1)
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    eject(id) {
      this.$confirm(`弹出操作不可逆?确认弹出`,  {
        type: 'warning'
      }).then(() => {
        this.$http.post(`${SERVER_PREFIX}/listPage-eject/${id}`).then(({data})=> {
          this.fetchList()
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    fetchList() {
      fetchList('entity').then(({data}) => {
        this.entities = data.data
        fetchList(this.KEY).then(({data}) => {
          this.list = data.data.map(item => {
            return {
              id: item.id,
              basic: item.basic,
              isEjected: item.isEjected,
              entityTypeName: this.getTypeName(item.basic.entity.entityTypeId)
            }
          })
        })
      })
    }
  },
  mounted() {
    fetchList('entityType').then(({data}) => {
      this.entityTypeList = data.data
      this.fetchList()
    })
  }
}