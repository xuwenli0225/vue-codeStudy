

function defineReactive (obj, key, val) {
  observe(val)
  Object.defineProperty(obj, key, {
    get () {
      console.log('get', key)
      return val
    },
    set (newVal) {
      if (newVal !== val) {
        console.log('set', key)
        observe(newVal)
        val = newVal
      }
    }
  })
}

function observe (obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key])
  })
}

function set (obj, key, val) {
  defineReactive(obj, key, val)
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: { a: 1 },
  arr: [1, 2, 3]
}

observe(obj)


set(obj, 'dong', 'dong')
obj.dong
obj.dong = 'xi'