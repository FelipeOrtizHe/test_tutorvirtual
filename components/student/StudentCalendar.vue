<template>
  <div class="student-calendar calendar-container bg-zinc-900 text-white">

    <div class="flex flex-col lg:flex-row gap-6">

      <!-- Calendario -->
      <div class="flex-grow">

        <!-- Header -->
        <div class="calendar-header">
          <h2 class="text-xl sm:text-2xl font-bold">
            {{ currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) }}
          </h2>

          <div class="flex space-x-2">
            <button @click="previousMonth" class="calendar-nav-btn hover:bg-zinc-700">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button @click="nextMonth" class="calendar-nav-btn hover:bg-zinc-700">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Días de semana -->
        <div class="calendar-grid mb-2">
          <div
            v-for="day in daysOfWeek"
            :key="day"
            class="text-xs sm:text-sm font-medium text-gray-400 py-1"
          >
            {{ day }}
          </div>
        </div>

        <!-- Días -->
        <div class="calendar-grid">
          <div
            v-for="{ date, isCurrentMonth, hasEvent } in calendarDays"
            :key="date.toISOString()"
            class="calendar-day group"
            :class="[
              isCurrentMonth ? 'text-white' : 'text-gray-500',
              'hover:bg-zinc-700'
            ]"
          >
            <span :class="{ 'today-indicator': isToday(date) }">
              {{ date.getDate() }}
            </span>

            <div v-if="hasEvent" class="event-dot"></div>
          </div>
        </div>

      </div>

      <!-- Recordatorios -->
      <div class="w-full lg:w-1/3 mt-6 lg:mt-0">

        <h3 class="text-lg sm:text-xl font-bold mb-4 flex items-center">
          <i class="fas fa-bell mr-2 text-blue-400"></i>
          Recordatorios
        </h3>

        <div class="reminders-box scroll-area space-y-4">
          <template v-if="eventos.length > 0">
            <div
              v-for="evento in eventos"
              :key="evento.id"
              class="reminder-card"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="text-blue-400 text-xs sm:text-sm font-medium mb-1">
                    {{ formatDate(evento.date) }}
                  </p>

                  <h4 class="font-semibold text-sm sm:text-base">
                    {{ evento.title }}
                  </h4>
                </div>
              </div>

              <p v-if="evento.description" class="text-gray-400 text-xs sm:text-sm mt-2">
                {{ evento.description }}
              </p>

              <div class="mt-2 pt-2 border-t border-gray-700">
                <span class="text-xs text-gray-500 font-medium">
                  {{ evento.asignatura.nombre }}
                </span>
              </div>
            </div>
          </template>

          <div v-else class="text-center py-8">
            <i class="fas fa-calendar-day text-4xl text-gray-600 mb-2"></i>
            <p class="text-gray-400 text-sm">No hay recordatorios programados</p>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Evento {
  id: number
  title: string
  date: string
  description: string
  asignatura: {
    id: number
    nombre: string
  }
}

const eventos = ref<Evento[]>([])
const currentDate = ref(new Date())

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

interface ApiResponse {
  eventos: Evento[];
}

const fetchEvents = async () => {
  try {
    // Recuperar el token del almacenamiento (o desde tu store de autenticación)
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    // Incluir la cabecera de autorización en la petición
    const response = await $fetch<ApiResponse>('/api/students/calendar', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response && Array.isArray(response.eventos)) {
      eventos.value = response.eventos;
    }
  } catch (error) {
    console.error('Error fetching calendar events:', error);
  }
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasEvent: boolean;
}

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: CalendarDay[] = []; // 👈 Aseguramos que esto es un array de CalendarDay

  for (let i = 0; i < startingDayOfWeek; i++) {
    const date = new Date(year, month, -startingDayOfWeek + i + 1);
    days.push({ date, isCurrentMonth: false, hasEvent: hasEvent(date) });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({ date, isCurrentMonth: true, hasEvent: hasEvent(date) });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ date, isCurrentMonth: false, hasEvent: hasEvent(date) });
  }

  return days;
});

const hasEvent = (date: Date) => {
  return eventos.value.some(evento =>
    new Date(evento.date).toDateString() === date.toDateString()
  )
}

const isToday = (date: Date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(fetchEvents)
</script>


<style src="./StudentCalendar.vue"></style>

<!-- Mantengo tu CSS scoped para la altura + scrollbar -->
<style scoped>
.calendar-container {
  min-height: calc(100vh - 4rem);
}

@media (min-width: 1024px) {
  .calendar-container {
    min-height: auto;
  }
}

/* Scrollbar Webkit */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #2d3748;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border-radius: 20px;
}
</style>
