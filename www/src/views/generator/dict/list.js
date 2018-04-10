import { addModel,editModel } from '@/service/api'
import * as types from '@/store/mutation-types'

export default {
  data() {
    return {
      isShowDetailDialog: false,
      currData: [],
      list: [...this.$store.state.dict]
    }  
  },
  methods: {
    showItems(row) {
      this.currData = row.value
      this.isShowDetailDialog = true
    },
    add() {
      this.list.push({
        isNew:true,
        key: '',
        label: '',
        value: ''
      })
    },
    save(row) {
      var action = row.isNew ? addModel : editModel
      var data = {...row}
      delete data.isNew
      action('dict', data).then(({data})=> {
        if(row.isNew) {
          delete row.isNew
        }
      })
    }
  }
}