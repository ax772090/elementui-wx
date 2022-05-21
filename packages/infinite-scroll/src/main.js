import throttle from "throttle-debounce/debounce";
import {
  isHtmlElement,
  isFunction,
  isUndefined,
  isDefined,
} from "element-ui/src/utils/types";
import { getScrollContainer } from "element-ui/src/utils/dom";

const getStyleComputedProperty = (element, property) => {
  if (element === window) {
    element = document.documentElement;
  }

  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  const css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
};

// [['delay', {…}],['distance', {…}], ...]
const entries = (obj) => {
  return Object.keys(obj || {}).map((key) => [key, obj[key]]);
};

const getPositionSize = (el, prop) => {
  return el === window || el === document
    ? document.documentElement[prop]
    : el[prop];
};

const getOffsetHeight = (el) => {
  return getPositionSize(el, "offsetHeight");
};

const getClientHeight = (el) => {
  return getPositionSize(el, "clientHeight");
};

const scope = "ElInfiniteScroll";
const attributes = {
  delay: {
    type: Number,
    default: 200,
  },
  distance: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  immediate: {
    type: Boolean,
    default: true,
  },
};

// 获取设置的属性,如果没有设置，则使用默认值
// 返回的默认值：{delay:200,distance:0,disabled:false,immediate:true}
const getScrollOptions = (el, vm) => {
  if (!isHtmlElement(el)) return {};
  console.log('a',entries(attributes));

  return entries(attributes).reduce((map, [key, option]) => {
    const { type, default: defaultValue } = option;
    let value = el.getAttribute(`infinite-scroll-${key}`);
    value = isUndefined(vm[value]) ? value : vm[value];
    switch (type) {
      case Number:
        value = Number(value);
        value = Number.isNaN(value) ? defaultValue : value;
        break;
      case Boolean:
        value = isDefined(value)
          ? value === "false"
            ? false
            : Boolean(value)
          : defaultValue;
        break;
      default:
        value = type(value);
    }
    map[key] = value;
    return map;
  }, {});
};

const getElementTop = (el) => el.getBoundingClientRect().top;

// 监听滚动的回调函数
const handleScroll = function(cb) {
  const { el, vm, container, observer } = this[scope];
  const { distance, disabled } = getScrollOptions(el, vm);

  if (disabled) return;

  const containerInfo = container.getBoundingClientRect();
  if (!containerInfo.width && !containerInfo.height) return;

  let shouldTrigger = false;

  if (container === el) {
    // 这里主要判断是否应该触发函数
    // be aware of difference between clientHeight & offsetHeight & window.getComputedStyle().height
    // container.scrollHeight - (container.scrollTop + container.clientHeight) 就是此时滚动条距离最底部的距离 
    const scrollBottom = container.scrollTop + getClientHeight(container);
    shouldTrigger = container.scrollHeight - scrollBottom <= distance;
  } else {
    const heightBelowTop =
      getOffsetHeight(el) + getElementTop(el) - getElementTop(container);
    const offsetHeight = getOffsetHeight(container);
    const borderBottom = Number.parseFloat(
      getStyleComputedProperty(container, "borderBottomWidth")
    );
    shouldTrigger = heightBelowTop - offsetHeight + borderBottom <= distance;
  }

  if (shouldTrigger && isFunction(cb)) {
    cb.call(vm);
  } else if (observer) {
    // 停止观察
    observer.disconnect();
    this[scope].observer = null;
  }
};

export default {
  name: "InfiniteScroll",
  inserted(el, binding, vnode) {
    const cb = binding.value; // 指令绑定的值，这里是一个函数

    const vm = vnode.context;
    // only include vertical scroll
    // 首先需要获取滚动条区域
    const container = getScrollContainer(el, true);
    // 获取设置的属性
    const { delay, immediate } = getScrollOptions(el, vm);
    // 定义节流函数
    const onScroll = throttle(delay, handleScroll.bind(el, cb));
    // 给el 添加属性：'ElInfiniteScroll'
    el[scope] = { el, vm, container, onScroll };

    if (container) {
      // 给该区域添加监听事件：scroll
      container.addEventListener("scroll", onScroll);

      if (immediate) {
        // MutationObserver：监听dom树的变化
        const observer = (el[scope].observer = new MutationObserver(onScroll));
        // 以{ childList: true, subtree: true }这个配置观察 container
        observer.observe(container, { childList: true, subtree: true });
        onScroll();
      }
    }
  },
  unbind(el) {
    const { container, onScroll } = el[scope];
    if (container) {
      container.removeEventListener("scroll", onScroll);
    }
  },
};
