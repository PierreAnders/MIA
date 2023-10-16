<template>
    <div class="bg-image px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <div class="flex flex-col items-center justify-center mt-6">
            <div class="text-xl font-semibold text-white mb-6">Contenu du Dossier</div>
        </div>

        <div class="flex justify-center">
            <form @submit.prevent="uploadFile" enctype="multipart/form-data" class="mb-4">
                <label for="fileInput" class="text-neutral-800">
                    <i class="fas fa-upload"></i>
                    <span id="fileNameLabel" class="text-white">{{ fileToUpload }}</span>
                    <input type="file" id="fileInput" ref="fileInput" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                        class="p-2 border rounded-md bg-neutral-300 text-neutral-800 focus:outline-none focus:border-amber-800"
                        @change="updateFileToUpload" style="display: none;" />
                </label>
                <button type="submit"
                    class="bg-slate-500 text-white mx-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300">
                    Téléverser
                </button>
            </form>
        </div>

       
        <ul>
            <li v-for="file in fileList" :key="file"
                class="text-white flex items-center justify-between border border-gray-300 rounded-md p-4 mb-2 mx-8">
                <span>{{ file }}</span>
                <div class="space-x-2">
                    <button @click="deleteFile(file)"
                        class="bg-slate-500 text-white px-2 py-1 rounded hover:bg-slate-600 transition duration-300">Supprimer</button>
                    <button @click="downloadFile(file)"
                        class="bg-slate-500 text-white px-2 py-1 rounded hover:bg-slate-600 transition duration-300">Télécharger</button>
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
            fileToUpload: 'Cliquer ici pour sélectionner un fichier',
        };
    },
    created() {
        this.loadFileList();
    },
    methods: {
        updateFileToUpload(event) {
            const fileToUpload = event.target.files[0]?.name || 'Cliquer ici pour sélectionner un fichier';
            this.fileToUpload = fileToUpload;
        },
        loadFileList() {
            const folderName = this.$route.params.folderName; // Récupérez l'ID du dossier depuis l'URL
            if (process.client) {
                const jwtToken = localStorage.getItem('access_token');
                if (!jwtToken) {
                    console.error('Le jeton JWT n\'est pas disponible.');
                    this.$router.push('/');
                    return;
                }

                axios
                    .get(`http://localhost:5000/list_files/${folderName}`, { // Utilisez l'ID du dossier dans la requête
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((response) => {
                        this.fileList = response.data.files;
                        console.log(this.fileList);
                    })
                    .catch((error) => console.error(error));
            } else {
                console.error('Le code est exécuté côté serveur (SSR), localStorage n\'est pas disponible.');
            }
        },

        // Le reste de vos méthodes (deleteFile et downloadFile) reste inchangé

        deleteFile(filename) {
            const folderName = this.$route.params.folderName;
            const jwtToken = localStorage.getItem('access_token'); // Récupérez le jeton JWT
            if (!jwtToken) {
                // Traitez le cas où le jeton JWT n'est pas disponible
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            axios
                .delete(`http://localhost:5000/delete_user_file/${folderName}/${filename}`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                })
                .then(() => {
                    this.loadFileList();
                })
                .catch((error) => console.error(error));
        },
        downloadFile(filename) {
            const folderName = this.$route.params.folderName;
            const jwtToken = localStorage.getItem('access_token'); // Récupérez le jeton JWT
            if (!jwtToken) {
                // Traitez le cas où le jeton JWT n'est pas disponible
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            // Créez une configuration Axios avec le jeton JWT dans les en-têtes
            const axiosConfig = {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                responseType: 'blob', // Spécifiez le type de réponse comme un blob (fichier binaire)
            };

            axios
                .get(`http://localhost:5000/download_user_file/${folderName}/${filename}`, axiosConfig)
                .then((response) => {
                    const blob = new Blob([response.data]);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => console.error(error));
        },
        uploadFile() {
            const folderName = this.$route.params.folderName;
            const jwtToken = localStorage.getItem('access_token');
            if (!jwtToken) {
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            const formData = new FormData();
            const fileInput = this.$refs.fileInput;
            if (fileInput.files.length === 0) {
                console.error('Aucun fichier sélectionné.');
                return;
            }

            formData.append('file', fileInput.files[0]);

            axios
                .post(`http://localhost:5000/upload/${folderName}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'multipart/form-data', // Spécifiez le type de contenu multipart/form-data
                    },
                })
                .then((response) => {
                    this.loadFileList();
                    fileInput.value = ''; // Réinitialisez l'input de fichier
                    console.log(response.data.message);
                })
                .catch((error) => console.error(error));
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
  