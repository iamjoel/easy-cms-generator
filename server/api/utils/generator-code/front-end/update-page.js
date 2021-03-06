module.exports = function(config) {
  config.cols = config.cols || []
  config.fn = config.fn || []
  var js = generatorJS(config)
  var vue = generatorVue(config)
  var model = generatorModel(config)
  return {
    js,
    vue,
    model
  }
}

function generatorJS(config) {
  var model = {
    moreInfo: {
    }
  }
  var formatFnCode = []
  var formatPriceCode = []
  var allFormatCode = []

  var saveFormatFnCode = []
  var savePriceFormatCode = []
  var allSaveFormatCode = []

  var initRemoteSelectCode = []

  config.cols.forEach(col => {
    if(col.dataType === 'imgs') {
      model[col.key] = ''
    } else {
      model[col.key] = null
    }
    if(col.formatFn) {
      formatFnCode.push(
`      model.${col.key} = this.${col.formatFn}(model)`
      )
    }
    if(col.saveFormatFn) {
      saveFormatFnCode.push(
`      model.${col.key} = this.${col.saveFormatFn}(model)`)
    }
    
    if(col.dataType === 'select' && col.dataSource.type === 'entities') {
      initRemoteSelectCode.push(
`        if(model.${col.key}) {
          this.$refs.${col.key}.setVal(model.${col.key})
        }`
      )
      // xxxId to xxx
      model.moreInfo[col.key.replace(/Id$/i, '')] = {
        name: null
      }
    } else if(col.dataType === 'price') {
      formatPriceCode.push(
`      if(model.${col.key}) {
        model.${col.key} /= 100
      }`)
      savePriceFormatCode.push(
`      model.${col.key} *= 100
      `)
    }
  })

  allFormatCode = [...formatFnCode, ...formatPriceCode].join('\n')
  allSaveFormatCode = [...saveFormatFnCode, ...savePriceFormatCode].join('\n')
  
  initRemoteSelectCode = initRemoteSelectCode.join('\n')

  var rules = {}
  config.cols.forEach(col => {
    if(col.required) {
      rules[col.key] = [{}].map(rule => {
        var errMsg = `请${['select','date'].includes(col.dataType) ? '选择' : '输入'}${col.label}`
        return `{ ${['int','double', 'price','bool'].includes(col.dataType) ? `type: 'number', `: ''}required: true, message: '${errMsg}', trigger: 'blur' }`
      })
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
  var js = 
`import updateMixin from '@/mixin/update'
import modelScheme from './model'
import JRemoteSelect from '@/components/remote-select'
import deepClone from 'clone'

var model = ${JSON.stringify(model, null, '  ')}

var rules = ${JSON.stringify(rules, null, '  ')
              .replace(/(\"\{)/g, '{')
              .replace(/(\}\")/g, '}')
            }

export default {
  mixins: [updateMixin],
  components: {
   'j-remote-select': JRemoteSelect,
  },
  data() {
    return {
      KEY: '${config.basic.entity.name}',
      model,
      modelScheme,
      rules,
    }  
  },
  methods: {
    formatFetchData(model) {
      model = deepClone(model)
${allFormatCode}
      // 下拉框赋值
      if(!this.isView) {
${initRemoteSelectCode}
      } else {
${dictModelCols.length > 0 ? 
`        // 预览时，字典key对应的文字
        var dictModelCols = ${JSON.stringify(dictModelCols)} || []
        dictModelCols.length > 0 && dictModelCols.forEach(col => {
          model[col.key] = this.getDictName(col.dictKey, model[col.key])
        })` : ''
}
      }

      return model
    },
    formatSaveData() {
      var model = deepClone(this.model)
${allSaveFormatCode}
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
  <div class="ly ly-r mb-10">
    <el-button type="primary" @click="autoFill" v-if="isDev && isAdd">补全表单内容</el-button>
  </div>

  <el-form :inline="true" :model="model" :rules="rules" ref="form" label-position="right" >
    <el-row type="flex" justify="start" class="multi-line">
${config.cols.map(col => {
  var inner;
  var dataType = col.dataType
  if(!dataType || dataType === 'string') {
    inner = 
`      <el-input v-model="model.${col.key}"></el-input>`
  } else if(dataType === 'text') {
    inner = 
`      <el-input v-model="model.${col.key}" type="textarea" :rows="3"></el-input>`
  } else if(['int', 'double', 'price'].includes(dataType)) { // 价格也是数字
    inner = 
`      <el-input-number v-model.number="model.${col.key}" :controls="false"></el-input-number>`
  } else if(dataType === 'select') {
    if(col.dataSource.type === 'dict') {
      inner = 
`      <el-select v-model="model.${col.key}" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in $store.getters.dictObj.${col.dataSource.key}"
            :key="item.key"
            :label="item.label"
            :value="item.key">
          </el-option>
        </el-select>`
    } else {
      inner = 
`      <j-remote-select ref="${col.key}" v-model="model.${col.key}" url-key="${col.dataSource.key}" :autoFetch="true" />`
    }
  } else if(dataType === 'date') {
    inner = 
`      <el-date-picker
        v-model="model.${col.key}"
        type="date"
        placeholder="选择日期" />`
  } else if(dataType === 'img') {
    inner = 
`      <div class="${col.key}-upload" style="text-align:left" v-if="!isView">
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
        </div>`
  } else if(dataType === 'imgs') {
    inner = 
`      <div class="${col.key}-upload" style="text-align:left" v-if="!isView">
          <div class="ly ly-multi image-uploader" >
            <div v-if="model.${col.key}" :key="img" v-for="(img, index) in model.${col.key}.split(',')" class="mb-10 mr-10 pos-r">
              <img :src="img | img" class="image-show" >
              <i class="el-icon-close" @click="removeImg('${col.key}', index)"></i>
            </div>
          </div>
          <div>
            <el-upload 
              v-if="model.${col.key}.split(',').length < ${(col.imgConfig && col.imgConfig.max) || 5}"
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
  } else if(dataType === 'bool'){ // 布尔值
    // 布尔值，后台存的一定是数字型的
    inner = 
`      <el-switch
        v-model="model.${col.key}"
        on-text="是"
        off-text="否"
        :on-value="1"
        :off-value="0">
      </el-switch>`
  } else if(dataType === 'password') {
    inner = 
`      <el-input v-model="model.${col.key}" type="password"></el-input>`
  } else {
    inner = 
`未知类型${dataType}。无法描绘`
  }
  var isView = 'isView'
  // 图片类型，自定义显示类型
  if(dataType === 'img' || dataType === 'imgs') {
    isView = false
  }

  var viewValue = `model.${col.key}`

  if(dataType === 'select' && col.dataSource.type === 'entities') {
    viewValue = `model.moreInfo.${col.key.replace(/Id$/i, '')}.name`
  } else if(dataType === 'bool') {
    viewValue = `model.${col.key} == 1 ? '是' : '否'`
  }

  var res = 
`      <j-edit-item ${['strings', 'img', 'imgs'].indexOf(col.dataType) !== -1 ? 'fill' : ''} label="${col.label}" prop="${col.key}" :is-view="${isView}" :view-value="${viewValue}">
  ${inner}
      </j-edit-item>`
  return res
}).join('\n\n')}
    </el-row>
  </el-form>
  
  <el-row type="flex" justify="center" class="mb-20">
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

