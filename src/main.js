import Vue from 'vue'
import Vuex from 'vuex'
// import './plugins/vuetify'
import VueSidebarMenu from 'vue-sidebar-menu'
import App from './App.vue'
import router from './router'
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbvue/build/css/mdb.css';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import store from './store'
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyA2D4zkjHNrWMn0kX_YV8VkezWi9gPMkFQ",
  authDomain: "vnpttg-7c1fc.firebaseapp.com",
  databaseURL: "https://vnpttg-7c1fc.firebaseio.com",
  projectId: "vnpttg-7c1fc",
  storageBucket: "vnpttg-7c1fc.appspot.com",
  messagingSenderId: "885790426721",
  appId: "1:885790426721:web:7f4eeebfcf7fdbe1"
};

firebase.initializeApp(firebaseConfig)

Vue.config.productionTip = false

Vue.use(VueSidebarMenu)
Vue.use(Vuex)
Vue.use(firebase)
console.log('firebase')
// var messaging = firebase.messaging();
// firebase.messaging().usePublicVapidKey("AAAAzj05RmE:APA91bFM0Htyxso9V6P0PquLcvF7dK_HaW-_1ruDf-YBgL3OuTchBggYBM_iYRRzNf-C4bwHyX1JsisqZgWsDqLqK70WvDYoYsCFn5IGzfPsjgXin3v54vR9l--WDkZCifPnoMsHlD-Q");

// messaging.onMessage(function(payload) {
//   console.log('Message received. ', payload);
//   // ...
// });
new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  store: store
})

