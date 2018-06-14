import { fetchList, deleteModel } from '@/service/api'
import {SERVER_PREFIX} from '@/setting'

export default {
  data() {
    return {
      KEY: 'updatePage',
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
      this.$http.post(`${SERVER_PREFIX}/update-page/expendCofigToFile/${id}`).then(({data})=> {
        this.fetchList()
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success'
        })
      })
    },
    toggleFreeze(row) {
      this.$http.post(`${SERVER_PREFIX}/update-page/updateFreeze/${row.id}`, {
        isFreeze: row.isFreeze == 1 ? 0 : 1
      }).then(()=> {
        row.isFreeze = row.isFreeze == 1 ? 0 : 1
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success'
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
              isFreeze: item.isFreeze,
              isSynced: item.isSynced,
              basic: item.basic,
              name: this.getName(item.basic.entity),
            }
          })
        })
      })
    }
  },
  mounted() {
    this.fetchList()
  }
}