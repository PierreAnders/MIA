<template>
    <svg width="27" height="27" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 5V3C3 2.33333 3.5 1 5.5 1C7.5 1 13.3333 1 16 1C16.6667 1 18 1.5 18 3.5C18 5.5 18 11.3333 18 14C18 14.6667 17.6 16 16 16C14.4 16 8 16 5 16C4.33333 16 3 15.6 3 14C3 12.4 3 11.8333 3 12"
            :stroke="color" stroke-linecap="round" />
        <path d="M1 8.5L14.5 8.5" :stroke="color" stroke-linecap="round" />
        <path d="M10.5 12.5L14.5 8.5" :stroke="color" stroke-linecap="round" />
        <path d="M10.5 4.5L14.5 8.5" :stroke="color" stroke-linecap="round" />
    </svg>
</template>


<script>
export default {
    props: {
        color: String,
    }
}
</script>