<template>
    <ion-page>
  
      <!-- HEADER -->
      <ion-header translucent>
        <ion-toolbar>
          <ion-title href="/">Board Game Café</ion-title>
        </ion-toolbar>
      </ion-header>
      
      

      <!-- TABS rendszer -->
      <ion-tabs>
        
        <!-- OLDALAK -->
        <ion-router-outlet style="margin-top: 32px;"/>
        
        <!-- ALSÓ MENÜ -->
        <ion-tab-bar slot="bottom">
  
          <!-- ÉtLAP -->
          <ion-tab-button tab="etlap" href="/tabs/etlap">
            <ion-icon name="restaurant"></ion-icon>
            <ion-label>Étlap</ion-label>
          </ion-tab-button>
  
          <!-- Player Matching (Játékos kereső) -->
          <ion-tab-button tab="matching" href="/tabs/matching">
            <ion-icon name="people"></ion-icon>
            <ion-label>Játékos kereső</ion-label>
          </ion-tab-button>
  
          <!-- Tabletop Finder (Játékok böngészése) -->
          <ion-tab-button tab="jatekok" href="/tabs/jatekok">
            <ion-icon name="dice-outline"></ion-icon>
            <ion-label>Játékok</ion-label>
          </ion-tab-button>
  
          <!-- QR Olvasó -->
          <ion-tab-button v-if="false" tab="qr" href="/tabs/qr">
            <ion-icon name="qr-code"></ion-icon>
            <ion-label>QR</ion-label>
          </ion-tab-button>
  
          <!-- Foglalás -->
          <ion-tab-button tab="foglalas" href="/tabs/foglalas">
            <ion-icon name="calendar"></ion-icon>
            <ion-label>Foglalás</ion-label>
          </ion-tab-button>
  
          <!-- Beállítások -->
          <ion-tab-button tab="settings" href="/tabs/settings">
            <ion-icon name="settings"></ion-icon>
            <ion-label>Beállítások</ion-label>
          </ion-tab-button>
  
        </ion-tab-bar>
  
      </ion-tabs>
  
    </ion-page>
  </template>
  
  <script>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue';
  
  export default {
    components: {
      IonPage, IonHeader, IonToolbar, IonTitle,
      IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel
    }
  }
  </script>
  