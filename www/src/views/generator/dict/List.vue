<template>
  <div class="main">
    <div class="ly ly-r mb-10">
      <el-button type="primary" @click="add">新增</el-button>
    </div>
    <!-- {{$store.state.dict.value}} -->
    <el-table
      :data="list"
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
          <el-input v-model="scope.row.label"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="值"
        >
        <template slot-scope="scope">
          <el-input v-model="scope.row.key"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="value"
        label="子项目"
        >
        <template slot-scope="scope">
          <el-input v-model="scope.row.value"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="操作"
        >
        <template slot-scope="scope">
          <!-- <el-button type="success" size="small" @click="showItems(scope.row)">查看包含项目</el-button> -->
          <el-button type="info" size="small" @click="save(scope.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="详情" :visible.sync="isShowDetailDialog">
      <el-table
        :data="currData"
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
        </el-table-column>
        <el-table-column
          prop="key"
          label="值"
          >
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDetailDialog=false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./list.js">

</script>

<style scoped></style>