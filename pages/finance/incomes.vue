<template>
    <div class="px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <div class="flex justify-center items-center py-8">
            <h1 class="text-light-gray tracking-wider pr-3">RECETTES</h1>
            <img src="~/assets/images/expenses-title.svg" class="transform scale-x-[-1]" alt="documents icon">
        </div>
        <form @submit.prevent="submitIncomeInfo">
            <div class="flex flex-col items-center justify-center mt-6">
                <div class="py-3 flex flex-col">
                    <label class="text-gray-300" for="title">Titre</label>
                    <input
                        class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="text" id="title" v-model="incomeInfo.title" placeholder="titre">
                </div>
                <div class="py-3 flex flex-col">
                    <label class="text-gray-300" for="blood_group">Description</label>
                    <input
                        class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="text" id="description" v-model="incomeInfo.description" placeholder="Description">
                </div>
                <div class="py-3 flex flex-col">
                    <label class="text-gray-300" for="doctor">Prix</label>
                    <input
                        class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="text" id="doctor" v-model="incomeInfo.price" placeholder="Prix">
                </div>
                <button
                    class="flex items-center h-8 bg-slate-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300"
                    type="submit">Ajouter
                </button>
                <div class="mb-24">
                    <div class="text-gray-300 font-semibold flex justify-center mt-12 mb-6">TOTAL : {{ total.toFixed(2) }}</div>
                    <table class="w-full border-collapse">
                        <thead>
                            <tr>
                                <th class="text-left text-amber-800 px-4 py-2">Titre</th>
                                <th class="text-left text-amber-800 px-4 py-2">Description</th>
                                <th class="text-left text-amber-800 px-4 py-2">Prix (€)</th>
                                <th class="text-left text-amber-800 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="income in incomes" :key="income.id">
                                <td class="border border-gray-600 text-gray-300 px-4 py-2">{{ income.title }}</td>
                                <td class="border border-gray-600 text-gray-300 px-4 py-2">{{ income.description }}</td>
                                <td class="border border-gray-600 text-gray-300 px-4 py-2">{{ income.price }}</td>
                                <td class="border border-gray-500 px-4 py-2">
                                    <button @click="deleteIncome(income.id)" class="text-amber-800 hover:text-amber-600 transition duration-300 ease-in-out">Supprimer</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
            incomeInfo: {
                title: "",
                description: "",
                price: "",
            },
            incomes: {},
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
        async submitIncomeInfo() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.post("http://localhost:5000/incomes", this.incomeInfo, { headers });

                if (response.status === 201) {
                    console.log("Enregistrement d'une nouvelle recette'.")
                    this.getAllIncomes();
                    this.resetIncomeInfo();
                } else {
                    console.error("Échec de l'enregistrement d'une recette'.");
                }
            } catch (error) {
                console.error("Erreur lors de la soumission d'une recette':", error);
            }
        },
        resetIncomeInfo() {
            this.incomeInfo.title = "";
            this.incomeInfo.description = "";
            this.incomeInfo.price = "";
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

                const response = await axios.get("http://localhost:5000/incomes", { headers });
                console.log('date', response.data)
                if (response.status === 200) {
                    this.incomes = response.data;
                    this.incomes.sort((a, b) => b.price - a.price);
                    this.total = this.calculateTotal();
                } else {
                    console.error("Échec de la récupération des recettes.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des recettes :", error);
            }
        },

        async deleteIncome(incomeId) {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.delete(`http://localhost:5000/incomes/${incomeId}`, { headers });

                if (response.status === 200) {
                    console.log("Recette supprimée avec succès.");
                    this.getAllIncomes();
                } else {
                    console.error("Échec de la suppression de la recette.");
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de la recette :", error);
            }
        },
        calculateTotal() {
            return this.incomes.reduce((total, income) => total + parseFloat(income.price), 0);
        },
    },
    mounted() {
        this.getAllIncomes();
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