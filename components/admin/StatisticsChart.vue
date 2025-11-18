<template>
  <div>
    <!-- Si es necesario, envolver en <client-only> para evitar problemas en SSR -->
    <ApexChart type="bar" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

/** Tipos de las respuestas de la API */
type SubjectsRes = { count: number }
type StudentsRes = { count: number }
type AverageStudentsRes = { average: number }
type ActiveInactiveRes = { active: number; inactive: number }
type AverageMaterialsRes = { averageMaterials: number }

/** Serie de datos del gráfico */
const series = ref([
  {
    name: 'Valores',
    data: [] as number[],
  },
])

/** Opciones del gráfico */
const chartOptions = ref({
  chart: {
    id: 'stats-chart',
  },
  xaxis: {
    categories: [
      'Asignaturas totales',
      'Estudiantes totales',
      'Promedio de estudiantes',
      'Asignaturas activas',
      'Asignaturas inactivas',
      'Materiales por asignatura',
    ],
  },
  title: {
    text: 'Estadísticas Generales',
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
})

const fetchChartStats = async () => {
  try {
    // Peticiones en paralelo, tipadas
    const [
      subjectsRes,
      studentsRes,
      averageStudentsRes,
      activeInactiveRes,
      averageMaterialsRes,
    ] = await Promise.all([
      $fetch<SubjectsRes>('/api/stats/subjects/count'),
      $fetch<StudentsRes>('/api/stats/students/count'),
      $fetch<AverageStudentsRes>('/api/stats/students/average'),
      $fetch<ActiveInactiveRes>('/api/stats/asignaturas/active-inactive'),
      $fetch<AverageMaterialsRes>('/api/stats/materials/average'),
    ])

    series.value = [
      {
        name: 'Valores',
        data: [
          subjectsRes.count,                             // Asignaturas totales
          studentsRes.count,                             // Estudiantes totales
          Number(averageStudentsRes.average),            // Promedio de estudiantes
          activeInactiveRes.active,                      // Asignaturas activas
          activeInactiveRes.inactive,                    // Asignaturas inactivas
          Number(averageMaterialsRes.averageMaterials),  // Promedio de materiales por asignatura
        ],
      },
    ]
  } catch (error) {
    console.error('Error al cargar estadísticas para el gráfico:', error)
  }
}

onMounted(fetchChartStats)
</script>