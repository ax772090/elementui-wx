// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
import scrollbarWidth from 'element-ui/src/utils/scrollbar-width';
import { toObject } from 'element-ui/src/utils/util';
import Bar from './bar';

/* istanbul ignore next */
export default {
  name: 'ElScrollbar',

  components: { Bar },

  props: {
    native: Boolean,//默认是false，如果为true，则不会出现自定义滚动条，当然如果使用原生的，那么这个组件存在的意义就没有了
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化:true，最好设置它可以优化性能，因为设置为true时，不会监听resize的事件变化
    tag: {// el-scrollbar__view类的标签名，默认'div'
      type: String,
      default: 'div'
    }
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    }
  },

  render(h) {
    // 拿到计算之后的滚动条宽度
    let gutter = scrollbarWidth();
    let style = this.wrapStyle;

    // 如果有滚动条
    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    // 1.设置ref，方便后续事件绑定
    // 2.this.$slots.default：接收插槽内容
    const view = h(this.tag, {
      class: ['el-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default);
    // 1.设置ref
    // 2.监听onScroll事件
    const wrap = (
      <div
        ref="wrap"
        style={ style }
        onScroll={ this.handleScroll }
        class={ [this.wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default'] }>
        { [view] }
      </div>
    );
    let nodes;

    // 如果不使用原生滚动条，则添加自定义滚动条（水平和垂直）
    if (!this.native) {
      nodes = ([
        wrap,
        <Bar
          move={ this.moveX }
          size={ this.sizeWidth }></Bar>,
        <Bar
          vertical
          move={ this.moveY }
          size={ this.sizeHeight }></Bar>
      ]);
    } else {
      nodes = ([
        <div
          ref="wrap"
          class={ [this.wrapClass, 'el-scrollbar__wrap'] }
          style={ style }>
          { [view] }
        </div>
      ]);
    }
    return h('div', { class: 'el-scrollbar' }, nodes);
  },

  methods: {
    // wrap滚动条滚动时触发
    handleScroll() {
      const wrap = this.wrap;

      // 垂直滚动条滚动比例
      // wrap.clientHeight表示：wrap的可视区域
      // 为什么要乘以100？因为在bar组件中const translate = `translate${bar.axis}(${ move }%)`;是以百分比
      // 类似下面这种：
      // this.moveY = (wrap.scrollTop/wrap.clientHeight)*100
      // this.moveX = (wrap.scrollLeft/wrap.clientWidth)*100
      this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
      this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
    },

    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;

      heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
      widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

      this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
      this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
    }
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    // 添加resize监听
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },

  beforeDestroy() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }
};
