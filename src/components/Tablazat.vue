<template>
  <IonGrid>
    <IonRow>
      <IonCol></IonCol>
      <IonCol>Név</IonCol>
      <IonCol>Polckód</IonCol>
      <IonCol>Értékelés</IonCol>
    </IonRow>
    <IonRow v-for="row in fuzzykeres" :key="row.item.id">
      <IonCol>
        <IonImg class="image"
          :src="row.item.thumbnail"
          :alt="row.item.id"
        />
      </IonCol>
      <IonCol>{{ row.item.name }}</IonCol>
      <IonCol>{{ row.item.comment }}</IonCol>
      <IonCol>
        <div class="stars">
          <template v-for="index in 5">
            <span v-if="index <= Math.round(row.item.rating / 2)">★</span>
            <span v-else>☆</span>
          </template>
        </div>
      </IonCol>
    </IonRow>
  </IonGrid>
</template>

<script>
import { IonCol, IonGrid, IonRow, IonImg } from '@ionic/vue';
export default {
  components: { IonCol, IonGrid, IonRow, IonImg },
  props: ["fuzzykeres"]
}
</script>

<style scoped>
.stars {
  color: gold;
  font-size: 1.2em;
}

.image {
  max-width: 96px;
  max-height: 96px;
  object-fit: cover; /* fontos, hogy ne torzuljon */
}
</style>
