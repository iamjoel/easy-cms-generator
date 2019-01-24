import JEditItem from '@/components/edit-item'
import deepClone from 'clone'
import {fetchList, fetchModel, addModel, editModel} from '@/service/api' 

export default {
  components: {
    'j-edit-item': JEditItem,
  },
  data() {
    return {
      KEY: 'entity',
      activeTab: this.$route.params.id == -1 ? 'basic' : 'cols',
      model: {
        basic: {
          isPublic: true,
          hasListPage: true,
          hasUpdatePage: true,
          isShowInMenu: true
        },
        cols: [],
      },
      colItemTemplate: {
        label: '',
        key: '',
        dataType: 'string',
        maxLength: 10,
        required: true,
      },
      colsDataType: [{
        key: 'string',
        label: '字符串'
      },{
        key: 'text',
        label: '文本'
      },{
        key: 'int',
        label: '整数'
      },{
        key: 'double',
        label: '小数'
      },{
        key: 'bool',
        label: '布尔值'
      },{
        key: 'date',
        label: '日期'
      }],
      isShowEditArgsDialog: false,
      isShowDataSourceDialog: false,
      
      validRuleType: [{
        key: 'required',
        label: '非空验证'
      }],
      isShowRuleDialog: false,
      currFn: {},
      currRow: {
        dataSource: {
          type: '',
          key: ''
        },
        imgConfig: {
          max: 5,
          tip: '建议尺寸 750 * 300'
        }
      },
      dictList: [],
      entityTypeList: [],
      canSelectEntityList: [],
      entityList: [],
    }
  },
  methods: {
    showDialog(row, key){
      this.currRow = row
      this[`isShow${key}Dialog`] = true
    },
    move(key, index, action) {
      var changeIndex = action === 'up' ? index - 1 : index + 1
      var data = this.model[key]
      var res = data.map((item, currIndex) => {
        if(currIndex === index) {
          return data[changeIndex]
        } else if(currIndex === changeIndex) {
          return data[index]
        } else {
          return item
        }
      })

      this.model[key] = res
    },
    
    save() {
      var model = deepClone(this.model)
      model.isSynced = false
      
      model.basic = model.basic || {}
      model.cols = model.cols || []

      if(!this.$isColValid(model.cols)) {
        return
      }

      if(!model.hasListPage) {
        model.isShowInMenu = false
      }

      var method = this.$route.params.id == -1 ? addModel : editModel
      method(this.KEY, model).then(()=> {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.$router.go(-1)
      })
    },

    
    deepClone,
    fetchDetail() {
      return new Promise((resolve, reject) => {
        if(this.$route.params.id == -1) {
          resolve()
          return
        }
        fetchModel(this.KEY, this.$route.params.id).then(({data}) => {
          const pagesConfig = data.data

          var model = deepClone(pagesConfig)
          model.basic = model.basic
          model.cols = model.cols

          model.cols = model.cols || []
          model.cols = model.cols.map(col => {
            return {
              ...deepClone(this.colItemTemplate),
              ...col
            }
          })
          model.basic = model.basic || {}
          

          this.model = model
          resolve()
        })
      })
      
    }
  },
  mounted() {
    fetchList('entityType').then(({data}) => {
      this.entityTypeList = data.data
    })
    this.fetchDetail()
  }
}