module.exports = function(config) {
  var js = generatorJS(config)
  var vue = generatorVue(config)
  console.log(vue, js)
}

function generatorJS(config) {
  var model = {
    moreInfo: {
    }
  }
  var formatFnCode = []
  var saveFormatFnCode = []
  var initRemoteSelectCode = []

  config.cols.forEach(col => {
    model[col.key] = null
    if(col.formatFn) {
      formatFnCode.push(`model.${col.key} = this.${col.formatFn}(model)`)
    }
    if(col.saveFormatFn) {
      saveFormatFnCode.push(`model.${col.key} = this.${col.saveFormatFn}(model)`)
    }
    if(col.dataType === 'select' && col.dataSource.type === 'entity') {
      initRemoteSelectCode.push(`
      if(model.${col.key}) {
        this.$refs.${col.key}.setVal(model.${col.key})
      }
      `)
      // xxxId to xxx
      model.moreInfo[col.key.substr(0, col.key.length - 2)] = {
        name: null
      }
    }
  })

  formatFnCode = formatFnCode.join('\n')
  saveFormatFnCode = saveFormatFnCode.join('\n')
  initRemoteSelectCode = initRemoteSelectCode.join('\n')

  var rules = {}
  config.cols.forEach(col => {
    if(col.validRules && col.validRules.length > 0) {
      rules[col.key] = col.validRules.map(rule => {
        if(rule.name === 'required') {
          return `{ ${ col.dataType === 'number' ? `type: 'number',`: ''}required: true, message: '${rule.errMsg}', trigger: 'blur' }`
        }
        return false
      }).filter(item => item)
    }
  })
  var dictModelCols = config.cols.filter(col => {
    return col.dataType === 'select' && col.dataSource.type === 'dict'
  }).map(col => {
    return {
      key: col.key,
      dictKey: col.dataSource.key
    }
  })
  var js = `
import updateMixin from '@/mixin/update'
import JRemoteSelect from '@/components/remote-select'
import deepClone from 'clone'

var model = ${JSON.stringify(model)}
var rules = ${JSON.stringify(rules)
              .replace(/(\[\"\{)/g, '[{')
              .replace(/(\}\"\])/g, '}]')
            }

export default {
  mixins: [updateMixin],
  components: {
   'j-remote-select': JRemoteSelect,
  },
  data() {
    return {
      KEY: '${config.basic.entity}',
      model,
      rules,
    }  
  },
  methods: {
    formatFetchData(model) {
      model = deepClone(model)
      ${formatFnCode}
      // 下拉框赋值
      if(!this.isView) {
        ${initRemoteSelectCode}
      } else {
        var dictModelCols = ${JSON.stringify(dictModelCols)} || []
        dictModelCols.length > 0 && dictModelCols.forEach(col => {
          model[key] = this.getDictName(col.dictKey, model[col.key])
        })
      }
      return model
    },
    formatSaveData() {
      var model = deepClone(this.model)
      ${saveFormatFnCode}
      delete model.moreInfo // 表关联的数据
      return model
    },
    ${generateVueMethods(config.fn)}
    ${imgLoadedMehtods(config.cols)}
  },
  mounted() {
    
  }
}`
  return js
}

