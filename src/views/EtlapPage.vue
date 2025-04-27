<template>
    <ion-page>
  
      <ion-header translucent>
        <ion-toolbar>
          <ion-title>Étlap & Itallap</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content fullscreen class="ion-padding">
  
        <!-- Kategória választó -->
        <ion-item>
          <ion-label>Kategória</ion-label>
          <ion-select v-model="selectedCategory" placeholder="Válassz kategóriát">
            <ion-select-option v-for="category in allCategories" :key="category" :value="category">
              {{ category }}
            </ion-select-option>
          </ion-select>
        </ion-item>
  
        <!-- Lista megjelenítése -->
        <ion-list class="ion-margin-top">
          <ion-item v-for="item in filteredItems" :key="item.id" lines="full">
            <ion-thumbnail slot="start" v-if="item.image">
              <img :src="item.image" alt="Kép">
            </ion-thumbnail>
            <ion-label>
              <h2>{{ item.name }}</h2>
              <p>{{ item.price }} Ft</p>
              <p v-if="item.allergens">Allergének: {{ item.allergens }}</p>
            </ion-label>
            <ion-button slot="end" color="primary" @click="addToCart(item)">Kosárba</ion-button>
          </ion-item>
        </ion-list>
  
        <!-- Kosár nézet -->
        <ion-card v-if="cart.length" class="ion-margin-top">
          <ion-card-header>
            <ion-card-title>Kosár</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="(item, index) in cart" :key="index">
                <ion-label>
                  {{ item.name }} ({{ item.amount }} db) - {{ item.price * item.amount }} Ft
                </ion-label>
                <ion-buttons slot="end">
                  <ion-button @click="changeAmount(index, 1)">+</ion-button>
                  <ion-button @click="changeAmount(index, -1)" :disabled="item.amount <= 1">-</ion-button>
                </ion-buttons>
              </ion-item>
            </ion-list>
            <ion-button expand="full" color="success" @click="checkout">
              Rendelés leadása (összesen: {{ totalPrice }} Ft)
            </ion-button>
          </ion-card-content>
        </ion-card>
  
      </ion-content>
  
    </ion-page>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonList, IonThumbnail, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons } from '@ionic/vue';
  
  import { appw, config } from '@/appwrite'; // <-- FONTOS: Appwrite kliens és config
  import { Storage } from 'appwrite';
  
  export default {
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonList, IonThumbnail, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons },
    setup() {
      const selectedCategory = ref('');
      const cart = ref([]);
      const allItems = ref([]);
      const allCategories = ref([]);
  
      // --- Letöltés és feldolgozás ---
      const query = async () => {
        const storage = new Storage(appw);
        const foodUrl = storage.getFileDownload(config.Files, config.etelek);
        const drinkUrl = storage.getFileDownload(config.Files, config.italok);
  
        const foodResponse = await fetch(await foodUrl);
        const foodData = await foodResponse.json();
        const drinkResponse = await fetch(await drinkUrl);
        const drinkData = await drinkResponse.json();
  
        const flattenMenu = (data, isDrink = false) => {
          let items = [];
          data.forEach(level1 => {
            if (level1.children && level1.children.length) {
              level1.children.forEach(level2 => {
                if (level2.children && level2.children.length) {
                  level2.children.forEach(food => {
                    items.push({
                      id: food.foodNodeKey || food.drinkNodeKey,
                      name: food.name,
                      price: food.price,
                      allergens: food.allergens,
                      image: food.imageCount > 0 ? `https://example.com/image/${food.code}` : null,
                      category: level2.name,
                      type: isDrink ? 'drink' : 'food'
                    });
                  });
                } else {
                  items.push({
                    id: level2.foodNodeKey || level2.drinkNodeKey,
                    name: level2.name,
                    price: level2.price,
                    allergens: level2.allergens,
                    image: level2.imageCount > 0 ? `https://example.com/image/${level2.code}` : null,
                    category: level1.name,
                    type: isDrink ? 'drink' : 'food'
                  });
                }
              });
            }
          });
          return items;
        };
  
        const foods = flattenMenu(foodData);
        const drinks = flattenMenu(drinkData, true);
  
        allItems.value = [...foods, ...drinks];
        allCategories.value = Array.from(new Set(allItems.value.map(item => item.category))).sort();
      };
  
      const filteredItems = computed(() => {
        if (!selectedCategory.value) return [];
        return allItems.value.filter(item => item.category === selectedCategory.value);
      });
  
      const addToCart = (item) => {
        const index = cart.value.findIndex(i => i.id === item.id);
        if (index > -1) {
          cart.value[index].amount++;
        } else {
          cart.value.push({ ...item, amount: 1 });
        }
      };
  
      const changeAmount = (index, diff) => {
        cart.value[index].amount += diff;
        if (cart.value[index].amount <= 0) cart.value.splice(index, 1);
      };
  
      const totalPrice = computed(() => {
        return cart.value.reduce((sum, item) => sum + (item.price * item.amount), 0);
      });
  
      const checkout = () => {
        alert(`✅ Rendelés leadva! Összeg: ${totalPrice.value} Ft`);
        cart.value = [];
      };
  
      // Indításkor betölt
      query();
  
      return {
        selectedCategory,
        allCategories,
        filteredItems,
        cart,
        addToCart,
        changeAmount,
        totalPrice,
        checkout
      };
    }
  }
  </script>
  
  <style scoped>
  img {
    width: 64px;
    height: 64px;
    object-fit: cover;
  }
  </style>
  