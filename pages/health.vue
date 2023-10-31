<template>
  <div class="min-h-screen px-8 pt-8">
    <BurgerMenu />
    <div class="flex justify-center items-center pt-8">
      <h1 class="text-light-gray tracking-wider pr-3">SANTE</h1>
      <IconHealth :color="'#334155'" />
    </div>
    <form @submit.prevent="submitHealthInfo">
      <div class="flex flex-col items-center justify-center mt-12">

        <div class="pb-4 relative w-72">
          <label class="text-light-gray absolute text-sm px-2 top-1.5 left-2" for="gender">Genre :</label>
          <select
            class="text-white text-right text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
            id="gender" v-model="healthInfo.gender">
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
        </div>

        <div class="pb-4 relative w-72">
          <input
            class="text-white text-right text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
            type="text" id="size" v-model="healthInfo.size" placeholder=". . . . . . .">
          <label class="text-light-gray absolute text-sm px-2 top-1.5 left-2" for="size">Taille (m) :</label>
        </div>

        <div class="pb-4 relative w-72">
          <input
            class="text-white text-right text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
            type="text" id="weight" v-model="healthInfo.weight" placeholder=". . . . . . .">
          <label class="text-light-gray absolute text-sm px-2 top-1.5 left-2" for="weight">Poids (kg) :</label>
        </div>

        <div class="pb-4 relative w-72">
          <input
            class="text-white text-right text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
            type="text" id="social_security_number" v-model="healthInfo.social_security_number"
            placeholder=". . . . . . .">
          <label class="text-light-gray absolute text-sm px-2 top-1.5 left-2" for="social_security_number">N° sécurité
            sociale :</label>
        </div>

        <div class="pb-4 relative w-72">
          <input
            class="text-white text-right text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
            type="text" id="doctor" v-model="healthInfo.doctor" placeholder=". . . . . . .">
          <label class="text-light-gray absolute text-sm px-2 top-1.5 left-2" for="doctor">Docteur :</label>

        </div>

        <div class="pb-4 relative w-72 flex">
          <input
            class="text-white text-right text-sm bg-dark-gray placeholder-light-gray w-72 h-8 px-4 mr-2 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue"
            type="text" id="weblood_groupight" v-model="healthInfo.blood_group" placeholder=". . . . . . .">
          <label class="text-light-gray absolute text-sm px-2 top-1.5 left-1" for="blood_group">Groupe sanguin</label>
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
import { BASE_URL } from '../constants.js'

export default {
  data() {
    return {
      healthInfo: {
        gender: "homme",
        weight: "",
        size: "",
        social_security_number: "",
        blood_group: "",
        doctor: "",
      }
    };
  },
  setup() {
    definePageMeta({
      middleware: ['auth'],
    });
  },
  methods: {
    async submitHealthInfo() {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.error("Jeton JWT non trouvé.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`
        };

        const response = await axios.post(`${BASE_URL}/user_health`, this.healthInfo, { headers });

        if (response.status === 201) {
          console.log("Enregistrement des informations de santé.")
        } else {
          console.error("Échec de l'enregistrement des informations de santé.");
        }
      } catch (error) {
        console.error("Erreur lors de la soumission des informations de santé:", error);
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
  },
  created() {
    this.loadHealthInfo();
  },
};
</script>
  
<style></style>