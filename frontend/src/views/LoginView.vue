<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/index'
import { useToast } from 'vue-toastification'
import axios from '@/plugins/axios'

const toast = useToast()

// Login
const usuario = ref('')
const clave = ref('')
const error = ref(false)

// Registro
const mostrarRegistro = ref(false)
const formRegistro = ref({
  usuario: '',
  clave: '',
  claveConfirm: '',
  nombres: '',
  primerApellido: '',
  segundoApellido: '',
  email: '',
  telefono: '',
  direccion: ''
})
const cargandoRegistro = ref(false)

function onSubmit() {
  const authStore = useAuthStore()
  authStore.login(usuario.value, clave.value).catch(() => (error.value = true))
}

function toggleRegistro() {
  mostrarRegistro.value = !mostrarRegistro.value
  error.value = false
  resetFormRegistro()
}

function resetFormRegistro() {
  formRegistro.value = {
    usuario: '',
    clave: '',
    claveConfirm: '',
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    telefono: '',
    direccion: ''
  }
}

async function registrarAdmin() {
  // Validaciones
  if (!formRegistro.value.usuario.trim()) {
    toast.warning('El usuario es obligatorio')
    return
  }

  if (formRegistro.value.clave.length < 6) {
    toast.warning('La contraseña debe tener al menos 6 caracteres')
    return
  }

  if (formRegistro.value.clave !== formRegistro.value.claveConfirm) {
    toast.error('Las contraseñas no coinciden')
    return
  }

  if (!formRegistro.value.nombres.trim() || !formRegistro.value.primerApellido.trim()) {
    toast.warning('Nombres y primer apellido son obligatorios')
    return
  }

  try {
    cargandoRegistro.value = true
    
    const data = {
      usuario: formRegistro.value.usuario.trim(),
      clave: formRegistro.value.clave,
      nombres: formRegistro.value.nombres.trim(),
      primerApellido: formRegistro.value.primerApellido.trim(),
      segundoApellido: formRegistro.value.segundoApellido.trim() || undefined,
      email: formRegistro.value.email.trim() || undefined,
      telefono: formRegistro.value.telefono.trim() || undefined,
      direccion: formRegistro.value.direccion.trim() || undefined
    }

    await axios.post('/auth/register', data)
    
    toast.success('Administrador registrado exitosamente. Ya puede iniciar sesión.')
    toggleRegistro()
    usuario.value = formRegistro.value.usuario
  } catch (error: any) {
    console.error('Error al registrar:', error)
    const message = error.response?.data?.message || 'Error al registrar el administrador'
    toast.error(Array.isArray(message) ? message.join(', ') : message)
  } finally {
    cargandoRegistro.value = false
  }
}

// Agregar clase al body para ocultar header/footer
onMounted(() => {
  document.body.classList.add('login-page-mode')
})

