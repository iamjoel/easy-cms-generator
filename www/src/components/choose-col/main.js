import {fetchList} from '@/service/api' 

export default {
  props: {
    entityId: String,
    choosedCols: Array
  },
  computed: {
    allColsList() {
      if(this.entityId) {
        var tarEntity = this.entityList.filter(entity => entity.id === this.entityId)[0]
        return tarEntity ? tarEntity.cols : []
      } else {
        return []
      }
    },
    canChooseCols() {
      if(!this.allColsList) {
        return []
      }
      return this.allColsList.filter(item => {
        var hasSelected = this.choosedCols.filter(col => item.key === col.key).length > 0
        return !hasSelected
      })
    }
  },
  data() {
    return {
      entityList: [],
      tempSelectedCols: [],
      isShow: false
    }
  },
  mounted() {
    fetchList('entity').then(({data}) => {
      // debugger
      this.entityList = data.data
    })
  },
  methods: {
    show() {
      this.tempSelectedCols = []
      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    chooseCols() {
      this.$emit('choosed',this.tempSelectedCols)
      this.isShow = false
    },
    handleSelectedColsChange(selectedCol) {
      this.tempSelectedCols = [...selectedCol]
    }
    // .map(item => {
    //     return {
    //       key: item.key,
    //       label: item.label,
    //       dataType: item.dataType,
    //       formatFn: null
    //     }
    //   })
  }
}