import { fetchList, deleteModel } from '@/service/api'
import {SERVER_PREFIX} from '@/setting'
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
    },
    expendCofigToFile(id) {
      this.$http.post(`${SERVER_PREFIX}/list-page/expendCofigToFile/${id}`).then(({data})=> {
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success'
        })
      })
    },
    toggleFreeze(row) {
      this.$http.post(`${SERVER_PREFIX}/list-page/updateFreeze/${row.id}`, {
        isFreeze: row.isFreeze == 1 ? 0 : 1
      }).then(()=> {
        row.isFreeze = row.isFreeze == 1 ? 0 : 1
        this.$message({
          showClose: true,
          message: '操作成功',
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
            isFreeze: item.isFreeze,
            basic: item.basic,
            name: this.getName(item.basic.entity),
          }
        })
      })
    })
    
  }
}