// Remover clase al salir
onUnmounted(() => {
  document.body.classList.remove('login-page-mode')
})
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card" :class="{ 'expanded': mostrarRegistro }">
        <div class="login-header">
          <span class="flaticon-pizza-1"></span>
          <h1>Restaurante Delicious</h1>
          <p>{{ mostrarRegistro ? 'Registro de Administrador' : 'Panel de Empleados' }}</p>
        </div>

        <!-- Formulario de Login -->
        <form v-if="!mostrarRegistro" class="login-form" @submit.prevent="onSubmit">
          <div class="form-group">
            <label for="usuario" class="form-label">Usuario:</label>
            <input 
              v-model="usuario" 
              id="usuario"
              type="text" 
              class="form-input" 
              placeholder="Ingrese su usuario" 
              autofocus 
              required
            />
          </div>

          <div class="form-group">
            <label for="clave" class="form-label">Contraseña:</label>
            <input 
              v-model="clave" 
              id="clave"
              type="password" 
              class="form-input" 
              placeholder="Ingrese su contraseña" 
              required
            />
          </div>

          <p v-if="error" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            Usuario y/o contraseña incorrectos
          </p>
          
          <button type="submit" class="form-submit">
            <i class="fas fa-sign-in-alt"></i>
            Iniciar Sesión
          </button>

          <div class="divider">
            <span>o</span>
          </div>

          <button type="button" class="btn-register" @click="toggleRegistro">
            <i class="fas fa-user-plus"></i>
            Registrar Nuevo Administrador
          </button>

          <div class="back-home">
            <router-link to="/">
              <i class="fas fa-arrow-left"></i>
              Volver al inicio
            </router-link>
          </div>
        </form>

        <!-- Formulario de Registro -->
        <form v-else class="login-form registro-form" @submit.prevent="registrarAdmin">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="reg-usuario" class="form-label">
                  Usuario <span class="required">*</span>
                </label>
                <input 
                  v-model="formRegistro.usuario" 
                  id="reg-usuario"
                  type="text" 
                  class="form-input" 
                  placeholder="Nombre de usuario" 
                  maxlength="50"
                  required
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="reg-email" class="form-label">Email</label>
                <input 
                  v-model="formRegistro.email" 
                  id="reg-email"
                  type="email" 
                  class="form-input" 
                  placeholder="correo@ejemplo.com"
                  maxlength="100"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="reg-clave" class="form-label">
                  Contraseña <span class="required">*</span>
                </label>
                <input 
                  v-model="formRegistro.clave" 
                  id="reg-clave"
                  type="password" 
                  class="form-input" 
                  placeholder="Mínimo 6 caracteres"
                  minlength="6"
                  required
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="reg-clave-confirm" class="form-label">
                  Confirmar Contraseña <span class="required">*</span>
                </label>
                <input 
                  v-model="formRegistro.claveConfirm" 
                  id="reg-clave-confirm"
                  type="password" 
                  class="form-input" 
                  placeholder="Repita la contraseña"
                  minlength="6"
                  required
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="reg-nombres" class="form-label">
                  Nombres <span class="required">*</span>
                </label>
                <input 
                  v-model="formRegistro.nombres" 
                  id="reg-nombres"
                  type="text" 
                  class="form-input" 
                  placeholder="Nombres completos"
                  maxlength="100"
                  required
                />
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-group">
                <label for="reg-primer-apellido" class="form-label">
                  Primer Apellido <span class="required">*</span>
                </label>
                <input 
                  v-model="formRegistro.primerApellido" 
                  id="reg-primer-apellido"
                  type="text" 
                  class="form-input" 
                  placeholder="Apellido paterno"
                  maxlength="50"
                  required
                />
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-group">
                <label for="reg-segundo-apellido" class="form-label">Segundo Apellido</label>
                <input 
                  v-model="formRegistro.segundoApellido" 
                  id="reg-segundo-apellido"
                  type="text" 
                  class="form-input" 
                  placeholder="Apellido materno"
                  maxlength="50"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="reg-telefono" class="form-label">Teléfono</label>
                <input 
                  v-model="formRegistro.telefono" 
                  id="reg-telefono"
                  type="tel" 
                  class="form-input" 
                  placeholder="77123456"
                  maxlength="20"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="reg-direccion" class="form-label">Dirección</label>
                <input 
                  v-model="formRegistro.direccion" 
                  id="reg-direccion"
                  type="text" 
                  class="form-input" 
                  placeholder="Dirección completa"
                  maxlength="200"
                />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="toggleRegistro" :disabled="cargandoRegistro">
              <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button type="submit" class="form-submit" :disabled="cargandoRegistro">
              <i class="fas fa-user-check"></i>
              {{ cargandoRegistro ? 'Registrando...' : 'Registrar Admin' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fca100 0%, #e85a19 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
  transition: max-width 0.3s ease;
}

.login-container:has(.login-card.expanded) {
  max-width: 900px;
}

.login-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease-out;
  transition: all 0.3s ease;
}

.login-card.expanded {
  padding: 40px;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header .flaticon-pizza-1 {
  font-size: 60px;
  color: #fca100;
  display: block;
  margin-bottom: 15px;
}

.login-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 5px;
}

.login-header p {
  font-size: 16px;
  color: #666666;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.registro-form .form-group {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.required {
  color: #dc3545;
}

.form-input {
  width: 100%;
  padding: 15px 20px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.registro-form .form-input {
  padding: 12px 16px;
  font-size: 15px;
}

.form-input:focus {
  outline: none;
  border-color: #fca100;
  box-shadow: 0 0 0 3px rgba(252, 161, 0, 0.1);
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin: -10px 0 20px 0;
  padding: 12px;
  background: #ffe6e6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-message i {
  font-size: 18px;
}

.form-submit {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #fca100 0%, #e85a19 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(252, 161, 0, 0.4);
}

.form-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(252, 161, 0, 0.6);
}

.form-submit:active:not(:disabled) {
  transform: translateY(0);
}

.form-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-submit i {
  font-size: 18px;
}

.divider {
  text-align: center;
  margin: 25px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  background: #ffffff;
  padding: 0 15px;
  position: relative;
  color: #999999;
  font-size: 14px;
}

.btn-register {
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #fca100;
  background: #fff5e6;
  border: 2px solid #fca100;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-register:hover {
  background: #fca100;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(252, 161, 0, 0.3);
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.btn-secondary {
  flex: 1;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #666666;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-secondary:hover:not(:disabled) {
  background: #e8e8e8;
  border-color: #cccccc;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions .form-submit {
  flex: 1;
}

.back-home {
  text-align: center;
  margin-top: 25px;
}

.back-home a {
  color: #666666;
  text-decoration: none;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s ease;
}

.back-home a:hover {
  color: #fca100;
}

/* Bootstrap Grid Override */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.col-md-4,
.col-md-6 {
  padding: 0 10px;
  width: 100%;
}

@media (min-width: 768px) {
  .col-md-4 {
    width: 33.333%;
  }

  .col-md-6 {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .login-card {
    padding: 40px 30px;
  }

  .login-card.expanded {
    padding: 30px 20px;
  }

  .login-header h1 {
    font-size: 28px;
  }

  .login-header .flaticon-pizza-1 {
    font-size: 50px;
  }

  .login-header {
    margin-bottom: 30px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .form-submit,
  .btn-secondary {
    width: 100%;
  }
}
</style>
