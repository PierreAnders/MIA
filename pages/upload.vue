<template>
  <div class="bg-image px-8 pt-12 min-h-screen">
    <BurgerMenu />

    <div class="flex justify-center">
      <form @submit.prevent="uploadFile" class="mb-4">
        <label for="fileInput" class="text-neutral-800">
          <i class="fas fa-upload"></i>
          <span id="fileNameLabel" class="text-white">{{ fileName }}</span>
          <input type="file" id="fileInput" ref="fileInput" accept=".txt, .pdf, .docx"
            class="p-2 border rounded-md bg-neutral-300 text-neutral-800 focus:outline-none focus:border-amber-800"
            @change="updateFileName" style="display: none;" />
        </label>
        <button type="submit"
          class="bg-slate-500 text-white mx-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300">
          Télécharger
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../constants.js'

export default {
  data() {
    return {
      fileName: 'Cliquer ici pour sélectionner un fichier',
      jwtToken: null,
    };
  },
  setup() {
    definePageMeta({
      middleware: ['auth'],
    });
  },
  methods: {
    updateFileName(event) {
      const fileName = event.target.files[0]?.name || 'Cliquer ici pour sélectionner un fichier'
      this.fileName = fileName;
    },
    async uploadFile() {
      this.redirectIfNotConnected();

      const fileInput = this.$refs.fileInput;
      const file = fileInput.files[0];

      if (!file) {
        alert('Veuillez sélectionner un fichier à télécharger.')
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${BASE_URL}/upload`, formData, {
          headers: {
            'Authorization': `Bearer ${this.jwtToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Fichier téléchargé avec succès.');
      } catch (error) {

        alert('Une erreur s\'est produite lors du téléchargement du fichier.');
        console.error(error);
      }
      this.fileName = 'Cliquer ici pour sélectionner un fichier';
    },
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