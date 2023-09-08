<template>
    <div>
      <h1>Téléchargement de fichiers</h1>
      <form @submit.prevent="uploadFile">
        <input type="file" ref="fileInput" accept=".txt, .pdf, .docx" />
        <button type="submit">Télécharger</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    methods: {
      async uploadFile() {
        const fileInput = this.$refs.fileInput;
        const file = fileInput.files[0];
  
        if (!file) {
          alert('Veuillez sélectionner un fichier à télécharger.');
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file);
  
        try {
          const response = await axios.post('http://localhost:5000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
          alert('Fichier téléchargé avec succès.');
        } catch (error) {
  
          alert('Une erreur s\'est produite lors du téléchargement du fichier.');
          console.error(error);
        }
      },
    },
  };
  </script>
  