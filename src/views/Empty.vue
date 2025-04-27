<template><RouterView></RouterView></template>
<script>
import { IonApp,IonRouterOutlet } from '@ionic/vue';
import {RouterView } from 'vue-router'
import Index from "@/views/Index.vue"
export default {
  name: 'Empty',
  components: {
    IonApp,Index,RouterView
  }
}
</script>