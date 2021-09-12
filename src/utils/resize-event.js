import ResizeObserver from 'resize-observer-polyfill';

const isServer = typeof window === 'undefined';

/* istanbul ignore next */
// https://www.npmjs.com/package/resize-observer-polyfill
// 有两个参数：(entries, observer)=>{}
const resizeHandler = function(entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      // 循环遍历执行之前存入的回调函数
      listeners.forEach(fn => {
        fn();
      });
    }
  }
};

/* istanbul ignore next */
/**
 * 
 * @param {*} element 触发resize的元素
 * @param {*} fn 回调函数update
 * @returns 
 */
export const addResizeListener = function(element, fn) {
  if (isServer) return;
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    // new ResizeObserver返回一个ro对象
    element.__ro__ = new ResizeObserver(resizeHandler);
    // 调用observe方法进行监听
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};

/* istanbul ignore next */
export const removeResizeListener = function(element, fn) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
};
