<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex justify-center items-center pt-8">
            <h1 class="text-light-gray tracking-wider pr-3">DEPENSES</h1>
            <img src="~/assets/images/expenses-title.svg" alt="documents icon">
        </div>
        <form @submit.prevent="submitExpenseInfo">
            <div class="flex flex-col justify-center items-center mt-12">
                <div class="pb-4 flex flex-col w-72">
                    <label class="sr-only" for="title">Titre</label>
                    <input
                        class="text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
                        type="text" id="title" v-model="expenseInfo.title" placeholder="Titre :">
                </div>
                <div class="pb-4 flex flex-col w-72">
                    <label class="sr-only" for="blood_group">Description</label>
                    <textarea
                        class="text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-20 pt-1 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
                        type="text" id="description" v-model="expenseInfo.description"
                        placeholder="Description :"></textarea>
                </div>
                <div class="pb-4 flex flex-col w-72">
                    <div class="flex">
                        <label class="sr-only" for="doctor">Prix</label>
                        <input
                            class="text-white text-sm bg-dark-gray placeholder-light-gray w-72 h-8 mr-2 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
                            type="text" id="doctor" v-model="expenseInfo.price" placeholder="Prix :">
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

                    <div v-for="expense in expenses" :key="expense.id">
                        <div class="mt-5">
                            <div class="flex mt-1">
                                <div class="text-light-gray mr-2">Titre:</div>
                                <div class="text-white">{{ expense.title }}</div>
                            </div>
                            <div class="flex mt-1">
                                <div class="text-light-gray mr-2">Prix:</div>
                                <div class="text-white">{{ expense.price }} €</div>
                            </div>
                            <div class="flex mt-1">
                                <div class="flex text-light-gray text-sm mr-2">Description:</div>
                                <div class="text-white text-sm">{{ expense.description }}</div>
                            </div>
                            <button class="mt-2" @click="deleteExpense(expense.id)">
                                <IconSubmenuDeleteFolder class="w-5 h-5 transition-transform transform hover:scale-110"
                                    color="#553348" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
    
<script>
import axios from 'axios'
import { BASE_URL } from '../constants.js'

export default {
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
    setup() {
        definePageMeta({
            middleware: ['auth'],
        });
    },
    methods: {
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

                const response = await axios.post(`${BASE_URL}/expenses`, this.expenseInfo, { headers });

                if (response.status === 201) {
                    console.log("Enregistrement d'une nouvelle dépense'.")
                    this.getAllExpenses();
                    this.resetExpenseInfo();
                } else {
                    console.error("Échec de l'enregistrement d'une nouvelle dépense.");
                }
            } catch (error) {
                console.error("Erreur lors de la soumission d'une nouvelle dépense:", error);
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

                const response = await axios.get(`${BASE_URL}/expenses`, { headers });
                console.log('date', response.data)
                if (response.status === 200) {
                    this.expenses = response.data;
                    this.expenses.sort((a, b) => b.price - a.price);
                    this.total = this.calculateTotal();
                } else {
                    console.error("Échec de la récupération des dépenses.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des dépenses :", error);
            }
        },

        async deleteExpense(expenseId) {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.delete(`${BASE_URL}/expenses/${expenseId}`, { headers });

                if (response.status === 200) {
                    console.log("Dépense supprimée avec succès.");
                    this.getAllExpenses();
                } else {
                    console.error("Échec de la suppression de la dépense.");
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de la dépense :", error);
            }
        },
        calculateTotal() {
            return this.expenses.reduce((total, expense) => total + parseFloat(expense.price), 0);
        },
    },
    mounted() {
        this.getAllExpenses();
    },
};
</script>
    
<style></style>