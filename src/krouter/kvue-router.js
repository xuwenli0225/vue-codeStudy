let _Vue;
// 1.实现VueRouter类
class VueRouter {
  constructor(options) {
    // 接受options(routes)
    this.$options = options;
    // 创建一个响应式变量current,并初始化
    const initial = window.location.hash.slice(1) | "/";
    _Vue.util.defineReactive(this, "current", initial);
    // 监视url变化,url变化就更新current
    window.addEventListener("hashchange", this.onHashChange.bind(this));
    window.addEventListener("load", this.onHashChange.bind(this));
  }
  // url变化的回调
  onHashChange() {
    this.current = window.location.hash.slice(1);
  }
}

// 2.实现一个install方法，Vue.use()时执行
VueRouter.install = function (Vue) {
  _Vue = Vue;
  // 通过混入在Vue原型上添加$router(通过new VueRouter实例化的路由对象)
  Vue.mixin({
    beforeCreate() {
      // 存在说明是根实例
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    },
  });

  // 实现一个router-link标签
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      return h("a", { attrs: { href: "#" + this.to } }, this.$slots.default);
    },
  });

  // 实现一个router-view标签,根据路由规则返回一个组件
  Vue.component("router-view", {
    render(h) {
      let component = null;
      // $router是用混入在vue原型上挂载的
      let route = this.$router.$options.routes.find(
        (route) => route.path === this.$router.current
      );
      if (route) {
        component = route.component;
      }
      return h(component);
    },
  });
};

export default VueRouter;
