<template>
  <div style="margin: 20px" class="tset">
    <el-input
      v-model="input"
      placeholder="请输入内容"
      suffix-icon="el-icon-date"
    ></el-input>
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px">
      点我打开
    </el-button>
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :before-close="handleClose"
    >
      <span>我来啦!</span>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "Hello Element UI!",
      drawer: false,
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done(true);
        })
        .catch((_) => {});
    },
  },
};
</script>
