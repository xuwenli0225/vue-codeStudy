let _Vue

// 我们自己的router实现
// 插件定义
class VueRouter {
  constructor(options) {
    this.$options = options;

    // 创建一个保存url变量
    // current必须是一个响应式的数据
    // 好处是未来router-view使用current时就产生依赖关系
    // current发生变化，router-view的render会重新执行
    const initial = window.location.hash.slice(1) || "/";
    _Vue.util.defineReactive(this, 'current', initial)

    // 监视url的变化
    window.addEventListener("hashchange", this.onHashChange.bind(this));
    window.addEventListener("load", this.onHashChange.bind(this));
  }

  onHashChange() {
    this.current = window.location.hash.slice(1);
  }
}

// 外面Vue.use会调用install
VueRouter.install = function(Vue) {
  // 0。保存一下Vue
  _Vue = Vue
  
  // 1.挂载一下$router
  Vue.mixin({
    beforeCreate() {
      // 获取router实例
      if (this.$options.router) {
        // 如果存在，说明这是根实例
        Vue.prototype.$router = this.$options.router;
      }
    },
  });

  // 2.实现两个全局组件
  // <router-link to="/xxx">xxx<router-link>
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      // jsx写法
      // return <a href={'#'+this.to}>{this.$slots.default}</a>
      // <a href="#/xxx">ooo</a>
      // 参数1-标签类型
      // 参数2-元素属性
      // 参数3-孩子元素
      return h("a", { attrs: { href: "#" + this.to } }, this.$slots.default);
    },
  });
  Vue.component("router-view", {
    render(h) {
      // 1.获取路由器实例
      let component = null
      const route = this.$router.$options.routes.find(
        (route) => route.path === this.$router.current
      );
      if (route) {
        component = route.component
      }
      // 获取当前url中的hash #/about
      // 从路由表中获取对应的组件
      return h(component);
    },
  });
};

export default VueRouter;
