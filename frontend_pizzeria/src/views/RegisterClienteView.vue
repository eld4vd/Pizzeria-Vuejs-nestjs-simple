<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores';
import axios from '@/plugins/axios';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const formData = ref({
  usuario: '',
  clave: '',
  confirmarClave: '',
  nombre: '',
  email: '',
  telefono: '',
  direccion: ''
});

const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordsMatch = computed(() => {
  return formData.value.clave === formData.value.confirmarClave;
});

const isFormValid = computed(() => {
  return (
    formData.value.usuario.trim() !== '' &&
    formData.value.clave.length >= 6 &&
    passwordsMatch.value &&
    formData.value.nombre.trim() !== '' &&
    formData.value.telefono.trim() !== ''
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.warning('Por favor complete todos los campos requeridos correctamente');
    return;
  }

  if (!passwordsMatch.value) {
    toast.error('Las contraseñas no coinciden');
    return;
  }

  loading.value = true;
  
  try {
    const response = await axios.post('/auth/register/cliente', {
      usuario: formData.value.usuario.trim(),
      clave: formData.value.clave,
      nombre: formData.value.nombre.trim(),
      email: formData.value.email.trim() || undefined,
      telefono: formData.value.telefono.trim(),
      direccion: formData.value.direccion.trim() || undefined
    });

    // El backend devuelve el token automáticamente
    if (response.data?.access_token) {
      // Guardar token y datos del usuario
      localStorage.setItem('token', response.data.access_token);
      
      // Decodificar el token para obtener datos del usuario
      const tokenData = JSON.parse(atob(response.data.access_token.split('.')[1]));
      
      authStore.setUser({
        id: tokenData.sub,
        usuario: tokenData.usuario,
        rol: tokenData.rol,
        nombre: formData.value.nombre.trim(),
        email: formData.value.email.trim(),
        telefono: formData.value.telefono.trim()
      });
      authStore.setToken(response.data.access_token);
      
      toast.success('¡Cuenta creada exitosamente! Bienvenido/a');
      router.push('/menu');
    }
  } catch (error: any) {
    console.error('Error al registrar:', error);
    const message = error.response?.data?.message || 'Error al crear la cuenta';
    toast.error(Array.isArray(message) ? message[0] : message);
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="logo-container">
          <i class="fas fa-user-plus"></i>
        </div>
        <h1>Crear Cuenta</h1>
        <p>Regístrate para hacer pedidos online</p>
      </div>

      <form @submit.prevent="handleSubmit" class="register-form">
        <!-- Usuario -->
        <div class="form-group">
          <label for="usuario">
            <i class="fas fa-user"></i>
            Usuario
          </label>
          <input
            id="usuario"
            v-model="formData.usuario"
            type="text"
            placeholder="Elige un nombre de usuario"
            required
            autocomplete="username"
          />
        </div>

        <!-- Nombre Completo -->
        <div class="form-group">
          <label for="nombre">
            <i class="fas fa-id-card"></i>
            Nombre Completo
          </label>
          <input
            id="nombre"
            v-model="formData.nombre"
            type="text"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">
            <i class="fas fa-envelope"></i>
            Email (opcional)
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="tu@email.com"
            autocomplete="email"
          />
        </div>

        <!-- Teléfono -->
        <div class="form-group">
          <label for="telefono">
            <i class="fas fa-phone"></i>
            Teléfono
          </label>
          <input
            id="telefono"
            v-model="formData.telefono"
            type="tel"
            placeholder="Tu número de teléfono"
            required
          />
        </div>

        <!-- Dirección -->
        <div class="form-group">
          <label for="direccion">
            <i class="fas fa-map-marker-alt"></i>
            Dirección de entrega (opcional)
          </label>
          <input
            id="direccion"
            v-model="formData.direccion"
            type="text"
            placeholder="Tu dirección"
          />
        </div>

        <!-- Contraseña -->
        <div class="form-group">
          <label for="clave">
            <i class="fas fa-lock"></i>
            Contraseña
          </label>
          <div class="password-input">
            <input
              id="clave"
              v-model="formData.clave"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mínimo 6 caracteres"
              required
              minlength="6"
              autocomplete="new-password"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Confirmar Contraseña -->
        <div class="form-group">
          <label for="confirmarClave">
            <i class="fas fa-lock"></i>
            Confirmar Contraseña
          </label>
          <div class="password-input">
            <input
              id="confirmarClave"
              v-model="formData.confirmarClave"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Repite la contraseña"
              required
              :class="{ 'error': formData.confirmarClave && !passwordsMatch }"
              autocomplete="new-password"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <small v-if="formData.confirmarClave && !passwordsMatch" class="error-text">
            Las contraseñas no coinciden
          </small>
        </div>

        <button
          type="submit"
          class="btn-register"
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Creando cuenta...
          </span>
          <span v-else>
            <i class="fas fa-check-circle"></i>
            Crear Cuenta
          </span>
        </button>
      </form>

      <div class="register-footer">
        <p>¿Ya tienes cuenta?</p>
        <button @click="goToLogin" class="btn-login">
          <i class="fas fa-sign-in-alt"></i>
          Iniciar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
  padding: 2rem;
}

.register-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #fca100, #e85a19);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(252, 161, 0, 0.3);
}

.register-header h1 {
  color: #1a1a2e;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #6c757d;
  font-size: 0.95rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333333;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group label i {
  color: #fca100;
  font-size: 0.85rem;
}

.form-group input {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  color: #1a1a2e;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: #adb5bd;
}

.form-group input:focus {
  outline: none;
  border-color: #fca100;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(252, 161, 0, 0.15);
}

.form-group input.error {
  border-color: #dc3545;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  width: 100%;
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #fca100;
}

.error-text {
  color: #dc3545;
  font-size: 0.8rem;
}

.btn-register {
  background: linear-gradient(135deg, #fca100, #e85a19);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(252, 161, 0, 0.4);
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.register-footer {
  margin-top: 2rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.register-footer p {
  color: #6c757d;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.btn-login {
  background: transparent;
  color: #fca100;
  border: 2px solid #fca100;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-login:hover {
  background: rgba(252, 161, 0, 0.1);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-card {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .logo-container {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .register-header h1 {
    font-size: 1.5rem;
  }
}
</style>
