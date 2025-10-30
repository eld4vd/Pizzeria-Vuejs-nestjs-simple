<template>
  <footer class="footer">
    <div class="footer_top">
      <div class="container">
        <div class="row">
          <div class="col-xl-4 col-md-6 col-lg-4">
            <div class="footer_widget text-center">
              <h3 class="footer_title pos_margin">New York</h3>
              <p>
                5th flora, 700/D kings road, <br />
                green lane New York-1782 <br />
                <a href="#">info@burger.com</a>
              </p>
              <a class="number" href="#">+10 378 483 6782</a>
            </div>
          </div>
          <div class="col-xl-4 col-md-6 col-lg-4">
            <div class="footer_widget text-center">
              <h3 class="footer_title pos_margin">California</h3>
              <p>
                5th flora, 700/D kings road, <br />
                green lane New York-1782 <br />
                <a href="#">info@burger.com</a>
              </p>
              <a class="number" href="#">+10 378 483 6782</a>
            </div>
          </div>
          <div class="col-xl-4 col-md-12 col-lg-4">
            <div class="footer_widget">
              <h3 class="footer_title">Stay Connected</h3>
              <form action="#" class="newsletter_form">
                <input type="text" placeholder="Enter your mail" />
                <button type="submit">Sign Up</button>
              </form>
              <p class="newsletter_text">Stay connect with us to get exclusive offer!</p>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-4">
            <div class="socail_links text-center">
              <ul>
                <li>
                  <a href="#">
                    <i class="ti-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i class="ti-twitter-alt"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i class="ti-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i class="fa fa-google-plus"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copy-right_text">
      <div class="container">
        <div class="footer_border"></div>
        <div class="row">
          <div class="col-xl-12">
            <p class="copy_right text-center">
              Copyright &copy;{{ currentYear }} All rights reserved | This template is made with
              <i class="fa fa-heart-o" aria-hidden="true"></i> by
              <a href="https://colorlib.com" target="_blank">Colorlib</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
/* Los estilos ya están incluidos en el CSS global del template */
</style>
