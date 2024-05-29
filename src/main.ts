import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ColorInput from 'vue-color-input'

const app = createApp(App)
// install it with use()
// app.use(ColorInput)

app.component('ColorInput', ColorInput)
app.mount('#app')
