function Watcher(vm, exp, cb) {
  // 更新节点的回调函数
  this.cb = cb;
  this.vm = vm;
  // 表达式
  this.exp = exp;
  // 用来保存相关dep的对象容器
  this.depIds = {};
  // 表达式对应的属性值
  this.value = this.get();
}

Watcher.prototype = {
  update: function () {
    this.run();
  },
  run: function () {
    // 得到当前表达式最新的值
    var value = this.get();
    // 表达式的老值
    var oldVal = this.value;
    // 如果不相同
    if (value !== oldVal) {
      // 保存最新的值
      this.value = value;
      // 调用更新节点的回调函数
      this.cb.call(this.vm, value, oldVal);
    }
  },
  addDep: function (dep) {
    /*
    1. dep
      与data中的属性一一对应
      data中有多个属性就有多个dep对象
    2. watcher
      与模板中表达式(事件指令除外)一一对应
      有多少个表达式就有多少个watcher对象
      必须通过watcher才能去更新界面


    1个dep对应多个watcher?  多个表达式用到了同一个属性
    1个watcher对应多个dep?   多层的表达式
     */

    // 判断关系是否建立过
    if (!this.depIds.hasOwnProperty(dep.id)) {
      // 将当前watcher添加到dep中   dep-->watcher
      dep.addSub(this);
      // 将dep添加到当前watcher中, watcher--->dep
      this.depIds[dep.id] = dep;
    }
  },
  get: function () {
    Dep.target = this;
    var value = this.getVMVal();
    Dep.target = null;
    return value;
  },

  getVMVal: function () {
    var exp = this.exp.split('.');
    var val = this.vm._data;
    exp.forEach(function (k) {
      val = val[k];
    });
    return val;
  }
};