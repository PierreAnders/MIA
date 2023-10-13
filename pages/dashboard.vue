<template>
    <div class="bg-image px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <div class="flex flex-col items-center justify-center mt-6">
            <div class="text-xl font-semibold text-white mb-6">Tableau de bord</div>
            <div class="py-3 flex flex-col">
                <div class="flex justify-center text-gray-300 font-semibold mb-2">Age</div>
                <div class="text-amber-800 text-xl">{{ calculateAge(userInfo.birth_date) }} ans</div>
            </div>
            <div class="py-3 flex flex-col">
                <div class="text-gray-300 font-semibold mb-2">IMC</div>
                <div class="text-amber-800 text-xl">{{ (healthInfo.weight / (healthInfo.size * healthInfo.size)).toFixed(1) }}</div>
            </div>
            <div class="py-3 flex flex-col">
                <div class="flex justify-center text-gray-300 font-semibold mb-2">Recettes</div>
                <div class="text-amber-800 text-xl">{{ totalIncomes.toFixed(2) }} €</div>
            </div>
            <div class="py-3 flex flex-col">
                <div class="flex justify-center text-gray-300 font-semibold mb-2">Dépenses</div>
                <div class="text-amber-800 text-xl">{{ totalExpenses.toFixed(2) }} €</div>
            </div>
            <div class="py-3 flex flex-col">
                <div class="flex justify-center text-gray-300 font-semibold mb-2">Bonus</div>
                <div class="text-amber-800 text-xl">{{ (totalIncomes - totalExpenses).toFixed(2) }} €</div>
            </div>
            <!-- <div class="py-3 flex flex-col">
                <div class="flex justify-center text-gray-300 font-semibold mb-2">Date de naissance</div>
                <div class="text-amber-800 text-xl">{{ formatDate(userInfo.birth_date) }}</div>
            </div> -->
            <!-- <div class="py-3 flex flex-col">
                <div class="text-gray-300 font-semibold mb-2">Taille</div>
                <div class="text-amber-800 text-xl">{{ healthInfo.size }} m</div>
            </div>
            <div class="py-3 flex flex-col">
                <div class="text-gray-300 font-semibold mb-2">Poids</div>
                <div class="text-amber-800 text-xl">{{ healthInfo.weight }} kg</div>
            </div> -->
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
                lastname:"",
                firstname: "",
                birth_date:"",
                email:"",
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

                const response = await axios.get("http://localhost:5000/user_health", { headers });

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

                const response = await axios.get("http://localhost:5000/incomes", { headers });

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

                const response = await axios.get("http://localhost:5000/expenses", { headers });

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

                const response = await axios.get("http://localhost:5000/user", { headers });

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
.bg-image {
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("~/assets/space-background.jpg");
    background-size: cover;
    background-position: center;
    min-height: 100vh;
}
</style>