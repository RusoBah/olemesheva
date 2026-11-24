<script setup lang="ts">
import { useContactForm } from '../../composables/useContactForm'

const { phone, busy, status, submit } = useContactForm()
</script>

<template>
<form id="feedback-form" action="/send.php" method="POST" novalidate @submit.prevent="submit">
   <input type="hidden" name="csrf_token" value="">
   <input type="hidden" name="privacy_consent_version" value="2026-07-23-v1">
   <div class="feedback-form__honeypot" aria-hidden="true">
      <label for="feedback-company">Компания</label>
      <input type="text" id="feedback-company" name="company" tabindex="-1" autocomplete="off">
   </div>
   <div class="row">
      <div class="col-lg-6">
         <div class="contact__from-input">
            <label class="visually-hidden" for="feedback-name">Ваше имя</label>
            <input type="text" id="feedback-name" name="name" placeholder="Ваше имя *" autocomplete="name" maxlength="100" required>
         </div>
      </div>
<div class="col-lg-6">
         <div class="contact__from-input">
            <label class="visually-hidden" for="feedback-phone">Телефон</label>
            <input type="tel" id="feedback-phone" ref="phone" name="tel" placeholder="Телефон *" inputmode="tel" autocomplete="tel" maxlength="25" required>
         </div>
      </div>
      <div class="col-lg-12">
         <div class="contact__from-input">
            <label class="visually-hidden" for="feedback-email">Электронная почта</label>
            <input type="email" id="feedback-email" name="email" placeholder="Почта" autocomplete="email" maxlength="254">
         </div>
      </div>
      <div class="col-lg-12">
         <div class="contact__from-input">
            <label class="visually-hidden" for="feedback-message">Кратко опишите запрос</label>
            <textarea name="message" id="feedback-message" placeholder="Кратко опишите запрос (без медицинских данных)" maxlength="2000" aria-describedby="feedback-message-hint"></textarea>
            <small id="feedback-message-hint">Не указывайте диагнозы и иные сведения о здоровье — детали можно обсудить лично.</small>
         </div>
      </div>
      <div class="col-lg-12">
         <div class="feedback-form__consent">
            <input type="checkbox" id="feedback-consent" name="privacy_consent" value="1" required>
            <label for="feedback-consent">
               Я свободно и добровольно даю
               <a class="feedback-form-policy__href" href="/personal-data-consent.html" target="_blank" rel="noopener">согласие на обработку персональных данных</a>
               для ответа на обращение и подтверждаю ознакомление с
               <a class="feedback-form-policy__href" href="/privacy-policy.html" target="_blank" rel="noopener">политикой обработки персональных данных</a>.
            </label>
         </div>
      </div>
      <div class="col-12">
         <div class="appointment__btn">
            <button class="fill-btn secondary feedback-form__button" type="submit" :disabled="busy" :aria-busy="busy || undefined">
               <span class="fill-btn-inner">
                  <span class="feedback-form__submit fill-btn-normal">{{ busy ? 'Отправка...' : 'Отправить' }}<i v-if="!busy"
                        class="fa-regular fa-angle-right"></i></span>
                  <span class="fill-btn-hover">Нажать<i
                        class="fa-regular fa-angle-right"></i></span>
               </span>
            </button>
         </div>
      </div>
      <div class="col-12">
         <p class="feedback-form__status" role="status" aria-live="polite">{{ status }}</p>
      </div>
   </div>
</form>
</template>
