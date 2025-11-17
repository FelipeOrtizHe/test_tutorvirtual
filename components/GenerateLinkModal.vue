<template>
  <div class="modal-container">
    <!-- Formulario para crear asignaturas -->
    <h2 class="section-title">Crear Nueva Asignatura</h2>

    <UForm @submit="createSubject" class="form-container">
      <UFormGroup label="Nombre de la Asignatura" name="nombre" required>
        <UInput v-model="nombre" placeholder="Introduce el nombre de la asignatura" />
      </UFormGroup>

      <UFormGroup label="Fecha de Expiración del Enlace" name="fechaExpiracion" required>
        <UInput v-model="fechaExpiracion" type="datetime-local" />
      </UFormGroup>

      <UButton type="submit" color="primary" :loading="loading">
        {{ loading ? 'Creando...' : 'Crear Asignatura' }}
      </UButton>
    </UForm>

    <!-- Lista de asignaturas creadas -->
    <h2 class="section-title">Asignaturas Creadas</h2>

    <div v-if="asignaturas.length > 0" class="subjects-list">
      <div v-for="asignatura in asignaturas" :key="asignatura.id" class="subject-card">
        <div class="subject-header">
          <div>
            <h3 class="subject-title">{{ asignatura.nombre }}</h3>
            <p class="subject-exp">Fecha de expiración: {{ new Date(asignatura.fechaExpiracion).toLocaleString() }}</p>
          </div>

          <div class="subject-actions">
            <GenerateLinkModal :asignaturaId="asignatura.id" @enlace-generado="fetchAsignaturas" />
            <UButton @click="deleteSubject(asignatura.id)" color="red" size="sm">
              Eliminar
            </UButton>
          </div>
        </div>

        <div v-if="asignatura.enlaceRegistro" class="subject-link-box">
          <p class="subject-exp">Enlace temporal:</p>

          <div class="subject-link-row">
            <UInput :model-value="`${baseUrl}/inscribir?enlace=${asignatura.enlaceRegistro}`" readonly class="flex-1" />
            <UButton @click="copyLink(asignatura.enlaceRegistro)" color="gray" size="sm">
              Copiar
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-subjects">
      No hay asignaturas creadas.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GenerateLinkModal from '~/components/GenerateLinkModal.vue';

const nombre = ref('');
const fechaExpiracion = ref('');
const loading = ref(false);
const asignaturas = ref([]);
const baseUrl = ref('http://localhost:3000');

const fetchAsignaturas = async () => {
  try {
    const response = await $fetch('/api/asignaturas');
    asignaturas.value = response;
  } catch (error) {
    console.error('Error obteniendo las asignaturas:', error);
  }
};

const createSubject = async () => {
  if (!nombre.value || !fechaExpiracion.value) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  loading.value = true;

  try {
    await $fetch('/api/asignaturas/create', {
      method: 'POST',
      body: {
        nombre: nombre.value,
        idDocente: 1,
        fechaExpiracion: fechaExpiracion.value,
      },
    });

    alert('Asignatura creada exitosamente!');
    nombre.value = '';
    fechaExpiracion.value = '';
    await fetchAsignaturas();
  } catch (error) {
    console.error('Error creando la asignatura:', error);
    alert('Hubo un error al crear la asignatura.');
  } finally {
    loading.value = false;
  }
};

const copyLink = (enlace) => {
  navigator.clipboard.writeText(`${baseUrl.value}/inscribir?enlace=${enlace}`);
  alert('Enlace copiado al portapapeles!');
};

const deleteSubject = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta asignatura?')) {
    try {
      await $fetch(`/api/asignaturas/delete`, {
        method: 'DELETE',
        body: { id },
      });
      await fetchAsignaturas();
    } catch (error) {
      console.error('Error eliminando la asignatura:', error);
    }
  }
};

onMounted(() => {
  fetchAsignaturas();
});
</script>

<style scoped>
@import'@/assets/components/GenerateLinkModal.css';
</style>
