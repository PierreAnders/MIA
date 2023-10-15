<template>
    <div class="bg-image px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <div class="flex flex-col items-center justify-center mt-6">
            <div class="text-xl font-semibold text-white mb-6">Finance</div>
        </div>
        <div class="flex flex-col items-center justify-center mt-6">
            <nuxt-link class="flex items-center h-8 bg-slate-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300" 
            to="/finance/expenses">Dépenses</nuxt-link>
        </div>
        <div class="flex flex-col items-center justify-center mt-6">
            <nuxt-link class="flex items-center h-8 bg-slate-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300" 
            to="/finance/incomes">Recettes</nuxt-link>
        </div>
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
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("~/assets/space-background.jpg");
    background-size: cover;
    background-position: center;
    min-height: 100vh;
}
</style>