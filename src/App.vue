<template>
  <div id="app">
    <HeaderBar />
    <Navigation />
    <router-view></router-view>
    <FooterBar />
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue';
import Navigation from './components/Navigation.vue';
import FooterBar from './components/FooterBar.vue';

export default {
  components: {
    HeaderBar,
    Navigation,
    FooterBar
  }
};
</script>