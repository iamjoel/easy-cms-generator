<template>
  <div class="main">
    <el-dialog 
        title="选择字段"
        :visible.sync="isShow"
      >
        <el-table
          :data="canChooseCols"
          @selection-change="handleSelectedColsChange"
          border
          stripe>
          <!-- 改成checkbox -->
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="label"
            label="名称"
            >
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="chooseCols">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script src="./main.js"></script>

<style scoped></style>