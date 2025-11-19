<template>
  <footer class="modern-footer">
    <div class="footer-waves">
      <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path d="M0,50 C300,100 500,0 800,50 L800,100 L0,100 Z" fill="#fca100" opacity="0.3"></path>
        <path d="M0,60 C400,20 600,90 1200,40 L1200,100 L0,100 Z" fill="#fca100" opacity="0.5"></path>
        <path d="M0,80 C200,60 400,90 1200,70 L1200,100 L0,100 Z" fill="#fca100"></path>
      </svg>
    </div>
    
    <div class="footer-content">
      <div class="container">
        <div class="row mb-5">
          <!-- Sobre Nosotros -->
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="footer-widget">
              <div class="footer-logo mb-4">
                <span class="flaticon-pizza-1"></span>
                <h3>Restaurante Delicious</h3>
              </div>
              <p class="footer-description">
                Creamos experiencias gastronómicas únicas con ingredientes frescos y recetas tradicionales. 
                Tu pizzería de confianza en Santa Cruz.
              </p>
              <div class="social-links mt-4">
                <a href="#" class="social-link facebook" title="Facebook">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="social-link instagram" title="Instagram">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="social-link twitter" title="Twitter">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="social-link whatsapp" title="WhatsApp">
                  <i class="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Enlaces Rápidos -->
          <div class="col-lg-2 col-md-6 mb-4">
            <div class="footer-widget">
              <h4 class="footer-title">Enlaces</h4>
              <ul class="footer-links">
                <li><router-link to="/">Inicio</router-link></li>
                <li><router-link to="/menu">Menú</router-link></li>
                <li><router-link to="/about">Nosotros</router-link></li>
                <li><router-link to="/services">Servicios</router-link></li>
                <li><router-link to="/contact">Contacto</router-link></li>
              </ul>
            </div>
          </div>

          <!-- Horarios -->
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="footer-widget">
              <h4 class="footer-title">Horarios</h4>
              <ul class="footer-schedule">
                <li>
                  <span class="day">Lunes - Viernes</span>
                  <span class="time">11:00 AM - 11:00 PM</span>
                </li>
                <li>
                  <span class="day">Sábados</span>
                  <span class="time">12:00 PM - 12:00 AM</span>
                </li>
                <li>
                  <span class="day">Domingos</span>
                  <span class="time">12:00 PM - 10:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Contacto -->
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="footer-widget">
              <h4 class="footer-title">Contacto</h4>
              <ul class="footer-contact">
                <li>
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Av. Cristo Redentor #123<br>Santa Cruz, Bolivia</span>
                </li>
                <li>
                  <i class="fas fa-phone-alt"></i>
                  <span>+591 3 123 4567</span>
                </li>
                <li>
                  <i class="fas fa-envelope"></i>
                  <span>info@restaurantedelicious.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="row align-items-center">
            <div class="col-md-6 text-center text-md-left mb-3 mb-md-0">
              <p class="copyright-text mb-0">
                &copy; {{ currentYear }} <strong>Restaurante Delicious</strong>. Todos los derechos reservados.
              </p>
            </div>
            <div class="col-md-6 text-center text-md-right">
              <p class="credits mb-0">
                Desarrollado con <i class="fas fa-heart"></i> por 
                <a href="https://github.com/eld4vd" target="_blank" rel="noopener">El d4vd</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  
  <!-- loader - se oculta automáticamente con main.js -->
  <div id="ftco-loader" class="show fullscreen">
    <svg class="circular" width="48px" height="48px">
      <circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee"/>
      <circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10" stroke="#F96D00"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

onMounted(() => {
  // Asegurar que el loader se oculte después de que Vue monte el componente
  setTimeout(() => {
    const loader = document.getElementById('ftco-loader')
    if (loader) {
      loader.classList.remove('show')
      setTimeout(() => {
        loader.style.display = 'none'
      }, 300)
    }
  }, 500)
})
</script>

<style scoped>
.modern-footer {
  position: relative;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffffff;
  overflow: hidden;
}

.footer-waves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  transform: translateY(-99%);
}

.footer-waves svg {
  width: 100%;
  height: 100%;
}

.footer-content {
  padding: 80px 0 30px;
  position: relative;
  z-index: 1;
}

/* Footer Logo */
.footer-logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.footer-logo .flaticon-pizza-1 {
  font-size: 48px;
  color: #fca100;
}

.footer-logo h3 {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.footer-description {
  color: #b8b8b8;
  line-height: 1.7;
  font-size: 15px;
}

/* Footer Widgets */
.footer-widget {
  margin-bottom: 20px;
}

.footer-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 15px;
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #fca100, #e85a19);
  border-radius: 2px;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.social-link {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-radius: 50%;
  transition: all 0.3s ease;
  font-size: 18px;
}

.social-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(252, 161, 0, 0.4);
}

.social-link.facebook:hover {
  background: #1877f2;
  color: #ffffff;
}

.social-link.instagram:hover {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: #ffffff;
}

.social-link.twitter:hover {
  background: #1da1f2;
  color: #ffffff;
}

.social-link.whatsapp:hover {
  background: #25d366;
  color: #ffffff;
}

/* Footer Links */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #b8b8b8;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  font-size: 15px;
}

.footer-links a::before {
  content: '▸';
  margin-right: 8px;
  color: #fca100;
  transition: margin 0.3s ease;
}

.footer-links a:hover {
  color: #fca100;
  padding-left: 5px;
}

.footer-links a:hover::before {
  margin-right: 12px;
}

/* Footer Schedule */
.footer-schedule {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-schedule li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-schedule li:last-child {
  border-bottom: none;
}

.footer-schedule .day {
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
}

.footer-schedule .time {
  color: #fca100;
  font-size: 14px;
}

/* Footer Contact */
.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-contact li {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.footer-contact i {
  color: #fca100;
  font-size: 18px;
  min-width: 20px;
  margin-top: 2px;
}

.footer-contact span {
  color: #b8b8b8;
  line-height: 1.6;
  font-size: 15px;
}

/* Footer Bottom */
.footer-bottom {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright-text,
.credits {
  color: #888888;
  font-size: 14px;
}

.credits i {
  color: #e74c3c;
  margin: 0 5px;
  animation: heartbeat 1.5s infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.credits a {
  color: #fca100;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.credits a:hover {
  color: #e85a19;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    padding: 60px 0 20px;
  }

  .footer-title {
    font-size: 18px;
  }

  .footer-logo h3 {
    font-size: 20px;
  }

  .footer-bottom {
    margin-top: 30px;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
