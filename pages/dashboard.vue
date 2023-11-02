<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex justify-center items-center pt-8">
            <h1 class="text-light-gray tracking-wider pr-3">DASHBOARD</h1>
            <img src="~/assets/images/dashboard-title.svg" alt="connexion icon">
        </div>
        <div class="flex flex-col justify-center items-center mt-12">
            <div
                class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Age : </div>
                <div>{{ calculateAge(userInfo.birth_date) }} ans</div>
            </div>
            <div
                class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Taille : </div>
                <div>{{ healthInfo.size }} m</div>
            </div>
            <div
                class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Poids : </div>
                <div>{{ healthInfo.weight }} kg</div>
            </div>
            <div
                class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> IMC : </div>
                <div>{{ (healthInfo.weight / (healthInfo.size * healthInfo.size)).toFixed(1) }}</div>
            </div>
            <div
                class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Dépenses : </div>
                <div>{{ totalExpenses.toFixed(2) }} €</div>
            </div>
            <div
                class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Recettes : </div>
                <div>{{ totalIncomes.toFixed(2) }} €</div>
            </div>
            <div
                class="flex justify-between items-center text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mb-4 rounded-md">
                <div class="text-light-gray"> Balance : </div>
                <div>{{ (totalIncomes - totalExpenses).toFixed(2) }} €</div>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios'
import { BASE_URL } from '../constants.js'
import moment from 'moment';

export default {
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
    setup() {
        definePageMeta({
            middleware: ['auth'],
        });
    },
    methods: {
        calculateAge(birthDate) {
            const today = moment(); // Utilisez moment pour manipuler les dates
            const birthDateObj = moment(birthDate);
            const age = today.diff(birthDateObj, 'years');

            return age;
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

                const response = await axios.get(`${BASE_URL}/user_health`, { headers });

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

                const response = await axios.get(`${BASE_URL}/incomes`, { headers });

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

                const response = await axios.get(`${BASE_URL}/expenses`, { headers });

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

                const response = await axios.get(`${BASE_URL}/users/info`, { headers });

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