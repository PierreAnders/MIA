<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex items-center justify-center pt-8">
            <h1 class="pr-3 tracking-wider text-light-gray">MD EDITOR</h1>
            <IconProfile :color="'#334155'" />
        </div>
        <div id="app" class="w-3/4 mx-auto mt-12">
            <editor :api-key="TINYMCE_API_KEY" ref="myEditor" :init="initOptions" v-model="textContent" />
        </div>
        <button class="text-white" @click="getHtmlFromEditor">Enregistrer en html</button>
        <button class="text-white" @click="getMarkdownFromEditor">Enregistrer en Markdown</button>
    </div>
</template>
 
<script>
import Editor from '@tinymce/tinymce-vue'
import TurndownService from 'turndown'
import { TINYMCE_API_KEY } from '../constants.js'

export default {
    name: 'app',
    components: {
        'editor': Editor
    },
    data() {
        return {
            textContent: '',
            TINYMCE_API_KEY: TINYMCE_API_KEY,
            initOptions: {
                height: 600,
                menubar: true,
                plugins: [
                    'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
                    'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                    'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar:
                    'undo redo | casechange blocks | bold italic backcolor | \
                                                                alignleft aligncenter alignright alignjustify | \
                                                                bullist numlst checklist outdent indent | removeformat | a11ycheck code table help'
            }
        }
    },
    methods: {
        getHtmlFromEditor() {
           this.textContent
            console.log(this.textContent);
        },
        getMarkdownFromEditor() {
            const turndownService = new TurndownService();
            const markdownContent = turndownService.turndown(this.textContent);
            console.log(markdownContent);
        }
    },
}
</script>