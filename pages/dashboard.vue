<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex justify-center items-center pt-8">
            <h1 class="text-light-gray tracking-wider pr-3">DASHBOARD</h1>
            <img src="~/assets/images/dashboard-title.svg" alt="connexion icon">
        </div>
        <div class="flex flex-col justify-center items-center mt-12">
            <div class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Age : </div>
                <div>{{ calculateAge(userInfo.birth_date) }} ans</div>
            </div>
            <div class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Taille : </div>
                <div>{{ healthInfo.size }} m</div>
            </div>
            <div class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Poids : </div>
                <div>{{ healthInfo.weight }} kg</div>
            </div>
            <div class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> IMC : </div>
                <div>{{ (healthInfo.weight / (healthInfo.size * healthInfo.size)).toFixed(1) }}</div>
            </div>
            <div class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Dépenses : </div>
                <div>{{ totalExpenses.toFixed(2) }} €</div>
            </div>
            <div class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Recettes : </div>
                <div>{{ totalIncomes.toFixed(2) }} €</div>
            </div>
            <div class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Balance : </div>
                <div>{{ (totalIncomes - totalExpenses).toFixed(2) }} €</div>
            </div>
        </div>
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
            totalIncomes: 0,
            totalExpenses: 0,
            incomes: {},
            expenses: {},
            healthInfo: {
                gender: "homme",
                weight: "",
                size: "",
                social_security_number: "",
                blood_group: "",
                doctor: "",
            },
            userInfo: {
                lastname: "",
                firstname: "",
                birth_date: "",
                email: "",
            },
        };
    },
    methods: {
        // formatDate(dateString) {
        //     const options = { year: 'numeric', month: 'long', day: 'numeric' };
        //     const formattedDate = new Date(dateString).toLocaleDateString('fr-FR', options);
        //     return formattedDate;
        // },
        calculateAge(birthDate) {
            const today = new Date();
            const birthDateObj = new Date(birthDate);
            const age = today.getFullYear() - birthDateObj.getFullYear();

            // Vérifie si l'anniversaire n'a pas encore eu lieu cette année
            if (today.getMonth() < birthDateObj.getMonth() ||
                (today.getMonth() === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
                age--;
            }

            return age;
        },
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
        async loadHealthInfo() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.get("https://awaited-midge-deeply.ngrok-free.app/user_health", { headers });

                if (response.status === 200) {
                    this.healthInfo = response.data;
                } else {
                    console.error("Échec du chargement des informations de santé.");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des informations de santé :", error);
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

        async getUserInfo() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.get("https://awaited-midge-deeply.ngrok-free.app/user", { headers });

                if (response.status === 200) {
                    this.userInfo = response.data;
                    console.log(this.userInfo)
                } else {
                    console.error("Échec de la récupération des données de l'utilisateur.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
            }
        },
    },

    created() {
        this.redirectIfNotConnected();
        this.getAllIncomes();
        this.getAllExpenses();
        this.loadHealthInfo();
        this.getUserInfo();
    },
};
</script>

<style>
.aria {
  color: white;
}
</style>