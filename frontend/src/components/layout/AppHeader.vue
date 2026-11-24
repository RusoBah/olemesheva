<script setup lang="ts">
import { navigation } from '../../data/navigation'
</script>

<template>
<header>
      <div id="header-sticky" class="header-area header-2 header-transparent">
         <div class="container-fluid">
            <div class="mega-menu-wrapper">
               <div class="header-main">
                  <div class="header-left">
                     <div class="header-logo">
                        <a href="/">
                           <img src="/assets/imgs/logo/logo.webp" alt="Оксана Лемешева — психоаналитический психолог">
                        </a>
                     </div></div>
                     <div class="mean__menu-wrapper d-none d-lg-block">
                        <div class="main-menu">
                           <nav id="mobile-menu">
<ul>
<li v-for="item in navigation" :key="item.href">
<a :href="item.href">{{ item.label }}</a>
</li>
</ul>
</nav>
                           <!-- for wp -->
                           <div class="header__hamburger ml-50 d-none">
                              <button type="button" class="hamburger-btn offcanvas-open-btn">
                                 <span>01</span>
                                 <span>01</span>
                                 <span>01</span>
                              </button>
                           </div>
                        </div>
                     </div>

                  <div class="header-right d-flex justify-content-end">
                     <div class="header-action d-none d-xxl-inline-flex gap-5">
                   <div class="header-link">
                           <a target="_blank" href="https://t.me/lemksen" class="fill-btn">
                              <span class="fill-btn-inner">
                                 <span class="fill-btn-normal">Telegram</span>
                                 <span class="fill-btn-hover">Telegram</span>
                              </span>
                           </a>
                        </div>
                   <div class="header-link">
                           <a target="_blank" href="https://wa.me/79152652051" class="fill-btn">
                              <span class="fill-btn-inner">
                                 <span class="fill-btn-normal">WhatsApp</span>
                                 <span class="fill-btn-hover">WhatsApp</span>
                              </span>
                           </a>
                        </div>
                   <div class="header-link">
                           <a target="_blank" href="https://max.ru/u/f9LHodD0cOKGZ823IxiIA9V5Pw5I82vM7UK-5cU0yB_XMWO_k50z_INp9sQ" class="fill-btn">
                              <span class="fill-btn-inner">
                                 <span class="fill-btn-normal">MAX</span>
                                 <span class="fill-btn-hover">MAX</span>
                              </span>
                           </a>
                        </div>
                     </div>
                     <div class="header__hamburger d-xl-none">
                        <div class="sidebar__toggle">
                           <a class="bar-icon" href="javascript:void(0)">
                              <span></span>
                              <span>
                                 <small></small>
                              </span>
                              <span></span>
                           </a>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </header>
</template>
