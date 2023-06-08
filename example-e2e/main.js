import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import storeConfig from './store'

const store = createStore(storeConfig)
const app = createApp(App)

app.use(store)
app.mount('#app')

// eslint-disable-next-line no-underscore-dangle
window.__store__ = store

// Set to dark mode...
document.documentElement.style.setProperty('--theme', 'dark')
document.documentElement.classList.add('dark')
