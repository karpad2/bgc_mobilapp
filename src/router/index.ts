import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import IndexPage from '../views/Index.vue';
import EtlapPage from '../views/EtlapPage.vue';
import PlayerMatchingPage from '../views/PlayerMatchingPage.vue';
import TableBookingPage from '../views/TableBookingPage.vue';
import SettingsPage from '../views/SettingsPage.vue';
import Jatekok from '../views/Jatekok.vue';
import QRPage from '../views/QRPage.vue';
import Empty from '@/views/Empty.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/etlap'
  },
  {
    path: '/tabs/',
    component: Empty,
    children: [
      { path: '', component: '/tabs/etlap' },
      { path: 'etlap', component: EtlapPage },
      { path: 'matching', component: PlayerMatchingPage },
      { path: 'jatekok', component: Jatekok },
      { path: 'qr', component: QRPage },
      { path: 'foglalas', component: TableBookingPage },
      { path: 'settings', component: SettingsPage }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
