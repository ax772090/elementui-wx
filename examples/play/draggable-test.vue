<template>
  <!--使用draggable组件-->
  <div class="itxst">
    <div
      class="left col2"
      @dragover="dragoverOuter"
      @dragleave="dragleaveOuter"
      ref="outerRef"
    >
      <div
        ref="itemRef"
        class="item"
        v-for="(item, index) in arr1"
        :key="item.id"
        @dragenter="(ev) => dragenterHandle(ev, index)"
        @dragleave="(ev) => dragleaveHandle(ev, index)"
        @drop="(ev) => onDrop(ev, item)"
      >
        <div class="item-name">
          {{ item.name }}
        </div>
      </div>
      <div class="drag-tip" v-show="showDragTip">请拖入相关item里面</div>
    </div>
    <div class="right">
      <draggable
        v-bind="dragProps"
        v-model="arr2"
        animation="100"
        @start="onStart"
        @end="onEnd"
      >
        <!-- :move="handleMove" -->
        <transition-group class="right-list">
          <div class="item" v-for="item in arr2" :key="item.id" :id="item.id">
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
      currentMoveEleInfo: {}, //当前拖拽元素的本身属性数据
      showDragTip: false,
      enterInter: false,
      arr1: [
        { id: 9, name: "www.itxst.com" },
        { id: 10, name: "www.jd.com" },
        { id: 11, name: "www.baidu.com" },
        { id: 12, name: "www.taobao.com" },
      ],
      arr2: [
        { id: 1, name: "www.google.com" },
        { id: 2, name: "www.msn.com" },
        { id: 3, name: "www.ebay.com" },
        { id: 4, name: "www.yahoo.com" },
        { id: 5, name: "www.google.com1" },
        { id: 6, name: "www.msn.com1" },
        { id: 7, name: "www.ebay.com1" },
        { id: 8, name: "www.yahoo.com1" },
      ],
    };
  },
  computed: {
    dragProps() {
      return {
        lasterner: null,
        // Sortable.js 预设的拖拽的渐进色半透明很难看谁用谁知道
        forceFallback: false, //true会忽略HTML5的拖拽行为,你要自定义ghostClass chosenClass dragClass样式时，建议forceFallback设置为true
        animation: 200, //拖动时的动画效果，还是很酷的,数字类型。如设置animation=1000表示1秒过渡动画效果
        sort: false, //如果设置为false,它所在组无法移动顺序了
        disabled: false, //是否启用拖拽组件
        ghostClass: "ghostClass", //拖动元素的占位符类名
        chosenClass: "chosenClass",
        dragClass: "dragClass", //拖动元素的样式
      };
    },
  },
  beforeDestroy() {
    this.currentMoveEleInfo = {};
  },
  methods: {
    onStart(ev) {
      console.log("start", ev);
      // 拖拽开始如何拿到当前拖拽的元素的信息
      this.currentMoveEleInfo = this.arr2.filter(
        (item) => item.id == ev.item.id
      )[0];
    },
    onEnd(e) {
      console.log("onEnd", e);
      this.showDragTip = false;
      this.$refs.outerRef.style.background = "";
    },
    /**
     * 1、draggedContext：被拖拽元素的上下文{index,element,futureIndex}
     * 2、relatedContext：拖入区域的上下文{index,element,list,component}
     */
    // 被拖拽元素的信息目前发现只能通过这个move属性才有，其他事件都没有，但是它要在当前组触发移动才能拿到数据，否则拿不到
    // handleMove({ relatedContext, draggedContext }) {
    //   // 返回false将取消拖拽操作
    //   this.currentMoveEleInfo = draggedContext.element;
    // },
    dragoverOuter(event) {
      //   console.log('over-Outer', event);
      // 阻止默认动作以启用drop
      event.preventDefault();
      this.showDragTip = true;
      this.$refs.outerRef.style.background = "#ccc";
    },
    dragleaveOuter(e) {
      console.log("leave-outer", e);
      e.stopImmediatePropagation();
      if (!this.enterInter) {
        this.showDragTip = false;
        this.$refs.outerRef.style.background = "";
      }
    },
    /* 在目标中拖拽，放置目标元素时触发事件 */
    dragenterHandle(event, index) {
      console.log("enter-inner", event);
      this.enterInter = true;
      event.stopPropagation();
      this.lasterner = event.target;
      this.$refs.itemRef[index].classList.add("enter-item");
      // if (event.target.className == "item") {
      //   event.target.style.border = "1px solid red";
      //   event.target.style.background = "#1062cc";
      // }
    },
    dragoverHandle(ev) {
      console.log("over-inner");
    },
    dragleaveHandle(event, index) {
      console.log("leave-inner", event);
      event.stopImmediatePropagation();
      if (this.lasterner === event.target) {
        this.$refs.itemRef[index].classList.remove("enter-item");
      }
      // 当拖动元素离开可放置目标节点，重置其背景
      // if (event.target.className == "item") {
      //   event.target.style.border = "";
      //   event.target.style.background = "";
      // }
    },
    // 只有拖拽到目标区域才会触发这个drop
    onDrop(event, item) {
      console.log("drop", item);
      console.log("当前拖拽数据", this.currentMoveEleInfo);
      console.log("目标数据", item);
      // 这里可以发送请求传数据给后端
      setTimeout(() => {
        this.$message.success("拖拽成功");
        this.arr2 = this.arr2.filter(
          (item) => item.id != this.currentMoveEleInfo.id
        );
        this.currentMoveEleInfo = {};
      }, 1000);
      if (event.target.className == "item") {
        event.target.style.border = "";
        event.target.style.background = "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/*定义要拖拽元素的样式*/
.ghostClass {
  background-color: blue !important;
}

.chosenClass {
  background-color: red !important;
  opacity: 1 !important;
}

.dragClass {
  border: 1px solid #1062cc !important;
  background: #1062cc !important;
  opacity: 1 !important;
  box-shadow: none !important;
  outline: none !important;
  background-image: none !important;
}
.col2 {
  height: 800px;
}
.enter-item {
  background: #1062cc !important;
}
.itxst {
  margin: 10px;
  display: flex;
  & .left {
    width: 400px;
    flex: 0 0 auto;
    border: solid 1px #eee;
    border-radius: 5px;
    padding: 5px;
    position: relative;
    .item {
      text-align: center;
      padding: 10px;
      .item-name {
        height: 30px;
      }
    }
    .drag-tip {
      position: absolute;
      bottom: 0;
      text-align: center;
      width: 100%;
    }
  }
  & .right {
    width: 100%;
    padding: 10px 0px;
    & .right-list {
      display: block;
      .item {
        display: inline-block;
        width: 300px; //calc(25% - 20px);// 这里-20是因为每个item有个margin-left和margin-right各为10px,用这种方式全屏的时候样式会有问题
        height: 50px;
        box-sizing: border-box;
      }
    }
  }
}
.title {
  padding: 6px 12px;
}

.col + .col {
  margin-left: 10px;
}
.item {
  padding: 6px 12px;
  margin: 10px;
  margin-top: 0;
  border: solid 1px #eee;
  background-color: #f1f1f1;
}

.item:hover {
  background-color: #fdfdfd;
  cursor: move;
}
</style>
