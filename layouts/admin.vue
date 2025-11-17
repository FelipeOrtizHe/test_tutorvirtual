<template>
  <div v-cloak>
    <nav class="navbar-admin" :class="{ 'dark': isDark }">
      <div class="navbar-admin__container">
        <div class="navbar-admin__wrapper">
          <!-- Logo -->
          <div class="navbar-admin__logo-section">
            <Logo />
            <NuxtLink to="/" class="navbar-admin__title">
              <slot name="title">Administrador</slot>
            </NuxtLink>
          </div>

          <!-- Menu Items (Desktop) -->
          <div class="navbar-admin__menu-desktop">
            <NuxtLink class="navbar-admin__link" to="/admin">
              Inicio
            </NuxtLink>
            <NuxtLink class="navbar-admin__link" to="/admin/docentes">
              Docente
            </NuxtLink>
            <NuxtLink class="navbar-admin__link" to="/admin/asignaturas">
              Asignaturas
            </NuxtLink>
          </div>

          <!-- Dark Mode Toggle Button -->
          <div class="navbar-admin__actions">
            <Theme />
            <ButtonLogOut />

            <!-- Mobile Menu Button -->
            <button 
              @click="toggleMobileMenu"
              class="navbar-admin__mobile-btn"
            >
              <span class="sr-only">Open menu</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="navbar-admin__mobile-icon" 
                fill="none" 
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16m-7 6h7" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="navbar-admin__mobile-menu">
        <div class="navbar-admin__mobile-content">
          <NuxtLink class="navbar-admin__mobile-link" to="/admin">
            Inicio
          </NuxtLink>
          <NuxtLink class="navbar-admin__mobile-link" to="/admin/docentes">
            Docentes
          </NuxtLink>
          <NuxtLink class="navbar-admin__mobile-link" to="/admin/asignaturas">
            Asignaturas
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Contenedor con margen para el slot -->
    <div class="navbar-admin__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import Logo from '~/components/logo.vue';

// State to control mobile menu visibility
const isMobileMenuOpen = ref(false);

// Detectar el tema oscuro (ajusta según tu implementación)
const isDark = ref(false);

// Toggle function for mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<style scoped>
@import '@/assets/css/admin.css';
</style>