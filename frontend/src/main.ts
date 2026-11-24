import { createSSRApp } from 'vue'
import ContactForm from './components/ui/ContactForm.vue'

const formRoot = document.getElementById('contact-form-app')
if (formRoot) createSSRApp(ContactForm).mount(formRoot)
