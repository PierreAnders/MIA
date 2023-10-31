<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex justify-center items-center pt-8">
            <h1 class="text-light-gray tracking-wider pr-3">PROFILE</h1>
            <IconProfile :color="'#334155'" />
        </div>
        <form @submit.prevent="updateUserInfo">
            <div class="flex flex-col items-center justify-center mt-12">
                <div class="pb-4 relative w-72">
                    <label class="text-light-gray absolute text-sm px-2 top-1.5 left-2" for="nom">Nom:</label>
                    <input
                        class="text-white text-right text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
                        type="text" id="nom" v-model="userInfo.firstname" placeholder=". . . . . . .">
                </div>
                <div class="pb-4 relative w-72">
                    <label class="text-light-gray absolute text-sm px-2 top-1.5 left-2" for="nom">Prénom:</label>
                    <input
                        class="text-white text-right text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
                        type="text" id="nom" v-model="userInfo.lastname" placeholder=". . . . . . .">
                </div>
                <div class="pb-4 relative w-72">
                    <label class="text-light-gray absolute text-sm px-2 top-1.5 left-2" for="email">Email:</label>
                    <input
                        class="text-white text-right text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
                        type="email" id="email" v-model="userInfo.email" required placeholder=". . . . . . .">
                </div>
                <div class="flex pb-4 relative w-72">
                    <label class="text-light-gray absolute text-sm px-2 top-1.5 left-2" for="nom">Né le :</label>
                    <input
                        class="text-white text-right text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mr-2 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
                        type="date" id="nom" v-model="userInfo.birthDate" placeholder=". . . . . . .">
                    <button type="submit">
                        <IconEnter class="transition-transform transform hover:scale-110" />
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
  
<script>
import axios from 'axios'
import moment from 'moment'
import BurgerMenu from '~/components/BurgerMenu.vue'
import IconProfile from '~/components/IconProfile.vue'
import {BASE_URL} from '../constants.js'

export default {
    components: {
        BurgerMenu,
        IconProfile,
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
        async updateUserInfo() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                await axios.patch(`${BASE_URL}/users/update`, {
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

                const response = await axios.get(`${BASE_URL}/users/info`, { headers });

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
  