function generatorModel(config) {
  var model = config.cols.map(col => {
    return {
      key: col.key,
      dataType: col.dataType,
      dataSource: col.dataSource,
    }
  })
  
  var res = 
`var model = ${JSON.stringify(model, null, '  ')}

export default model
`
  return res
}


function getStyle(cols) {
  var res = cols.filter(col => {
    return col.dataType === 'img' || col.dataType === 'imgs'
  }).map(col => {
    if(col.dataType === 'img' || col.dataType === 'imgs') {
      var size = (col.imgConfig && col.imgConfig.size) || 105
      var item = 
`.${col.key}-upload .image-uploader .image-uploader-icon,
.${col.key}-upload .image-uploader .image-show {
  min-width: ${size}px;
  height: ${size}px;
  line-height: ${size}px;
}`
      return item
    } else {
      return ''
    }
  })
  return res.join('\n\n')
}

function generateVueMethods(fns) {
  return fns.map(fn => {
    var args = fn.args.length > 0 ? fn.args.map(item => item.name).join(', ') : ''
    return 
`   ${fn.name}(${args}) {
      ${fn.body}
    }`
  }).join(',\n') + `${fns.length > 0 ? ',\n' : ''}`
}

function imgLoadedMehtods(cols) {
  var res = []
  cols.forEach(col => {
    if (col.dataType === 'img') {
      res.push(
`    ${col.key}Loaded(data) {
      this.handleUploadImageSuccess('${col.key}', data.data)
    }`)
    } else if(col.dataType === 'imgs') {
      res.push(`
    ${col.key}Loaded(data) {
      var imgs = this.model.${col.key}.split(',').filter(img => img)
      imgs.push(data.data)
      this.model.${col.key} = imgs.join(',')
    }`)
    }
  })
  return res.join(',') + `${res.length > 0 ? ',\n' : ''}`
}
