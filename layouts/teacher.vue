<template>
  <div v-cloak>
    <nav class="navbar-teacher" :class="{ 'dark': isDark }">
      <div class="navbar-teacher__container">
        <div class="navbar-teacher__wrapper">
          <!-- Logo -->
          <div class="navbar-teacher__logo-section">
            <Logo />
            <NuxtLink to="/" class="navbar-teacher__title">
              <slot name="title">Docente</slot>
            </NuxtLink>
          </div>

          <!-- Menu Items (Desktop) -->
          <div class="navbar-teacher__menu-desktop">
            <NuxtLink class="navbar-teacher__link" to="/teacher">
              Inicio
            </NuxtLink>
            <NuxtLink class="navbar-teacher__link" to="/teacher/calendar">
              Calendario
            </NuxtLink>
            <NuxtLink class="navbar-teacher__link" to="/teacher/asignaturas">
              Asignaturas
            </NuxtLink>
          </div>

          <!-- Dark Mode Toggle Button -->
          <div class="navbar-teacher__actions">
            <Theme />
            <ButtonLogOut />

            <!-- Mobile Menu Button -->
            <button 
              @click="toggleMobileMenu"
              class="navbar-teacher__mobile-btn"
            >
              <span class="sr-only">Open menu</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="navbar-teacher__mobile-icon" 
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
      <div v-if="isMobileMenuOpen" class="navbar-teacher__mobile-menu">
        <div class="navbar-teacher__mobile-content">
          <NuxtLink class="navbar-teacher__mobile-link" to="/teacher">
            Inicio
          </NuxtLink>
          <NuxtLink class="navbar-teacher__mobile-link" to="/teacher/calendar">
            Calendario
          </NuxtLink>
          <NuxtLink class="navbar-teacher__mobile-link" to="/teacher/asignaturas">
            Asignaturas
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Contenedor con margen para el slot -->
    <div class="navbar-teacher__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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
@import '@/assets/css/teacher.css';
</style>