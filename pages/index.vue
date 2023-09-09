<template>
    <div class="bg-image bg-neutral-900 px-8 pt-12 min-h-screen">
      <BurgerMenu />
    </div>
  </template>
  
  <script>
  import BurgerMenu from '~/components/BurgerMenu.vue';
  
  export default {
    components: {
      BurgerMenu,
    },
  }
  </script>
  
  <style>
  .bg-image {
    /* background-image: url("~/assets/space-background.jpg"); */
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("~/assets/space-background.jpg"); 
    background-size: cover;
    background-position: center;
    min-height: 100vh; 
  }
  </style>
  