<template>
  <div class="px-8 pt-12 min-h-screen">
      <BurgerMenu />
      <div class="flex justify-center items-center py-8">
          <h1 class="text-light-gray tracking-wider pr-3">SANTE</h1>
          <IconHealth :color="'#334155'" />
      </div>
    <form @submit.prevent="submitHealthInfo">
      <div class="flex flex-col items-center justify-center mt-6">
        <div class="py-3 flex flex-col">
          <label class="text-gray-300" for="gender">Genre</label>
          <select class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
            id="gender" v-model="healthInfo.gender">
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
        </div>
        <div class="py-3 flex flex-col">
          <label class="text-gray-300" for="weight">Poids (kg)</label>
          <input class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
            type="text" id="weight" v-model="healthInfo.weight" placeholder="Poids (kg)">
        </div>
        <div class="py-3 flex flex-col">
          <label class="text-gray-300" for="size">Taille (m)</label>
          <input class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
            type="text" id="size" v-model="healthInfo.size" placeholder="Taille (m)">
        </div>
        <div class="py-3 flex flex-col">
          <label class="text-gray-300" for="social_security_number">Numéro de sécurité sociale</label>
          <input class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
            type="text" id="social_security_number" v-model="healthInfo.social_security_number"
            placeholder="n° de sécurité sociale">
        </div>
        <div class="py-3 flex flex-col">
          <label class="text-gray-300" for="blood_group">Groupe sanguin</label>
          <input class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
            type="text" id="weblood_groupight" v-model="healthInfo.blood_group" placeholder="Groupe sanguin">
        </div>
        <div class="py-3 flex flex-col">
          <label class="text-gray-300" for="doctor">Docteur</label>
          <input class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
            type="text" id="doctor" v-model="healthInfo.doctor" placeholder="Médecin">
        </div>
        <button
          class="flex items-center h-8 bg-slate-500 text-white mt-4 mb-24 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300"
          type="submit">Enregistrer</button>
      </div>
    </form>
  </div>
</template>
  
<script>
import axios from 'axios';
import BurgerMenu from '~/components/BurgerMenu.vue';
import IconHealth from '~/components/IconHealth.vue';

export default {
  components: {
    BurgerMenu,
    IconHealth,
  },

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

        const response = await axios.post("http://localhost:5000/user_health", this.healthInfo, { headers });

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
  },
  created() {
    this.redirectIfNotConnected();
    this.loadHealthInfo();
  },
};
</script>
  
<style>

</style>