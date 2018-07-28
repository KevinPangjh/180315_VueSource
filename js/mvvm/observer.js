function Observer(data) {
  // 保存data对象
  this.data = data;
  // 开始进行数据劫持
  this.walk(data);
}

Observer.prototype = {
  walk: function (data) {
    var me = this;
    // 遍历data中所有属性
    Object.keys(data).forEach(function (key) {
      // 给data重新定义响应式的属性(对该属性实现数据绑定)
      me.defineReactive(data, key, data[key]);
    });
  },

  defineReactive: function (data, key, val) {
    // 为当前属性创建对应的dep对象
    var dep = new Dep();
    // 通过隐式递归实现所有层次属性的劫持
    var childObj = observe(val);

    // 重新定义属性, 给属性添加get/set方法
    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      get: function () { // 建立dep与watcher的关系
        if (Dep.target) {
          dep.depend();// 建立dep与watcher的关系
        }
        return val;
      },
      set: function (newVal) { // 更新相关界面节点
        if (newVal === val) {
          return;
        }
        val = newVal;

        // 尝试对新值对象中的属性进行劫持
        childObj = observe(newVal);
        // 通知订阅者
        dep.notify();
      }
    });
  }
};

function observe(value, vm) {
  // 需要监视的是value中的属性, 所有value必须是一个对象
  if (!value || typeof value !== 'object') {
    return;
  }

  // 创建观察对象
  return new Observer(value);
};


var uid = 0;

function Dep() {
  this.id = uid++;
  this.subs = [];
}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },

  depend: function () {
    Dep.target.addDep(this);
  },

  removeSub: function (sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  },

  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  }
};

Dep.target = null;