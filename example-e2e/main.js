import { createApp } from '@vue/compat'
import { createStore } from 'vuex'
import App from './App.vue'
import storeConfig from './store'

const store = createStore(storeConfig)
const app = createApp(App)

app.use(store)
app.mount('#app')

window.__store__ = store
