<template>
  <div class="bg-image bg-neutral-900 px-8 pt-12 min-h-screen">
    <h1 class="text-3xl font-semibold text-neutral-100">Liste des fichiers téléchargés</h1>
    <ul>
      <li v-for="file in fileList" :key="file"
        :class="'bg-slate-500 text-neutral-100 bg-opacity-70 p-2 rounded-md mb-2 w-2/3 mx-auto'">
        {{ file }}
        <button @click="deleteFile(file)" class="bg-amber-800 text-white px-2 py-1 ml-2 rounded-md hover:bg-amber-900 transition duration-300">Supprimer</button>
        <button @click="downloadFile(file)" class="bg-slate-500 text-white px-2 py-1 ml-2 rounded-md hover:bg-slate-600 transition duration-300">Télécharger</button>
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
      downloadLink.href = `http://localhost:5000/download_user_file/${filename}`;
      downloadLink.target = '_blank';
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);

      downloadLink.click();

      document.body.removeChild(downloadLink);
    },
  },
};
</script>