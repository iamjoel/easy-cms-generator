<template>
  <div class="main entity-and-its-type-page">
    <div class="ly ly-r mb-10">
      <el-button type="success" @click="sync" v-show="!isSynced">同步</el-button>
      <el-button type="primary" @click="add">新增</el-button>
    </div>
    <el-table
      :data="entityTypeList"
      border
      stripe
      default-expand-all
    >
      <el-table-column
        type="index"
        label="序列"
        align="center"
        width="80">
        
      </el-table-column>
      <el-table-column
        prop="label"
        label="实体分类"
        >
        <template slot-scope="scope">
          <el-input v-model="scope.row.label" @change="scope.row.hasChanged = true"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="值"
        >
        <template slot-scope="scope">
          <el-input v-model="scope.row.key" @change="scope.row.hasChanged = true"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="order"
        label="排序"
        >
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.order" @change="scope.row.hasChanged = true"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="操作"
        >
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="save(scope.row)" v-show="scope.row.hasChanged">保存</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row.id, scope.$index)" v-if="scope.row.children.length === 0">删除</el-button>
          <el-button type="primary" @click="addEntity(scope.row.children, scope.row.id)"  size="small" v-if="scope.row.id">新增</el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="ly ly-r mb-10">
          </div>
          <el-table
            :data="scope.row.children"
            border
            stripe>
            <el-table-column
              type="index"
              label="序列"
              align="center"
              width="80">
              
            </el-table-column>
            <el-table-column
              prop="label"
              label="名称"
              >
              <template slot-scope="scope">
                <el-input v-model="scope.row.label" @change="scope.row.hasChanged = true"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="key"
              label="值"
              >
              <template slot-scope="scope">
                <el-input v-model="scope.row.key" @change="scope.row.hasChanged = true"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="order"
              label="排序"
              >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.order" @change="scope.row.hasChanged = true"></el-input>
              </template>
            </el-table-column>

            <el-table-column
              prop="key"
              label="操作"
              width="300"
              >
              <template slot-scope="scope">
                <el-button type="info" size="small" @click="saveEntity(scope.row)" v-show="scope.row.hasChanged">保存</el-button>
                <el-button type="danger" size="small" @click="removeEntity(scope.row.id, scope.$index, scope.row.label)">删除</el-button>
                <el-button type="success" size="small" @click="$router.push('/page/listPage/update/' + scope.row.listPage.id)" v-if="scope.row.listPage" :disabled="scope.row.listPage.isFreeze == 1">编辑列表页</el-button>
                <el-button type="info" size="small" @click="$router.push('/page/listPage/update/-1')" v-else>新增列表页</el-button>
                <el-button type="success" size="small"  @click="$router.push('/page/updatePage/update/' + scope.row.updatePage.id)" v-if="scope.row.updatePage" :disabled="scope.row.updatePage.isFreeze == 1">编辑编辑页</el-button>
                <el-button type="info" size="small" @click="$router.push('/page/updatePage/update/-1')" v-else>新增编辑页</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./list.js">

</script>

<style scoped></style>