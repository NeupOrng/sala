<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { IGenderCount } from '~/models/dto/gender-count'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart: any) {
    const { ctx, chartArea } = chart;
    const total = dataValues.value.reduce((a, b) => a + b, 0);
    const text = `Total: ${total}`;

    ctx.save();
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#111';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, chartArea.left + chartArea.width / 2, chartArea.top + chartArea.height / 2);
    ctx.restore();
  }
};

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, centerTextPlugin)

const props = defineProps<{ gender: IGenderCount[] }>()

// Extract labels and data from props.gender
const labels = computed(() => props.gender.map(g => g.gender))
const dataValues = computed(() => props.gender.map(g => g.count))

const chartData = ref({
  labels: labels.value,
  datasets: [
    {
      label: 'Count',
      data: dataValues.value,
      backgroundColor: ['#ef4444', '#3b82f6', '#facc15'],
      hoverOffset: 10
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { position: 'bottom' as const, labels: { color: '#6b7280' } },
  }
}

watch(
  [labels, dataValues],
  ([newLabels, newData]) => {
    chartData.value = {
      labels: newLabels,
      datasets: [
        {
          label: 'Count',
          data: newData,
          backgroundColor: ['#ef4444', '#3b82f6', '#facc15'],
          hoverOffset: 10
        }
      ]
    }
  },
  { deep: true }
)
</script>

<template>
  <Card class="w-full max-w-md shadow-md hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle>Total Students by Gender</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="h-64">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
    </CardContent>
  </Card>
</template>
