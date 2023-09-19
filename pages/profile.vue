<template>
    <div class="bg-image px-8 pt-12 min-h-screen">
      <BurgerMenu />
      <h1>Saisir les informations de l'agent</h1>
      <form @submit.prevent="submitAgentInfo">
        <div>
          <label class="text-white" for="nom">Nom de l'agent</label>
          <input class="text-black" type="text" id="nom" v-model="agentInfo.nom" required>
        </div>
        <div>
          <label class="text-white" for="objectif">Objectif de l'agent</label>
          <input class="text-black" type="text" id="objectif" v-model="agentInfo.objectif">
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
        agentInfo: {
          nom: "",
          objectif: ""
        }
      };
    },
    methods: {
      async submitAgentInfo() {
        try {
          const token = localStorage.getItem("access_token"); // Récupérez le jeton JWT stocké localement
  
          if (!token) {
            console.error("Jetons JWT non trouvés.");
            return;
          }
  
          const headers = {
            Authorization: `Bearer ${token}` // Ajoutez le jeton JWT à l'en-tête de la requête
          };
  
          const response = await axios.post("http://localhost:5000/agent_info", this.agentInfo, { headers });
  
          if (response.status === 201) {
            this.$router.push("/chat");
          } else {
            console.error("Échec de l'enregistrement des informations de l'agent.");
          }
        } catch (error) {
          console.error("Erreur lors de la soumission des informations de l'agent:", error);
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
  