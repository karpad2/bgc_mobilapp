<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Board Game Café</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar @ionInput="handleInput($event)" animated="true" placeholder="Keresés (min 3 karakter)"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      

      <div id="container">
        <Tablazat :fuzzykeres="fuzzykeres" />
      </div>
      
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonSearchbar,IonButton, useBackButton, useIonRouter     } from '@ionic/vue';
import { App } from '@capacitor/app';
import axios from 'axios';
import Fuse from 'fuse.js';
import Tablazat from '@/components/Tablazat.vue';
import jatekaink from "@/data/jatekaink.json";

import {Client,Databases,ID,Storage,Query,Account } from "appwrite";
import {appw,config} from "@/appwrite";

export default{
  components:{IonContent, IonHeader, IonPage, IonTitle, IonToolbar,Tablazat,IonSearchbar,IonButton  },
  data()
  {
    return{
      collection:[],
      fuzzykeres:[],
      fuseOptions:{},
      searchpattern:"",
      loaded:false
    }
  },
  setup() {
    const ionRouter = useIonRouter();
    useBackButton(-1, () => {
      if (!ionRouter.canGoBack()) {
        App.exitApp();
      }
    })
  },

  mounted()
  {
   //axios.get()
   this.query();
   //this.collection=jatekaink;
   //console.log(this.collection);

   this.fuseOptions = {
	// isCaseSensitive: false,
	// includeScore: false,
	// ignoreDiacritics: false,
	// shouldSort: true,
	// includeMatches: false,
	// findAllMatches: false,
	// minMatchCharLength: 1,
	// location: 0,
	 threshold: 0.4,
	// distance: 100,
	// useExtendedSearch: false,
	// ignoreLocation: false,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [
		"name"
	]
  
};


  },
  methods:{
    async query()
    {
      const storage = new Storage(appw);
      let k=storage.getFileDownload(config.Files, config.jatekok_db);
      let l=await axios.get(k);
      console.log(l.data);
      //let url="https://boardgamecafe.hu/jatekaink.json";
      let content =l.data;
      this.collection=content;
      //console.log(content);
      //this.collection=k;
    },
    async keres()
    { 
      
      this.loaded=false;
      this.fuzzykeres=[];
      
      const fuse= new Fuse(this.collection,this.fuseOptions);
      this.fuzzykeres=await fuse.search(this.searchpattern);
      console.log(this.fuzzykeres);
      this.loaded=true;
    },
    handleInput(event) {
      //console.log(event);
      const query = event.target.value.toLowerCase();
      this.searchpattern=query;
      if(this.searchpattern.length>3)
       this.keres();
    },
    async link_upload()
    {
      console.log("started")
      const database = new Databases(appw);
      await this.collection.forEach(async element => {
        let k = await database.createDocument(config.mobil_db,config.jatekok_db,ID.unique(),{
          id:element.id,
          name:element.name,
          year:element.year,
          thumbnail:element.thumbnail,
          comment:element.comment,
          min_players:element.min_players,
          max_players:element.max_players,
          rating:element.rating
        });
      });
      console.log("finished")
    }
    
  }
}
</script>

<style scoped>

.image{
  
  width: 52pt;
}
</style>
