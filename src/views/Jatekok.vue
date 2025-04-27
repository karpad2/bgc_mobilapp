<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Játékkereső</ion-title>
        </ion-toolbar>
  
        <ion-toolbar>
          <ion-searchbar
            @ionInput="handleInput($event)"
            :value="searchpattern"
            animated="true"
            placeholder="Írd be a játék nevét..."
            show-clear-button="focus"
            @ionClear="clearSearch"
          ></ion-searchbar>
  
          <div class="category-buttons">
            <ion-button 
              :color="selectedCategory === '2' ? 'primary' : 'medium'"
              @click="selectCategory('2')"
            >
              2 személyes
            </ion-button>
  
            <ion-button 
              :color="selectedCategory === '3-4' ? 'primary' : 'medium'"
              @click="selectCategory('3-4')"
            >
              3-4 személyes
            </ion-button>
  
            <ion-button 
              :color="selectedCategory === '5plus' ? 'primary' : 'medium'"
              @click="selectCategory('5plus')"
            >
              Több személyes
            </ion-button>
  
            <ion-button 
              :color="selectedCategory === null ? 'primary' : 'medium'"
              @click="selectCategory(null)"
            >
              Mind
            </ion-button>
          </div>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div id="container">
          <transition-group name="fade" tag="div">
            <div v-for="row in fuzzykeres" :key="row.item.id" class="card">
              <img :src="row.item.thumbnail" alt="thumbnail" class="thumbnail" />
              <div class="card-content">
                <h2 class="game-title">{{ row.item.name }}</h2>
                <div class="labels">
                  <span class="label">{{ row.item.min_players }}-{{ row.item.max_players }} fő</span>
                  <span class="label">{{ row.item.year }}</span>
                  <span class="label">{{ row.item.comment }}</span>
                </div>
                <div class="stars">
                  <template v-for="index in 5">
                    <span v-if="index <= Math.round(row.item.rating / 2)">★</span>
                    <span v-else>☆</span>
                  </template>
                </div>
              </div>
            </div>
          </transition-group>
  
          <div v-if="loaded && fuzzykeres.length === 0" class="no-results">
            🚫 Nincs találat a keresésre!
          </div>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButton, useBackButton, useIonRouter } from '@ionic/vue';
  import { App } from '@capacitor/app';
  import Fuse from 'fuse.js';
  import { Storage } from "appwrite";
  import { appw, config } from "@/appwrite";
  
  export default {
    components: { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButton },
    data() {
      return {
        collection: [],
        fuzzykeres: [],
        fuseOptions: {},
        searchpattern: "",
        selectedCategory: null,
        loaded: false
      }
    },
   
    mounted() {
      this.query();
      this.fuseOptions = {
        threshold: 0.3,
        keys: ["name"]
      };
    },
    methods: {
      async query() {
        const storage = new Storage(appw);
        const fileUrl = storage.getFileDownload(config.Files, config.jatekok_db);
        const response = await fetch(fileUrl);
        const content = await response.json();
        this.collection = content;
      },
      async keres() {
  this.loaded = false;
  this.fuzzykeres = [];

  let results = [];

  if (this.searchpattern.length > 2) {
    const fuse = new Fuse(this.collection, this.fuseOptions);
    results = await fuse.search(this.searchpattern);

    // 🔥 Ha keresés van, akkor sorbarakjuk találati pontszám szerint
    results.sort((a, b) => a.score - b.score);
  } else {
    results = this.collection.map(item => ({ item }));
  }

  if (this.selectedCategory) {
    results = results.filter(result => {
      const min = result.item.min_players || 0;
      const max = result.item.max_players || 99;
      if (this.selectedCategory === '2') {
        return min === 2 && max === 2;
      } else if (this.selectedCategory === '3-4') {
        return min >= 3 && max <= 4;
      } else if (this.selectedCategory === '5plus') {
        return min >= 5;
      }
      return true;
    });
  }

  this.fuzzykeres = results;
  this.loaded = true;
},
      handleInput(event) {
        this.searchpattern = event.target.value.toLowerCase();
        this.keres();
      },
      selectCategory(category) {
        this.selectedCategory = category;
        this.keres();
      },
      clearSearch() {
        this.searchpattern = "";
        this.keres();
      }
    }
  }
  </script>
  
  <style scoped>
  .category-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 10px;
    gap: 8px;
  }
  
  #container {
    padding: 10px;
  }
  
  .card {
    display: flex;
    background: #f8f8f8; /* világos szürke háttér */
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 12px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    align-items: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .thumbnail {
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: 6px;
    margin-right: 12px;
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .game-title {
    margin: 0;
    font-size: 1.2em;
    color: #222; /* fekete/sötétszürke cím */
  }
  
  .labels {
    margin: 4px 0;
    font-size: 0.9em;
    color: gray;
  }
  
  .label {
    background-color: #e0e0e0;
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 6px;
  }
  
  .stars {
    color: gold;
    font-size: 1.2em;
    margin-top: 4px;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: all 0.4s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  
  .no-results {
    margin-top: 40px;
    text-align: center;
    font-size: 1.2em;
    color: gray;
  }
  </style>
  