<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex justify-center items-center pt-8">
            <h1 class="text-light-gray tracking-wider pr-3">RECETTES</h1>
            <img src="~/assets/images/expenses-title.svg" alt="documents icon">
        </div>
        <form @submit.prevent="submitIncomeInfo">
            <div class="flex flex-col justify-center items-center mt-12">
                <div class="pb-4 flex flex-col w-72">
                    <label class="sr-only" for="title">Titre</label>
                    <input
                        class="text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
                        type="text" id="title" v-model="incomeInfo.title" placeholder="Titre :">
                </div>
                <div class="pb-4 flex flex-col w-72">
                    <label class="sr-only" for="blood_group">Description</label>
                    <textarea
                        class="text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-20 pt-1 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
                        type="text" id="description" v-model="incomeInfo.description"
                        placeholder="Description :"></textarea>
                </div>
                <div class="pb-4 flex flex-col w-72">
                    <div class="flex">
                        <label class="sr-only" for="doctor">Prix</label>
                        <input
                            class="text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 mr-2 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
                            type="text" id="doctor" v-model="incomeInfo.price" placeholder="Prix :">
                        <button type="submit">
                            <IconEnter class="transition-transform transform hover:scale-110" />
                        </button>
                    </div>
                </div>
                <div class="mb-24 w-full  md:w-3/4 lg:w-2/3">
                    <div class="flex my-6">
                        <div class="text-light-gray font-semibold flex mr-2">TOTAL :</div>
                        <div class="text-white"> {{ total.toFixed(2) }} €</div>
                    </div>

                    <div v-for="income in incomes" :key="income.id">
                        <div class="mt-5">
                            <div class="flex mt-1">
                                <div class="text-light-gray mr-2">Titre:</div>
                                <div class="text-white">{{ income.title }}</div>
                            </div>
                            <div class="flex mt-1">
                                <div class="text-light-gray mr-2">Prix:</div>
                                <div class="text-white">{{ income.price }} €</div>
                            </div>
                            <div class="flex mt-1">
                                <div class="flex text-light-gray text-sm mr-2">Description:</div>
                                <div class="text-white text-sm">{{ income.description }}</div>
                            </div>
                            <button class="mt-2" @click="deleteIncome(income.id)"><IconSubmenuDeleteFolder class="w-5 h-5 transition-transform transform hover:scale-110" color="#553348"/></button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
    
<script>
import axios from 'axios'
import {BASE_URL} from '../constants.js'

export default {
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
    setup() {
        definePageMeta({
        middleware: ['auth'],
        });
    },
    methods: {
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

                const response = await axios.post(`${BASE_URL}/incomes`, this.incomeInfo, { headers });

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
};
</script>
    
<style>

</style>