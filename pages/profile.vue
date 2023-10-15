<template>
    <div class="bg-image px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <form @submit.prevent="register">
            <div class="flex flex-col items-center justify-center mt-14">
                <div class="py-3">
                    <label class="sr-only" for="nom">Nom:</label>
                    <input class="w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="text" id="nom" v-model="userInfo.firstname" required placeholder="Nom">
                </div>
                <div class="py-3">
                    <label class="sr-only" for="nom">Prénom:</label>
                    <input class="w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="text" id="nom" v-model="userInfo.lastname" required placeholder="Prénom">
                </div>
                <div class="py-3">
                    <label class="sr-only" for="nom">Date de naissance:</label>
                    <input class="w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="date" id="nom" v-model="userInfo.birthDate" required placeholder="Date de naissance">
                </div>
                <div class="py-3">
                    <label class="sr-only" for="email">Email:</label>
                    <input class="w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="email" id="email" v-model="userInfo.email" required placeholder="Adresse mail">
                </div>
                <button
                    class="flex items-center h-8 bg-slate-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300"
                    type="submit">Enregistrer</button>
            </div>
        </form>
    </div>
</template>
  
<script>
import axios from 'axios';
import moment from 'moment';
import BurgerMenu from '~/components/BurgerMenu.vue';

export default {
    components: {
        BurgerMenu,
    },
    data() {
        return {
            userInfo: {
                firstname: '',
                lastname: '',
                birthDate: '',
                email: '',
            }
        };
    },
    methods: {
        async redirectIfNotConnected() {
            if (process.client) {
                this.jwtToken = localStorage.getItem('access_token');
                if (!this.jwtToken) {
                    console.error('Le jeton JWT n\'est pas disponible.');
                    return;
                }
            } else {
                console.error('Le code est exécuté côté serveur (SSR), localStorage n\'est pas disponible.');
            }
        },
        async register() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                await axios.post('http://localhost:5000/user', {
                    firstname: this.userInfo.firstname,
                    lastname: this.userInfo.lastname,
                    birth_date: this.userInfo.birthDate,
                    email: this.userInfo.email,
                }, { headers });
                console.log(this.userInfo.birthDate)

            } catch (error) {
                // Gérez les erreurs d'inscription ici
                console.error('Erreur d\'inscription :', error);
            }
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
                    this.updateFormattedBirthDate(); // Appel à la méthode pour formater la date
                    console.log(this.userInfo)
                } else {
                    console.error("Échec de la récupération des données de l'utilisateur.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
            }
        },
        updateFormattedBirthDate() {
            this.userInfo.birthDate = moment(this.userInfo.birthDate).format('YYYY-MM-DD');
        },

    },
    created() {
        this.getUserInfo();
        this.redirectIfNotConnected();
    }
};
</script>
  