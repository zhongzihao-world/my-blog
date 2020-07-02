<template>
  <el-table :data="table_data" :span-method="mergeCol" :row-class-name="tableRowClassName" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" v-loading="table_loading" border>
    <el-table-column prop="update_time" label="操作时间">
    </el-table-column>
    <el-table-column prop="admin_name" label="操作人">
    </el-table-column>
    <el-table-column prop="type" label="操作类型">
    </el-table-column>
    <el-table-column prop="frame_name" label="框架">
    </el-table-column>
    <el-table-column prop="agent_name" label="代理商">
    </el-table-column>
  </el-table>
</template>

<script>
import mock from './mock.json'

export default {
  data() {
    return {
      table_data: [],
      table_loading: false,
      active_row_list: [], // 当前高亮

      // 合并列
      merge_update_time_list: [],
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.table_loading = true;
      try {
        this.table_data = mock;
        this.mergeTable();
      } finally {
        this.table_loading = false;
      }
    },
    mergeTable() {
      let merge_update_time_index = 0;
      this.table_data.forEach((item, index) => {
        if (index === 0) {
          // 第一行必须存在
          this.merge_update_time_list.push(1);
          merge_update_time_index = 0;
        } else {
          if (item.update_time === this.table_data[index - 1].update_time) {
            this.merge_update_time_list[merge_update_time_index]++;
            this.merge_update_time_list.push(0);
          } else {
            this.merge_update_time_list.push(1);
            merge_update_time_index = index;
          }
        }
      });
    },
    mergeCol({ row, column, rowIndex, columnIndex }) {
      const all_merge_list = [0, 1, 2, 3]; // 全部合并的一级列
      if (all_merge_list.includes(columnIndex)) {
        const col_num = this.merge_update_time_list[rowIndex];
        return {
          rowspan: col_num,
          colspan: col_num > 0 ? 1 : 0
        }
      }
    },
    tableRowClassName({ row }) {
      return this.active_row_list.some(item => item.update_time === row.update_time) ? 'sucess_row' : '';
    },
    cellMouseEnter(row) {
      this.active_row_list = this.table_data.filter(item => item.update_time === row.update_time);
    },
    cellMouseLeave() {
      this.active_row_list = []
    },
  }
}
</script>

<style lang="less" scoped>
.el-table {
  /deep/ .sucess_row {
    background: rgba(220, 240, 254, 1);
  }
  /deep/ .el-table__row:hover {
    td {
      background: rgba(220, 240, 254, 1) !important;
    }
  }
}
</style>