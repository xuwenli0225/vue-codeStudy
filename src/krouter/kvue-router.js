let _Vue

class VueRouter {
  constructor(options) {
    this.$options = options
    // const initial = window.location.hash.slice(1) | '/'
    // _Vue.util.defineReactive(this, "current", initial)

    this.current = window.location.hash.slice(1) || '/'
    _Vue.util.defineReactive(this, 'matched', [])
    this.match()

    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))

  }
  onHashChange () {
    this.current = window.location.hash.slice(1)
    this.matched = []
    this.match()
  }

  match (routes) {
    routes = routes || this.$options.routes
    for (const route of routes) {
      if (route.path === '/' && this.current === '/') {
        this.matched.push(route)
        return
      }
      if (route.path !== '/' && this.current.indexOf(route.path) != -1) {
        this.matched.push(route)
        if (route.children) {
          this.match(route.children)
        }
        return
      }
    }
  }
}


VueRouter.install = function (Vue) {
  _Vue = Vue
  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true
      },
    },
    render (h) {
      return h("a", { attrs: { href: "#" + this.to } }, this.$slots.default)
    }
  })

  Vue.component("router-view", {
    render (h) {
      console.log(this)
      this.$vnode.data.routerView = true

      let depth = 0
      let parent = this.$parent
      while (parent) {
        const vnodeData = parent.$vnode && parent.$vnode.data
        if (vnodeData) {
          if (vnodeData.routerView) {
            depth++
          }
        }

        parent = parent.$parent
      }



      let component = null
      // const route = this.$router.$options.routes.find((route) =>
      //   route.path === this.$router.current
      // )
      const route = this.$router.matched[depth]
      if (route) {
        component = route.component
      }
      return h(component)
    }
  })


}

export default VueRouter