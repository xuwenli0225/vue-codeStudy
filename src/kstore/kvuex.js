// 任务：
// 1.插件：$store
// 2.Store类：保存响应式状态state、方法：commit()/dispatch()
let _Vue

class Store {
  constructor(options) {
    // 保存mutations
    this._mutations = options.mutations
    this._actions = options.actions
    this._wrapperGetters = options.getters
    // 定义computed选项

    const computed = {}
    this.getters = {}
    const store = this
    Object.keys(this._wrapperGetters).forEach(key => {
      // 获取用户定义的getters
      const fn = store._wrapperGetters[key]
      // 转为computed可以使用的无参数形式
      computed[key] = function () {
        return fn(store.state)
      }
      Object.defineProperty(store.getters, key, {
        get: () => store._vm[key]
      })
    })
    // 利用Vue做响应式数据
    this._vm = new _Vue({
      data: {
        $$state: options.state
      },
      computed
    })

    // 基础实现: $store.getters.doubleCounter


    // 绑定this
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    console.error('please use replaceState to reset state');
  }

  // commit(type, payload)
  commit (type, payload) {
    // 获取type对应的mutation
    const entry = this._mutations[type]

    if (!entry) {
      console.error('unknown mutation!');
      return
    }

    entry(this.state, payload)
  }

  dispatch (type, payload) {
    // 获取type对应的mutation
    const entry = this._actions[type]

    if (!entry) {
      console.error('unknown action!');
      return
    }

    entry(this, payload)
  }
}

function install (Vue) {
  _Vue = Vue

  Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

// 导出对象就是Vuex
export default { Store, install };
