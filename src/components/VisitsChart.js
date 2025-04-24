import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register all Chart.js components
Chart.register(...registerables);

function VisitsChart({ filter }) {
  // Data for different time periods
  const dataSets = {
    Weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      visits: [1200, 1900, 3000, 5000, 2000, 3000, 4000]
    },
    Monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      visits: [10000, 12000, 15000, 13000]
    },
    Annually: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      visits: [50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 105000]
    }
  };

  // Get data based on selected filter
  const selectedData = dataSets[filter] || dataSets.Weekly;

  // Visits data for the chart
  const data = {
    labels: selectedData.labels,
    datasets: [
      {
        label: 'Visits',
        data: selectedData.visits,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }
    ]
  };


  // Chart options configuration
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${filter} Visits`

      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Visits Overview
      </Typography>
      <Bar data={data} options={options} />
    </Paper>
  );
}

export default VisitsChart;
