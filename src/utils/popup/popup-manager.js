import Vue from "vue";
import { addClass, removeClass } from "element-ui/src/utils/dom";

let hasModal = false;
let hasInitZIndex = false;
let zIndex;

// 获取遮罩层，如果没有，那就新建一个div
const getModal = function() {
  if (Vue.prototype.$isServer) return;
  let modalDom = PopupManager.modalDom;
  if (modalDom) {
    hasModal = true;
  } else {
    hasModal = false;
    modalDom = document.createElement("div");
    PopupManager.modalDom = modalDom;
    // 当手指在屏幕上滑动时连续触发，在这个事件发生期间，调用preventDefault事件阻止滚动，stopPropagation事件阻止冒泡
    modalDom.addEventListener("touchmove", function(event) {
      event.preventDefault();
      event.stopPropagation();
    });
    // 监听click事件
    modalDom.addEventListener("click", function() {
      PopupManager.doOnModalClick && PopupManager.doOnModalClick();
    });
  }

  return modalDom;
};
// 用来存放所有被注册的实例，{id:'xx1',id:'xx2'}
const instances = {};

const PopupManager = {
  modalFade: true,
  // 获取实例
  getInstance: function(id) {
    return instances[id];
  },
  // 注册
  register: function(id, instance) {
    if (id && instance) {
      instances[id] = instance;
    }
  },
  // 取消注册
  deregister: function(id) {
    if (id) {
      instances[id] = null;
      delete instances[id];
    }
  },
  // 设置zIndex
  nextZIndex: function() {
    return PopupManager.zIndex++;
  },
  // 所有的弹窗都在这个数组栈里
  modalStack: [],

  // 点击遮罩层是否关闭
  doOnModalClick: function() {
    const topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
    if (!topItem) return;

    const instance = PopupManager.getInstance(topItem.id);
    if (instance && instance.closeOnClickModal) {
      instance.close();
    }
  },
  // 打开遮罩层
  openModal: function(id, zIndex, dom, modalClass, modalFade) {
    if (Vue.prototype.$isServer) return;
    if (!id || zIndex === undefined) return;
    this.modalFade = modalFade;

    const modalStack = this.modalStack;
    // 还是判断如果当前打开的弹窗存在的话，就不在继续打开
    for (let i = 0, j = modalStack.length; i < j; i++) {
      const item = modalStack[i];
      if (item.id === id) {
        return;
      }
    }

    const modalDom = getModal();

    addClass(modalDom, "v-modal");
    if (this.modalFade && !hasModal) {
      addClass(modalDom, "v-modal-enter");
    }
    if (modalClass) {
      let classArr = modalClass.trim().split(/\s+/);
      classArr.forEach((item) => addClass(modalDom, item));
    }
    setTimeout(() => {
      removeClass(modalDom, "v-modal-enter");
    }, 200);
    // 如果遮罩层 modalAppendToBody 为false，并且有父节点，并且节点类型不是11，则把遮罩层放到该节点下面，即放到和dialog本身同一层
    if (dom && dom.parentNode && dom.parentNode.nodeType !== 11) {
      dom.parentNode.appendChild(modalDom);
    } else {
      document.body.appendChild(modalDom);
    }

    if (zIndex) {
      modalDom.style.zIndex = zIndex;
    }
    modalDom.tabIndex = 0;
    modalDom.style.display = "";
    // 入栈
    this.modalStack.push({ id: id, zIndex: zIndex, modalClass: modalClass });
  },

  // 关闭遮罩层
  closeModal: function(id) {
    const modalStack = this.modalStack;
    const modalDom = getModal();

    if (modalStack.length > 0) {
      const topItem = modalStack[modalStack.length - 1];
      if (topItem.id === id) {
        // 如果有自定义的类，先要移除
        if (topItem.modalClass) {
          let classArr = topItem.modalClass.trim().split(/\s+/);
          classArr.forEach((item) => removeClass(modalDom, item));
        }
        // 从栈里面推出
        modalStack.pop();
        // 如果栈里面还有，说明还有遮罩层，因为有嵌套的情况
        if (modalStack.length > 0) {
          modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex;
        }
      } else {
        for (let i = modalStack.length - 1; i >= 0; i--) {
          if (modalStack[i].id === id) {
            modalStack.splice(i, 1);
            break;
          }
        }
      }
    }

    if (modalStack.length === 0) {
      if (this.modalFade) {
        addClass(modalDom, "v-modal-leave");
      }
      setTimeout(() => {
        if (modalStack.length === 0) {
          if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom);
          modalDom.style.display = "none";
          PopupManager.modalDom = undefined;
        }
        removeClass(modalDom, "v-modal-leave");
      }, 200);
    }
  },
};

// 给PopupManager增加一个双向绑定字段：zIndex
Object.defineProperty(PopupManager, "zIndex", {
  configurable: true,
  get() {
    if (!hasInitZIndex) {
      zIndex = zIndex || (Vue.prototype.$ELEMENT || {}).zIndex || 2000;
      hasInitZIndex = true;
    }
    return zIndex;
  },
  set(value) {
    zIndex = value;
  },
});

const getTopPopup = function() {
  if (Vue.prototype.$isServer) return;
  if (PopupManager.modalStack.length > 0) {
    const topPopup =
      PopupManager.modalStack[PopupManager.modalStack.length - 1];
    if (!topPopup) return;
    const instance = PopupManager.getInstance(topPopup.id);

    return instance;
  }
};

if (!Vue.prototype.$isServer) {
  // handle `esc` key when the popup is shown
  window.addEventListener("keydown", function(event) {
    if (event.keyCode === 27) {
      const topPopup = getTopPopup();

      if (topPopup && topPopup.closeOnPressEscape) {
        topPopup.handleClose
          ? topPopup.handleClose()
          : topPopup.handleAction
          ? topPopup.handleAction("cancel")
          : topPopup.close();
      }
    }
  });
}

export default PopupManager;
