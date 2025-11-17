<template>
  <div v-cloak>
    <nav class="navbar-student" :class="{ 'dark': isDark }">
      <div class="navbar-student__container">
        <div class="navbar-student__wrapper">
          <!-- Logo -->
          <div class="navbar-student__logo-section">
            <Logo /> 
            <NuxtLink to="/student" class="navbar-student__title">
              <slot name="title">EstudianteAI</slot>
            </NuxtLink>
          </div>

          <!-- Menu Items (Desktop) -->
          <div class="navbar-student__menu-desktop">
            <NuxtLink class="navbar-student__link" to="/student">
              Inicio
            </NuxtLink>
            <NuxtLink class="navbar-student__link" to="/student/chat">
              Asistente IA
            </NuxtLink>
            <NuxtLink class="navbar-student__link" to="/student/content">
              Contenido
            </NuxtLink>
            <NuxtLink class="navbar-student__link" to="/student/calendar">
              Calendario
            </NuxtLink>
          </div>

          <!-- Dark Mode Toggle Button -->
          <div class="navbar-student__actions">
            <Theme />
            <ButtonLogOut />

            <!-- Mobile Menu Button -->
            <button 
              @click="toggleMobileMenu"
              class="navbar-student__mobile-btn"
            >
              <span class="sr-only">Open menu</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="navbar-student__mobile-icon" 
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
      <div v-if="isMobileMenuOpen" class="navbar-student__mobile-menu">
        <div class="navbar-student__mobile-content">
          <NuxtLink class="navbar-student__mobile-link" to="/student">
            Inicio
          </NuxtLink>
          <NuxtLink class="navbar-student__mobile-link" to="/student/chat">
            Asistente IA
          </NuxtLink>
          <NuxtLink class="navbar-student__mobile-link" to="/student/content">
            Contenido
          </NuxtLink>
          <NuxtLink class="navbar-student__mobile-link" to="/student/calendar">
            Calendario
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Contenedor con margen para el slot -->
    <div class="navbar-student__content">
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
@import '@/assets/css/student.css';
</style>