import { createHead } from '@unhead/vue'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.postcss'

const head = createHead()

const app = createApp(App)

app.use(head)

app.mount('#app')
