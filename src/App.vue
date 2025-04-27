<template>
  <ion-app>
    <Index style="padding-top: 16px;"></Index>
  </ion-app>
</template>

<script>
import { IonApp,useIonRouter,useBackButton } from '@ionic/vue';
import Index from "@/views/Index.vue"
export default {
  name: 'App',
  components: {
    IonApp,Index
  },
  setup() {
      const ionRouter = useIonRouter();
      useBackButton(-1, () => {
        if (!ionRouter.canGoBack()) {
          App.exitApp();
        }
      });
    },
}
</script>

<style>
/* Itt jön be az összes alapstílus globálisan */
@import '@ionic/vue/css/core.css';
@import '@ionic/vue/css/normalize.css';
@import '@ionic/vue/css/structure.css';
@import '@ionic/vue/css/typography.css';
@import '@ionic/vue/css/padding.css';
@import '@ionic/vue/css/float-elements.css';
@import '@ionic/vue/css/text-alignment.css';
@import '@ionic/vue/css/text-transformation.css';
@import '@ionic/vue/css/flex-utils.css';
@import '@ionic/vue/css/display.css';

/* Saját színek, theme */
@import '@/theme/variables.css';
</style>