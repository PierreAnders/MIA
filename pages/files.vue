<template>
    <div>
      <h1>Liste des fichiers téléchargés</h1>
      <ul>
        <li v-for="file in fileList" :key="file">
          {{ file }}
          <button @click="deleteFile(file)">Supprimer</button>
          <button @click="downloadFile(file)">Télécharger</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        fileList: [],
      };
    },
    created() {
      this.loadFileList();
    },
    methods: {
      loadFileList() {
        axios
          .get("http://localhost:5000/list_files")
          .then((response) => {
            this.fileList = response.data.files;
            console.log(this.fileList);
          })
          .catch((error) => console.error(error));
      },
      deleteFile(filename) {
        axios
          .delete(`http://localhost:5000/delete_file/${filename}`)
          .then(() => {
            this.loadFileList();
          })
          .catch((error) => console.error(error));
      },
      downloadFile(filename) {
        const downloadLink = document.createElement('a');
        downloadLink.href = `http://localhost:5000/download_user_file/${filename}`; // Mettez à jour l'URL pour correspondre à votre route de téléchargement
        downloadLink.target = '_blank';
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);

        downloadLink.click();

        document.body.removeChild(downloadLink);
      },
    },
  };
  </script>
  
  <style scoped>
  /* TODO : Installer TAILWIND :) */
  </style>
  