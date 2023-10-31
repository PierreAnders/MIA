<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex justify-center items-center pt-8">
            <h1 class="text-light-gray tracking-wider pr-3">{{ folderName.toUpperCase() }}</h1>
            <img src="~/assets/images/folder-title.svg" alt="documents icon">
        </div>
        <ul class="flex flex-col w-3/4 md:w-2/3 lg:w-1/2 mx-auto mb-8 mt-12 ">
            <li v-for="file in fileList" :key="file" class="flex flex-col md:flex-row justify-between text-white mt-6">
                <div class="flex wrap space-x-2">
                    <IconDocument class="opacity-50"/>
                    <span class="text-sm">{{ file }}</span>
                </div>
                <div class="flex flex-nowrap space-x-2 mt-2 md:mt-0 justify-end">
                    <button @click="deleteFile(file)">
                        <IconSubmenuDeleteFolder :color="'#553348'" class="w-5 h-5 md:w-6 md:h-6 transition-transform transform hover:scale-110"/>
                    </button>
                    <button @click="downloadFile(file)">
                        <IconDownload class="w-5 h-5 md:w-6 md:h-6 transition-transform transform hover:scale-110"/>
                    </button>
                    <button @click="openFile(file)">
                        <IconOpen class="w-5 h-5 md:w-6 md:h-6 transition-transform transform hover:scale-110"/>
                    </button>
                </div>
            </li>
        </ul>
        <div class="flex justify-center">
            <div class="flex flex-col justify-center">
                <label for="fileInput" class="text-light-gray">
                    <div id="fileNameLabel" class="flex flex-col cursor-pointer justify-center text-light-gray">
                        <img class="mx-auto w-14 pb-2 transition-transform transform hover:scale-110" src="~assets/images/upload-icon.svg" alt="folder icon">
                        <!-- <div class="transition-transform transform hover:scale-105">Téléverser un fichier</div> -->
                    </div>
                    <input type="file" id="fileInput" ref="fileInput" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                        class="p-2 border rounded-md bg-neutral-300 text-neutral-800 focus:outline-none focus:border-amber-800"
                        @change="uploadFile" style="display: none;" />
                </label>
            </div>
        </div>

    </div>
</template>
  
<script>
import axios from 'axios'
import BurgerMenu from '@/components/BurgerMenu.vue'
import IconSubmenuDeleteFolder from '@/components/IconSubmenuDeleteFolder.vue'
import IconDocument from '@/components/IconDocument.vue'
import IconDownload from '@/components/IconDownload.vue'
import IconOpen from '@/components/IconOpen.vue'
import {BASE_URL} from '../constants.js'

export default {
    components: {
        BurgerMenu,
        IconSubmenuDeleteFolder,
        IconDocument,
        IconDownload,
        IconOpen,
    },

    data() {
        return {
            fileList: [],
            folderName: "",
        };
    },
    created() {
        this.loadFileList();
    },
    methods: {
        loadFileList() {
            const folderName = this.$route.params.folderName;
            if (process.client) {
                const jwtToken = localStorage.getItem('access_token');
                if (!jwtToken) {
                    console.error('Le jeton JWT n\'est pas disponible.');
                    this.$router.push('/');
                    return;
                }

                axios
                    .get(`${BASE_URL}/folders/${folderName}/files`, {
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
        deleteFile(fileName) {
            const jwtToken = localStorage.getItem('access_token');
            if (!jwtToken) {
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            axios
                .delete(`${BASE_URL}/folders/${this.folderName}/files/${fileName}`, {
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
        downloadFile(fileName) {
            const folderName = this.$route.params.folderName;
            const jwtToken = localStorage.getItem('access_token');
            if (!jwtToken) {
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            const axiosConfig = {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                responseType: 'blob',
            };

            axios
                .get(`${BASE_URL}/folders/${folderName}/files/${fileName}`, axiosConfig)
                .then((response) => {
                    const blob = new Blob([response.data]);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => console.error(error));
        },
        openFile(fileName) {
            const folderName = this.$route.params.folderName;
            const jwtToken = localStorage.getItem('access_token');
            if (!jwtToken) {
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            const axiosConfig = {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                responseType: 'arraybuffer',
            };

            axios
                .get(`${BASE_URL}/folders/${folderName}/files/${fileName}`, axiosConfig)
                .then((response) => {
                    const fileType = this.getFileType(fileName);

                    if (fileType === 'pdf') {
                        const blob = new Blob([response.data], { type: 'application/pdf' });
                        const url = window.URL.createObjectURL(blob);
                        const newTab = window.open(url, '_blank');

                        if (newTab === null) {
                            console.error('Le navigateur a bloqué l\'ouverture de la nouvelle fenêtre.');
                            window.URL.revokeObjectURL(url);
                        }
                    } else if (fileType === 'txt') {
                        const textData = new TextDecoder().decode(response.data);
                        this.displayTextFile(textData);
                    } else {
                        console.error('Le type de fichier n\'est pas pris en charge.');
                    }
                })
                .catch((error) => console.error(error));
        },

        getFileType(fileName) {
            // Extract the file extension.
            const parts = fileName.split('.');
            if (parts.length > 1) {
                return parts[parts.length - 1].toLowerCase();
            }
            return '';
        },

        displayTextFile(textData) {
            console.log('Displaying text file content:');
            console.log(textData);
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
                .post(`${BASE_URL}/folders/${folderName}/files`, formData, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    this.loadFileList();
                    fileInput.value = '';
                    console.log(response.data.message);
                })
                .catch((error) => console.error(error));
        },
    },
    mounted() {
        this.folderName = this.$route.params.folderName
    }
};
</script>
  
<style></style>
  