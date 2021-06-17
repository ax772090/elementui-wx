<template>
  <div style="margin: 20px" class="tset">
    <div class="demo-image__preview">
      <el-image
        style="width: 100px; height: 100px"
        :src="url"
        :preview-src-list="srcList"
      >
      </el-image>
    </div>
    <!-- <el-input
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
    </el-drawer> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "Hello Element UI!",
      drawer: false,
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      srcList: [
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
      ],
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
