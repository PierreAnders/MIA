<template>
    <div class="px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <div class="flex justify-center items-center py-8">
            <h1 class="text-light-gray tracking-wider pr-3">FINANCE</h1>
            <IconFinance :color="'#334155'" />
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
import IconFinance from '~/components/IconFinance.vue';

export default {
    components: {
        BurgerMenu,
        IconFinance,
    },
}
</script>
    
<style>

</style>