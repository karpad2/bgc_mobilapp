<template>
    <ion-page>
  
      <ion-header translucent>
        <ion-toolbar>
          <ion-title>Asztal Foglalás</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content fullscreen class="ion-padding">
  
        <ion-list>
  
          <ion-item>
            <ion-label position="stacked">Név</ion-label>
            <ion-input v-model="name" placeholder="Pl. Kiss Péter"></ion-input>
          </ion-item>
  
          <ion-item>
            <ion-label position="stacked">Hány főre?</ion-label>
            <ion-input type="number" v-model.number="persons" placeholder="Pl. 4"></ion-input>
          </ion-item>
  
          <ion-item>
            <ion-label position="stacked">Foglalás kezdete (nap + idő)</ion-label>
            <ion-datetime v-model="bookingTime" presentation="date-time"></ion-datetime>
          </ion-item>
  
          <ion-button expand="full" class="ion-margin-top" color="success" @click="createBooking">
            Foglalás elküldése
          </ion-button>
  
        </ion-list>
  
      </ion-content>
  
    </ion-page>
  </template>
  
  <script>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton } from '@ionic/vue';
  import { Databases, ID, Query } from 'appwrite';
  import { appw, config } from '@/appwrite';
  
  export default {
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton },
    data() {
      return {
        name: '',
        persons: '',
        bookingTime: ''
      }
    },
    methods: {
      async createBooking() {
        if (!this.name || !this.persons || !this.bookingTime) {
          alert('Minden mezőt kötelező kitölteni!');
          return;
        }
  
        const arrivalTime = new Date(this.bookingTime);
        const leavingTime = new Date(arrivalTime);
        leavingTime.setHours(leavingTime.getHours() + 3);
  
        const closingTime = new Date(arrivalTime);
        closingTime.setDate(closingTime.getDate() + 1);
        closingTime.setHours(0, 0, 0, 0);
        if (leavingTime > closingTime) {
          leavingTime.setTime(closingTime.getTime());
        }
  
        const database = new Databases(appw);
  
        try {
          // 1. Asztalok lekérdezése a megfelelő főre
          const tablesResult = await database.listDocuments(config.mobil_db, config.tables_collection, [
            Query.greaterThanEqual('max_persons', this.persons),
            Query.orderAsc('max_persons')
          ]);
  
          if (tablesResult.total === 0) {
            alert('❌ Sajnos nincs megfelelő asztal.');
            return;
          }
  
          // 2. Végigmegyünk az asztalokon, és megnézzük szabad-e
          for (const table of tablesResult.documents) {
            const bookingsResult = await database.listDocuments(config.mobil_db, config.table_booking_collection, [
              Query.equal('table_number', table.table_number),
              Query.lessThan('time', leavingTime.toISOString()),
              Query.greaterThan('until_time', arrivalTime.toISOString())
            ]);
  
            if (bookingsResult.total === 0) {
              // SZABAD az asztal ebben az időablakban
              await database.createDocument(
                config.mobil_db,
                config.table_booking_collection,
                ID.unique(),
                {
                  table_number: table.table_number,
                  name: this.name,
                  persons: this.persons,
                  time: arrivalTime.toISOString(),
                  until_time: leavingTime.toISOString()
                }
              );
  
              alert(`✅ Foglalás sikeresen elküldve! Asztal száma: ${table.table_number}`);
              this.name = '';
              this.persons = '';
              this.bookingTime = '';
              return;
            }
          }
  
          alert('❌ Sajnos nincs szabad asztal ebben az időpontban.');
  
        } catch (error) {
          console.error('Foglalás hiba:', error);
          alert('❌ Hiba történt a foglalás során.');
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .ion-padding {
    padding: 16px;
  }
  </style>
  