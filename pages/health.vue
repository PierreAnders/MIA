<template>
    <div class="bg-image px-8 pt-12 min-h-screen">
      <BurgerMenu />
      <h1>Informations de santé</h1>
      <form @submit.prevent="submitHealthInfo">
        <div>
          <label class="text-white" for="gender">Genre</label>
          <input class="text-black" type="text" id="gender" v-model="healthInfo.gender">
        </div>
        <div>
          <label class="text-white" for="weight">Poids</label>
          <input class="text-black" type="text" id="weight" v-model="healthInfo.weight">
        </div>
        <div>
          <label class="text-white" for="size">Taille</label>
          <input class="text-black" type="text" id="size" v-model="healthInfo.size">
        </div>
        <div>
          <label class="text-white" for="social_security_number">Numéro de sécurité sociale</label>
          <input class="text-black" type="text" id="social_security_number" v-model="healthInfo.social_security_number">
        </div>
        <div>
          <label class="text-white" for="blood_group">Groupe sanguin</label>
          <input class="text-black" type="text" id="weblood_groupight" v-model="healthInfo.blood_group">
        </div>
        <div>
          <label class="text-white" for="doctor">Docteur</label>
          <input class="text-black" type="text" id="doctor" v-model="healthInfo.doctor">
        </div>
        <button class="text-white" type="submit">Enregistrer</button>
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
        healthInfo: {
          gender: "",
          weight: "",
          size: "",
          social_security_number: "",
          blood_group: "",
          doctor: "",
        }
      };
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
  
          const response = await axios.post("http://localhost:5000/user_health", this.healthInfo, { headers });
  
          if (response.status === 201) {
            this.$router.push("/chat");
          } else {
            console.error("Échec de l'enregistrement des informations de santé.");
          }
        } catch (error) {
          console.error("Erreur lors de la soumission des informations de santé:", error);
        }
      }
    }
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
  