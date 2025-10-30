<template>
  <header>
    <div class="header-area">
      <div id="sticky-header" class="main-header-area">
        <div class="container-fluid p-0">
          <div class="row align-items-center no-gutters">
            <div class="col-xl-5 col-lg-5">
              <div class="main-menu d-none d-lg-block">
                <nav>
                  <ul id="navigation">
                    <li>
                      <RouterLink to="/" class="active">home</RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/menu">Menu</RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/about">About</RouterLink>
                    </li>
                    <li>
                      <a href="#">
                        blog <i class="ti-angle-down"></i>
                      </a>
                      <ul class="submenu">
                        <li>
                          <RouterLink to="/blog">blog</RouterLink>
                        </li>
                        <li>
                          <RouterLink to="/single-blog">single-blog</RouterLink>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">
                        Pages <i class="ti-angle-down"></i>
                      </a>
                      <ul class="submenu">
                        <li>
                          <RouterLink to="/elements">elements</RouterLink>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <RouterLink to="/contact">Contact</RouterLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div class="col-xl-2 col-lg-2">
              <div class="logo-img">
                <RouterLink to="/">
                  <img src="/img/logo.png" alt="Burger Master Logo" />
                </RouterLink>
              </div>
            </div>
            <div class="col-xl-5 col-lg-5 d-none d-lg-block">
              <div class="book_room">
                <div class="socail_links">
                  <ul>
                    <li>
                      <a href="#">
                        <i class="fa fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i class="fa fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i class="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i class="fa fa-google-plus"></i>
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="book_btn d-none d-xl-block">
                  <a class="#" href="#">+10 367 453 7382</a>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="mobile_menu d-block d-lg-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* Los estilos ya están incluidos en el CSS global del template */
</style>
