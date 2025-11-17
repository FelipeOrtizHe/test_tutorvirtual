<template>
  <div class="fu-wrapper">
    <div class="fu-container">
      <h2 class="fu-title">Subir Archivo</h2>

      <!-- DROPZONE -->
      <label for="fileInput" class="fu-dropzone">
        <div v-if="!selectedFile" class="fu-dropzone-empty">
          <span class="fu-dropzone-text">Arrastra y suelta un archivo aquí</span>
          <span class="fu-dropzone-subtext">O haz clic para seleccionar uno</span>
        </div>

        <div v-else class="fu-dropzone-filled">
          <span class="fu-dropzone-text">Archivo seleccionado:</span>
          <span class="fu-selected-name">{{ selectedFile.name }}</span>
        </div>

        <input id="fileInput" type="file" class="fu-file-input" @change="handleFileChange" />
      </label>

      <!-- BOTÓN SUBIR -->
      <button
        @click="uploadFile"
        :disabled="!selectedFile || uploading"
        class="fu-upload-btn"
      >
        {{ uploading ? 'Subiendo...' : 'Subir Archivo' }}
      </button>

      <!-- FEEDBACK -->
      <div v-if="error" class="fu-error-box">
        Error: {{ error }}
      </div>

      <div v-if="success" class="fu-success-box">
        Archivo subido con éxito.
      </div>

      <!-- LISTA DE ARCHIVOS -->
      <div class="fu-files-section">
        <h3 class="fu-subtitle">Archivos Subidos:</h3>

        <div v-if="materiales.length > 0">
          <ul class="fu-files-list">
            <li
              v-for="material in materiales"
              :key="material.id"
              class="fu-file-item"
            >
              <div>
                <a
                  :href="material.url"
                  target="_blank"
                  class="fu-file-link"
                >
                  {{ material.nombre }}
                </a>

                <p class="fu-file-type">({{ material.tipo }})</p>
              </div>

              <UButton
                @click="deleteMaterial(material.id)"
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                :loading="deleting === material.id"
              >
                Eliminar
              </UButton>
            </li>
          </ul>
        </div>

        <div v-else class="fu-empty">
          No hay archivos subidos aún.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    idAsignatura: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      selectedFile: null,
      uploading: false,
      success: false,
      error: null,
      materiales: [],
      deleting: null,
    };
  },

  mounted() {
    this.fetchMateriales();
  },

  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },

    async fetchMateriales() {
      try {
        const response = await fetch(`/api/materials/${this.idAsignatura}`);
        if (!response.ok) throw new Error('Error al obtener los materiales.');
        this.materiales = await response.json();
      } catch (err) {
        this.error = err.message;
      }
    },

    async uploadFile() {
      if (!this.selectedFile) return;

      this.uploading = true;
      this.success = false;
      this.error = null;

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('idAsignatura', this.idAsignatura.toString());

      try {
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al subir el archivo.');
        }

        this.success = true;
        await this.fetchMateriales();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.uploading = false;
      }
    },

    async deleteMaterial(idMaterial) {
      this.deleting = idMaterial;

      try {
        const response = await fetch(`/api/materials/${idMaterial}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al eliminar el archivo.');
        }

        await this.fetchMateriales();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.deleting = null;
      }
    },
  },
};
</script>

<style scoped>
  @import'@/assets/components/FileUploader.css';
</style>
