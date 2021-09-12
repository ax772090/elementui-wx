import Vue from 'vue';

let scrollBarWidth;

/**
 * 如何测量当前浏览器的滚动条的宽度(有意思)
 * 答：通过给外层div设置scroll，然后内部添加一个元素，从而得到差值
 */
export default function() {
  // 如果是服务端，返回0
  if (Vue.prototype.$isServer) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  // 创建outer标签并隐藏
  const outer = document.createElement('div');
  outer.className = 'el-scrollbar__wrap';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';//这里给200也可以，因为计算的是差值
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  // 获取.el-scrollbar__wrap的元素宽度：100px
  // 没有滚动条的宽度
  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  // 有滚动条的宽度
  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  // 得到差值
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
};
