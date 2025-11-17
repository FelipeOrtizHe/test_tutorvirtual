<template>
  <UCard class="table-subjects-container">

    <!-- Input de búsqueda -->
    <UInput
      v-model="search"
      placeholder="Buscar por nombre, carrera o docente..."
    />

    <!-- Botón eliminar múltiples -->
    <UButton
      v-if="selected.length > 0"
      :disabled="selected.length === 0"
      @click="openDeleteModalForSelected"
      color="red"
      variant="outline"
      class="delete-multiple-wrapper"
      icon="i-heroicons-trash-20-solid"
      title="Eliminar seleccionados"
    />

    <!-- Tabla -->
    <UTable
      :rows="asignaturas"
      :columns="columns"
      :loading="loading"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
      v-model="selected"
    >
      <template #actions-data="{ row }">
        <UDropdown :items="actions(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>

    <!-- Paginación -->
    <div class="pagination-bar">
      <UPagination v-model="page" :page-count="limit" :total="total" />
    </div>

    <!-- Modal de eliminación -->
    <DeleteAsignaturaModal
      ref="deleteModal"
      :asignatura="asignaturaToDelete"
      :selectedAsignaturas="selected"
      @confirm="handleDeleteConfirm"
    />
  </UCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DeleteAsignaturaModal from './DeleteAsignaturaModal.vue'

const selected = ref<Asignatura[]>([])

interface Asignatura {
  id: number;
  nombre: string;
  carrera: string;
  idDocente: number;
  docente: Usuario;
  activo: boolean;
  enlaceRegistro?: string;
  fechaExpiracion?: Date;
  jornada: string;
}

interface Usuario {
  id: number;
  nombre: string;
}

interface AsignaturasResponse {
  asignaturas: Asignatura[];
  total: number;
}

const search = ref('')
const page = ref(1)
const limit = ref(50)
const loading = ref(false)
const asignaturas = ref<Asignatura[]>([])
const total = ref(0)
const asignaturaToDelete = ref<Asignatura | null>(null)
const deleteModal = ref<InstanceType<typeof DeleteAsignaturaModal> | null>(null)

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'carrera', label: 'Carrera' },
  { key: 'docente.nombre', label: 'Docente' },
  { key: 'jornada', label: 'Jornada' },
  { key: 'actions', label: 'Acciones' }
]

const fetchAsignaturas = async () => {
  loading.value = true;
  const response = await $fetch<AsignaturasResponse>('/api/admin/asignaturas', {
    query: {
      page: page.value,
      limit: limit.value,
      search: search.value.toLocaleLowerCase()
    }
  });
  const { asignaturas: fetchedAsignaturas, total: fetchedTotal } = response;
  asignaturas.value = fetchedAsignaturas;
  total.value = fetchedTotal;
  loading.value = false;
}

watch([page, search], fetchAsignaturas, { immediate: true })

const actions = (row: Asignatura) => [
  [{
    label: 'Eliminar',
    icon: 'i-heroicons-trash-20-solid',
    click: () => {
      asignaturaToDelete.value = row;
      deleteModal.value?.openModal();
    }
  }]
]

const handleDeleteConfirm = async (asignaturas: Asignatura | Asignatura[]) => {
  try {
    if (Array.isArray(asignaturas)) {
      const ids = asignaturas.map(a => a.id);
      await Promise.all(ids.map(id =>
        $fetch(`/api/admin/asignaturas/${id}`, { method: "DELETE" }) // ✅ Endpoint correcto
      ));
    } else {
      await $fetch(`/api/admin/asignaturas/${asignaturas.id}`, { method: "DELETE" });
    }

    // Forzar recarga de datos
    page.value = 1;
    fetchAsignaturas();

  } catch (error) {
    console.error("Error frontend:", error);
  }
};

const openDeleteModalForSelected = () => {
  if (selected.value.length > 0) {
    deleteModal.value?.openModal();
  }
}
</script>

<style src="./TableSubjects.css"></style>
