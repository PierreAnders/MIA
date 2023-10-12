<template>
    <div class="bg-image px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <form @submit.prevent="submitHealthInfo">
            <div class="flex flex-col items-center justify-center mt-6">
                <div class="py-3 flex flex-col">
                    <label class="text-gray-300" for="title">Titre</label>
                    <input
                        class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="text" id="title" v-model="expenseInfo.title" placeholder="titre">
                </div>
                <div class="py-3 flex flex-col">
                    <label class="text-gray-300" for="blood_group">Description</label>
                    <input
                        class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="text" id="description" v-model="expenseInfo.description" placeholder="Description">
                </div>
                <div class="py-3 flex flex-col">
                    <label class="text-gray-300" for="doctor">Prix</label>
                    <input
                        class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="text" id="doctor" v-model="expenseInfo.price" placeholder="Prix">
                </div>
                <button @click="submitExpenseInfo"
                    class="flex items-center h-8 bg-slate-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300"
                    type="submit">Ajouter
                </button>
                <div class="mt-6 mb-12">
                    <div class="text-gray-300">TOTAL : {{ total.toFixed(2) }}</div>
                    <ul class="text-gray-300">
                        <li v-for="expense in expenses" :key="expense.id">
                            {{ expense.title }} - {{ expense.description }} - {{ expense.price }} €
                        </li>
                    </ul>
                </div>
            </div>
        </form>
    </div>
</template>
    
<script>
import axios from 'axios';
import BurgerMenu from '~/components/BurgerMenu.vue';

export default {
    components: {
        BurgerMenu,
    },

    data() {
        return {
            expenseInfo: {
                title: "",
                description: "",
                price: "",
            },
            expenses: {},
            total: 0,
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
        async submitExpenseInfo() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.post("http://localhost:5000/expenses", this.expenseInfo, { headers });

                if (response.status === 201) {
                    console.log("Enregistrement d'une nouvelle dépense'.")
                    this.getAllExpenses();
                    this.resetExpenseInfo();
                } else {
                    console.error("Échec de l'enregistrement des informations de santé.");
                }
            } catch (error) {
                console.error("Erreur lors de la soumission des informations de santé:", error);
            }
        },
        resetExpenseInfo() {
            this.expenseInfo.title = "";
            this.expenseInfo.description = "";
            this.expenseInfo.price = "";
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

                const response = await axios.get("http://localhost:5000/expenses", { headers });
                console.log('date', response.data)
                if (response.status === 200) {
                    this.expenses = response.data;
                    this.total = this.calculateTotal();
                } else {
                    console.error("Échec de la récupération des dépenses.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des dépenses :", error);
            }
        },
        calculateTotal() {
            return this.expenses.reduce((total, expense) => total + parseFloat(expense.price), 0);
        },
    },
    mounted() {
        this.getAllExpenses();
    },
    created() {
        this.redirectIfNotConnected();
    },
};
</script>
    
<style>
.bg-image {
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("~/assets/space-background.jpg");
    background-size: cover;
    background-position: center;
    min-height: 100vh;
}
</style>