<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

// Example data — you can make this a prop later
const chartData = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'Votes',
      data: [300, 50, 100],
      backgroundColor: ['#ef4444', '#3b82f6', '#facc15'],
      hoverOffset: 10
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#6b7280' // Tailwind gray-500
      }
    }
  }
}
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader>
      <CardTitle>Donut Chart</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="h-64">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
    </CardContent>
  </Card>
</template>
