<script setup lang="ts">
import ContactForm from '../ui/ContactForm.vue'
</script>

<template>
<div class="appointment-form-area theme-bg-6 p-relative">
      <div class="container">
        <div class="row g-5 align-items-end justify-content-between">
               <div class="col-xxl-12 co-xl-12 col-lg-12">
                     <h2 class="slider-title-2 text-center">Записаться на прием</h2>
               </div>
            </div>
         <div class="row">
            <div class="col-xxl-6 col-xl-6 col-lg-6">
            <div class="banner-card wow fadeIn quote-animation" data-wow-delay=".3s">
                     <div class="whatsapp-buttonn">
                        <span><img src="/assets/imgs/whatsapp.png" alt="whatsapp.png"></span>
                     </div>
                     <div class="banner-card-text">
                        <h4><a target="_blank" href="https://wa.me/79152652051">WhatsApp</a></h4>
                        <p><a target="_blank" href="https://wa.me/79152652051">Написать в WhatsApp</a></p>
                     </div>
                  </div>
            <div class="banner-card wow fadeIn quote-animation" data-wow-delay=".6s">
                     <div class="telegram-button">
                        <span><img src="/assets/imgs/telegram.png" alt="telegram.png"></span>
                     </div>
                     <div class="banner-card-text">
                        <h4><a target="_blank" href="https://t.me/lemksen">Telegram</a></h4>
                        <p><a target="_blank" href="https://t.me/lemksen">Написать в Telegram </a></p>
                     </div>
                  </div>
            <div class="banner-card wow fadeIn quote-animation" data-wow-delay=".9s">
                     <div class="max-button">
                        <span><img src="/assets/imgs/max.png" alt="max.png"></span>
                     </div>
                     <div class="banner-card-text">
                        <h4><a target="_blank" href="https://max.ru/u/f9LHodD0cOKGZ823IxiIA9V5Pw5I82vM7UK-5cU0yB_XMWO_k50z_INp9sQ">MAX</a></h4>
                        <p><a target="_blank" href="https://max.ru/u/f9LHodD0cOKGZ823IxiIA9V5Pw5I82vM7UK-5cU0yB_XMWO_k50z_INp9sQ">Написать в MAX</a></p>
                     </div>
                  </div>
            <div class="banner-card wow fadeIn quote-animation" data-wow-delay="1.2s">
                     <div class="email-button">
                        <span><img src="/assets/imgs/why/icon-03.png" alt="icon-03.png"></span>
                     </div>
                     <div class="banner-card-text">
                        <h4><a target="_blank" href="mailto:lemeshevaoksik@gmail.com">Email</a></h4>
                        <p><a target="_blank" href="mailto:lemeshevaoksik@gmail.com">lemeshevaoksik@gmail.com</a></p>
                     </div>
                  </div>
            <div class="banner-card wow fadeIn quote-animation" data-wow-delay="1.5s">
                     <div class="banner-card-icon">
                        <span><img src="/assets/imgs/svg/rating-rate.svg" alt="rating-rate.svg"></span>
                     </div>
                     <div class="banner-card-text">
                        <h4><a target="_blank" href="/assets/download/contract.pdf">Договор</a></h4>
                        <p><a target="_blank" href="/assets/download/contract.pdf">Скачать договор</a></p>
                     </div>
                  </div>
            </div>
            <div class="col-xxl-6 col-xl-6 col-lg-6">
               <div class="appointment-input-wrapper section-space">
<div id="contact-form-app"><ContactForm /></div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
