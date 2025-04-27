<template>
    <ion-page>
  
      <ion-header translucent>
        <ion-toolbar>
          <ion-title>Játékos kereső (időpontra)</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="openCreateModal">
              Új esemény
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content fullscreen class="ion-padding">
  
        <!-- Ha nincs semmi slot -->
        <div v-if="slots.length === 0" class="ion-text-center ion-padding">
          <h2>Nincs elérhető esemény.</h2>
          <p>Hozz létre egy új játékot az "Új esemény" gombbal!</p>
        </div>
  
        <!-- Események listája -->
        <ion-list v-else>
          <ion-card v-for="slot in slots" :key="slot.$id" class="slot-card">
            <ion-card-header>
              <ion-card-title>🎲 {{ slot.game_name }}</ion-card-title>
              <ion-card-subtitle>{{ formatDate(slot.time) }}</ion-card-subtitle>
            </ion-card-header>
  
            <ion-card-content>
              <div class="players-row">
                <ion-badge :color="slot.players.length >= slot.max_players ? 'danger' : 'primary'">
                  {{ slot.players.length }}/{{ slot.max_players }} fő
                </ion-badge>
  
                <div>
                  <ion-button
                    v-if="slot.players.length < slot.max_players && !isJoined(slot)"
                    size="small"
                    @click="joinSlot(slot)"
                  >
                    Csatlakozás
                  </ion-button>
  
                  <ion-button
                    v-else-if="isJoined(slot)"
                    size="small"
                    disabled
                    color="success"
                  >
                    Jelentkeztél
                  </ion-button>
  
                  <ion-badge v-else color="danger">
                    Betelt
                  </ion-badge>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        </ion-list>
  
        <!-- Új esemény létrehozó modal -->
        <ion-modal :is-open="showCreateModal" @didDismiss="closeCreateModal">
          <ion-header>
            <ion-toolbar>
              <ion-title>Új játék esemény</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="closeCreateModal">Bezár</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
  
          <ion-content class="ion-padding">
            <ion-item>
              <ion-label position="stacked">Játék neve</ion-label>
              <ion-input v-model="newGameName" placeholder="Pl. Catan, Uno..."></ion-input>
            </ion-item>
  
            <ion-item>
              <ion-label position="stacked">Időpont</ion-label>
              <ion-datetime v-model="newGameTime" presentation="date-time"></ion-datetime>
            </ion-item>
  
            <ion-item>
              <ion-label position="stacked">Max. játékos</ion-label>
              <ion-input type="number" v-model.number="newMaxPlayers" placeholder="Pl. 4"></ion-input>
            </ion-item>
  
            <ion-button expand="full" class="ion-margin-top" color="success" @click="createSlot">
              Esemény létrehozása
            </ion-button>
          </ion-content>
        </ion-modal>
  
      </ion-content>
  
    </ion-page>
  </template>
  
  <script>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonModal, IonInput, IonDatetime, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButtons } from '@ionic/vue';
  import { Databases, ID, Query } from 'appwrite';
  import { appw, config } from '@/appwrite';
  
  export default {
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonModal, IonInput, IonDatetime, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButtons },
    data() {
      return {
        slots: [],
        myNick: '',
        showCreateModal: false,
        newGameName: '',
        newGameTime: '',
        newMaxPlayers: 4
      }
    },
    async mounted() {
      this.myNick = localStorage.getItem('nick') || `Vendég-${Math.floor(Math.random() * 10000)}`;
      await this.ensureTestSlot();
      await this.fetchSlots();
    },
    methods: {
      async fetchSlots() {
        const database = new Databases(appw);
        try {
          const now = new Date().toISOString();
          const result = await database.listDocuments(config.mobil_db, config.game_slots_collection, [
            Query.greaterThan('time', now),
            Query.orderAsc('time')
          ]);
          this.slots = result.documents;
        } catch (error) {
          console.error('Slot lekérés hiba:', error);
        }
      },
      async ensureTestSlot() {
        const database = new Databases(appw);
        try {
          const now = new Date().toISOString();
          const result = await database.listDocuments(config.mobil_db, config.game_slots_collection, [
            Query.greaterThan('time', now)
          ]);
  
          if (result.total === 0) {
            await database.createDocument(
              config.mobil_db,
              config.game_slots_collection,
              ID.unique(),
              {
                game_name: 'Catan',
                time: new Date(new Date().getTime() + 3600 * 1000).toISOString(),
                players: [],
                max_players: 4
              }
            );
          }
        } catch (error) {
          console.error('Teszt slot létrehozás hiba:', error);
        }
      },
      async joinSlot(slot) {
        if (slot.players.includes(this.myNick)) {
          alert('Már jelentkeztél erre az eseményre!');
          return;
        }
        if (slot.players.length >= slot.max_players) {
          alert('Ez az esemény már betelt.');
          return;
        }
        const database = new Databases(appw);
        try {
          await database.updateDocument(config.mobil_db, config.game_slots_collection, slot.$id, {
            players: [...slot.players, this.myNick]
          });
          await this.fetchSlots();
        } catch (error) {
          console.error('Csatlakozás hiba:', error);
        }
      },
      isJoined(slot) {
        return slot.players.includes(this.myNick);
      },
      openCreateModal() {
        this.showCreateModal = true;
      },
      closeCreateModal() {
        this.showCreateModal = false;
        this.newGameName = '';
        this.newGameTime = '';
        this.newMaxPlayers = 4;
      },
      async createSlot() {
        if (!this.newGameName || !this.newGameTime || !this.newMaxPlayers) {
          alert('Minden mezőt ki kell tölteni!');
          return;
        }
        const database = new Databases(appw);
        try {
          await database.createDocument(config.mobil_db, config.game_slots_collection, ID.unique(), {
            game_name: this.newGameName,
            time: this.newGameTime,
            players: [this.myNick],
            max_players: this.newMaxPlayers
          });
          alert('✅ Új esemény létrehozva!');
          this.closeCreateModal();
          await this.fetchSlots();
        } catch (error) {
          console.error('Esemény létrehozás hiba:', error);
        }
      },
      formatDate(dateString) {
        const options = { dateStyle: 'medium', timeStyle: 'short' };
        return new Date(dateString).toLocaleString(undefined, options);
      }
    }
  }
  </script>
  
  <style scoped>
  .slot-card {
    margin-bottom: 12px;
  }
  .players-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  h2 {
    margin: 0;
  }
  p {
    margin: 2px 0;
  }
  </style>
  