<template>
<div class="home">
  <img alt="Vue logo" src="../assets/logo.png" />
  <p @click="$store.commit('add')">counter: {{ $store.state.counter }}</p>
  <p @click="$store.dispatch('add')">
    async counter: {{ $store.state.counter }}
  </p>
  <p>double counter: {{ $store.getters.doubleCounter }}</p>
</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
}
</script>