function generatorVue(config) {
        var vue = `
<template>
<div class="main">
  <el-form :inline="true" :model="model" :rules="rules" ref="form" label-position="right" >
    <el-row type="flex" justify="start" class="multi-line">
      ${config.cols.map(col => {
        var inner;
        var dataType = col.dataType
        if(!dataType || dataType === 'string') {
          inner = `
          <el-input v-model="model.${col.key}"></el-input>`
        } else if(dataType === 'strings') {
          inner = `
          <el-input v-model="model.${col.key}" type="textarea" :rows="3"></el-input>`
        } else if(dataType === 'number') {
          inner = `
          <el-input-number v-model.number="model.${col.key}" :controls="false"></el-input-number>`
        } else if(dataType === 'select') {
          if(col.dataSource.type === 'dict') {
            inner = `
            <el-select v-model="model.${col.key}" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in $store.getters.dictObj.${col.dataSource.key}"
                :key="item.key"
                :label="item.label"
                :value="item.key">
              </el-option>
            </el-select>`
          } else {
            inner = `
            <j-remote-select ref="${col.key}" v-model="model.${col.key}" url-key="${col.dataSource.key}" :autoFetch="true">
            </j-remote-select>
            `
          }
        } else if(dataType === 'date') {
          inner = `
          <el-date-picker
            v-model="model.${col.key}"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>`
        } else if(dataType === 'img') {
          inner = `
          <div class="${col.key}-upload" style="text-align:left" v-if="!isView">
            <el-upload class="image-uploader" name="file"
                     :action="addPicUrl" :show-file-list="false"
                     :on-success="${col.key}Loaded">
              <img v-if="model.${col.key}" :src="model.${col.key} | img" class="image-show">
                <i v-else class="el-icon-plus image-uploader-icon"></i>
            </el-upload>
            <div class="form-tip">${col.imgConfig && col.imgConfig.tip}</div>
          </div>
          <div class="${col.key}-upload" v-else>
            <img :src="model.${col.key} | img" class="image-show">
          </div>
          `
        } else if(dataType === 'imgs') {
          inner = `
          <div class="${col.key}-upload" style="text-align:left" v-if="!isView">
            <div class="ly ly-multi image-uploader" >
              <div v-if="model.${col.key}" :key="img" v-for="(img, index) in model.${col.key}.split(',')" class="mb-10 mr-10 pos-r">
                <img :src="img | img" class="image-show" >
                <i class="el-icon-close" @click="removeImg('${col.key}', index)"></i>
              </div>
            </div>
            <div>
              <el-upload 
                v-if="model.${col.key}.split(',').length < ${col.imgConfig.max}"
                class="image-uploader" name="file"
                 :action="addPicUrl" :show-file-list="false"
                 :on-success="${col.key}Loaded"
                 >
                  <i class="el-icon-plus image-uploader-icon"></i>
               </el-upload>
              <div class="form-tip">${col.imgConfig && col.imgConfig.tip}</div>
            </div>
          </div>
            
          <div class="img-upload" style="text-align:left" v-else>
            <img v-if="model.${col.key}" :src="img | img" class="image-show mr-10 mb-10" v-for="(img, index) in model.${col.key}.split(',')">
          </div>`
        } else { // 布尔值
          inner = `
            <el-switch
            v-model="model.${col.key}"
            on-text="是"
            off-text="否"
            on-value="1"
            off-value="0">
          </el-switch>
          `
        }
        var isView = 'isView'
        // 图片类型，自定义显示类型
        if(dataType === 'img' || dataType === 'imgs') {
          isView = false
        }

        var viewValue = `model.${col.key}`
        if(dataType === 'select' && col.dataSource.type === 'entity') {
          viewValue = `model.moreInfo.${col.key.substr(0, col.key.length - 2)}.name`
        }
        return `
        <j-edit-item ${col.dataType === 'strings' ? 'fill' : ''} label="${col.label}" prop="${col.key}" :is-view="${isView}" :view-value="${viewValue}">
        ${inner}
        </j-edit-item>
        `
      }).join('\n')}
    </el-row>
  </el-form>
  
  <el-row type="flex" justify="center">
    <el-button @click="$router.go(-1)">返回</el-button>
    <el-button type="success" @click="save" v-if="!isView">保存</el-button>
  </el-row>
</div>
</template>

<script src="./update.js"></script>
<style scoped>
${getStyle(config.cols)}
</style>`
  return vue

}


function getStyle(cols) {
  var res = cols.filter(col => {
    return col.dataType === 'img' || col.dataType === 'imgs'
  }).map(col => {
    if(col.dataType === 'img' || col.dataType === 'imgs') {
      var size = (col.imgConfig && col.imgConfig.size) || 105
      return `
.${col.key}-upload .image-uploader .image-uploader-icon,
.${col.key}-upload .image-uploader .image-show {
    min-width: ${size}px;
    height: ${size}px;
    line-height: ${size}px;
}`
    } else {
      return ''
    }
  })
  return res.join('\n')
}

function generateVueMethods(fns) {
  return fns.map(fn => {
    var args = fn.args.length > 0 ? fn.args.map(item => item.name).join(', ') : ''
    return `
  ${fn.name}(${args}) {
    ${fn.body}
  }`
  }).join(',\n') + `${fns.length > 0 ? ',\n' : ''}`
}

function imgLoadedMehtods(cols) {
  var res = []
  cols.forEach(col => {
    if (col.dataType === 'img') {
      res.push(`
  ${col.key}Loaded(data) {
      this.handleUploadImageSuccess('${col.key}', data.data)
  }
      `)
    } else if(col.dataType === 'imgs') {
      res.push(`
  ${col.key}Loaded(data) {
      var imgs = this.model.${col.key}.split(',').filter(img => img)
      imgs.push(data.data)
      this.model.${col.key} = imgs.join(',')
  }`)
    }
  })
  return res.join('\n') + `${res.length > 0 ? ',\n' : ''}`
}
