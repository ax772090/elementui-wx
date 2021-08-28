<template>
  <!--使用draggable组件-->
  <div class="itxst">
    <div class="col col2" @dragover="dragoverOuter" ref="outerRef">
      <!-- <draggable
        v-model="arr1"
        group="site"
        animation="300"
        dragClass="dragClass"
        ghostClass="ghostClass"
        chosenClass="chosenClass"
        @start="onStart"
        @end="onEnd"
      >
        <transition-group> -->
      <div
        class="item"
        v-for="item in arr1"
        :key="item.id"
        @dragenter="dragenterHandle"
        @dragleave="dragleaveHandle"
      >
        {{ item.name }}
      </div>
      <!-- </transition-group>
      </draggable> -->
    </div>
    <div class="col">
      <draggable v-model="arr2" animation="100" @start="onStart" @end="onEnd">
        <transition-group>
          <div class="item" v-for="item in arr2" :key="item.id">
            {{ item.name }}
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },
  data() {
    return {
      drag: false,
      arr1: [
        { id: 1, name: "www.itxst.com" },
        { id: 2, name: "www.jd.com" },
        { id: 3, name: "www.baidu.com" },
        { id: 4, name: "www.taobao.com" },
      ],
      arr2: [
        { id: 1, name: "www.google.com" },
        { id: 2, name: "www.msn.com" },
        { id: 3, name: "www.ebay.com" },
        { id: 4, name: "www.yahoo.com" },
      ],
    };
  },
  methods: {
    onStart() {
      this.drag = true;
    },
    onEnd(e) {
      console.log("onEnd", e);
      this.drag = false;
      this.$refs.outerRef.style.background = "";
    },
    dragenterOuter(event) {
      // console.log('outer',event);
      // event.stopImmediatePropagation()
      // if(event.target.id === 'outer'){
      //   event.target.style.background = "#ccc";
      // }
    },
    dragoverOuter(event) {
      // console.log('over-Outer',event);
      this.$refs.outerRef.style.background = "#ccc";
      // if(event.target.id === 'outer'){
      //   event.target.style.background = "#ccc";
      // }
    },
    dragleaveOuter(event) {
      console.log("leave-Outer", event);
      // if(event.target.id === 'outer'){
      //   event.target.style.background = "";
      // }
      this.$refs.outerRef.style.background = "#ccc";
    },
    dragenterHandle(event) {
      console.log("enter-inner", event);
      // event.preventDefault();
      event.stopImmediatePropagation();
      if (event.target.className === "item") {
        event.target.style.border = "1px solid red";
      }
    },
    dragleaveHandle(event) {
      console.log("leave-inner", event);
      // 当可拖动的元素进入可放置的目标时高亮目标节点
      if (event.target.className == "item") {
        event.target.style.border = "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.outer-bg {
  background: #ccc;
}
/*定义要拖拽元素的样式*/
.ghostClass {
  background-color: rgb(210, 210, 216) !important;
}

.chosenClass {
  background-color: red !important;
  opacity: 1 !important;
}

.dragClass {
  background-color: blueviolet !important;
  opacity: 1 !important;
  box-shadow: none !important;
  outline: none !important;
  background-image: none !important;
}

.itxst {
  margin: 10px;
}

.title {
  padding: 6px 12px;
}

.col {
  width: 40%;
  flex: 1;
  padding: 10px;
  border: solid 1px #eee;
  border-radius: 5px;
  float: left;
  &.col2 {
    height: 800px;
  }
}

.col + .col {
  margin-left: 10px;
}
.item {
  padding: 6px 12px;
  margin: 0px 10px 0px 10px;
  border: solid 1px #eee;
  background-color: #f1f1f1;
}

.item:hover {
  background-color: #fdfdfd;
  cursor: move;
}

.item + .item {
  border-top: none;
  margin-top: 6px;
}
</style>
