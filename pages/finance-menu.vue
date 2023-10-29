<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex justify-center items-center pt-8">
            <h1 class="text-light-gray tracking-wider pr-3">FINANCE</h1>
            <IconFinance :color="'#334155'" />
        </div>
        <div class="flex flex-col items-center justify-center mt-12">
            <div class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="flex space-x-3">
                    <IconBalance color="#838383" />
                    <div class="text-light-gray">Balances</div>
                </div>
                <div>{{ (totalIncomes - totalExpenses).toFixed(2) }} €</div>
            </div>
            <div class="flex space-x-2 w-72 pb-2">
                <nuxt-link
                    class="flex justify-between items-center text-white text-sm bg-dark-gray hover:bg-opacity-75 w-72 transition duration-300 h-8 px-4 mb-2 rounded-md"
                    to="/finance/expenses">
                    <div class="flex space-x-3">
                        <IconExpenses color="#838383" />
                        <div class="text-light-gray">Dépenses</div>
                    </div>
                    <div>{{ totalExpenses.toFixed(2) }} €</div>
                </nuxt-link>
                <nuxt-link to="/finance/expenses">
                    <IconEnter class="transition-transform transform hover:scale-110" />
                </nuxt-link>
            </div>
            <div class="flex space-x-2 w-72 pb-2">
                <nuxt-link
                    class="flex justify-between items-center text-white text-sm bg-dark-gray hover:bg-opacity-75 w-72 transition duration-300 h-8 px-4 mb-2 rounded-md"
                    to="/finance/incomes">
                    <div class="flex space-x-3">
                        <IconExpenses class="transform scale-x-[-1]" color="#838383" />
                        <div class="text-light-gray">Recettes</div>
                    </div>
                    <div>{{ totalIncomes.toFixed(2) }} €</div>
                </nuxt-link>
                <nuxt-link to="/finance/incomes">
                    <IconEnter class="transition-transform transform hover:scale-110" />
                </nuxt-link>
            </div>
        </div>
    </div>
</template>
    
<script>
import axios from 'axios';
import BurgerMenu from '@/components/BurgerMenu.vue';
import IconFinance from '@/components/IconFinance.vue';
import IconExpenses from '@/components/IconExpenses.vue';
import IconBalance from '@/components/IconBalance.vue';

export default {
    components: {
        BurgerMenu,
        IconFinance,
        IconExpenses,
        IconBalance,
    },
    data() {
        return {
            totalIncomes: 0,
            totalExpenses: 0,
            incomes: {},
            expenses: {},
            userInfo: {
                lastname: "",
                firstname: "",
                birth_date: "",
                email: "",
            },
        };
    },
    methods: {
        async redirectIfNotConnected() {
            if (process.client) {
                this.jwtToken = localStorage.getItem('access_token');
                if (!this.jwtToken) {
                    console.error('Le jeton JWT n\'est pas disponible.');
                    this.$router.push('/');
                    return;
                }
            } else {
                console.error('Le code est exécuté côté serveur (SSR), localStorage n\'est pas disponible.');
            }
        },
        async getAllIncomes() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.get("https://awaited-midge-deeply.ngrok-free.app/incomes", { headers });

                if (response.status === 200) {
                    this.incomes = response.data;
                    this.incomes.sort((a, b) => b.price - a.price);
                    this.totalIncomes = this.calculateTotalIncomes();
                } else {
                    console.error("Échec de la récupération des recettes.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des recettes :", error);
            }
        },

        calculateTotalIncomes() {
            return this.incomes.reduce((total, income) => total + parseFloat(income.price), 0);
        },

        async getAllExpenses() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.get("https://awaited-midge-deeply.ngrok-free.app/expenses", { headers });

                if (response.status === 200) {
                    this.expenses = response.data;
                    this.expenses.sort((a, b) => b.price - a.price);
                    this.totalExpenses = this.calculateTotalExpenses();
                } else {
                    console.error("Échec de la récupération des dépenses.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des dépenses :", error);
            }
        },

        calculateTotalExpenses() {
            return this.expenses.reduce((total, expense) => total + parseFloat(expense.price), 0);
        },
    },

    created() {
        this.redirectIfNotConnected();
        this.getAllIncomes();
        this.getAllExpenses();
    },
};
</script>

<style>
.aria {
    color: white;
}
</style>