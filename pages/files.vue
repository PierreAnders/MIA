<template>
  <div class="bg-image px-8 pt-12 min-h-screen">
    <BurgerMenu />
    <ul>
      <li v-for="file in fileList" :key="file" class="text-white flex items-center justify-between border border-gray-300 rounded-md p-4 mb-2 mx-8">
        <span>{{ file }}</span>
        <div class="space-x-2">
          <button @click="deleteFile(file)" class="bg-slate-500 text-white px-2 py-1 rounded hover:bg-slate-600 transition duration-300">Supprimer</button>
          <button @click="downloadFile(file)" class="bg-slate-500 text-white px-2 py-1 rounded hover:bg-slate-600 transition duration-300">Télécharger</button>
        </div>
      </li>
    </ul>
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
        .delete(`http://localhost:5000/delete_user_file/${filename}`)
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

<style>
.bg-image {
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("~/assets/space-background.jpg");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
</style>