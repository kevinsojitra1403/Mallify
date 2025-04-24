import React, { useRef, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register all Chart.js components
Chart.register(...registerables);

function SalesChart({ filter }) {
  // Chart reference for potential future interactions
  const chartRef = useRef(null);

  // Data for different time periods
  const dataSets = {
    Weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      income: [5000, 7000, 6000, 8000, 7500, 8500, 9000],
      expense: [2000, 2500, 2200, 2800, 2600, 3000, 3200]
    },
    Monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      income: [20000, 22000, 25000, 23000],
      expense: [8000, 8500, 9000, 8800]
    },
    Annually: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      income: [15000, 22000, 18000, 25000, 20000, 23000, 24000, 26000, 28000, 30000, 32000, 35000],
      expense: [5000, 7000, 6000, 8000, 7500, 8500, 9000, 9500, 10000, 11000, 12000, 13000]
    }
  };

  // Get data based on selected filter
  const selectedData = dataSets[filter] || dataSets.Weekly;

  // Revenue data with income and expense breakdown
  const data = {
    labels: selectedData.labels,
    datasets: [
      {
        label: 'Income',
        data: selectedData.income,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.2,
        fill: true
      },
      {
        label: 'Expense',
        data: selectedData.expense,
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.2,
        fill: true
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
        text: 'Revenue Breakdown'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }

    }
  };

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Revenue Analysis
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Income vs Expense Breakdown
      </Typography>

      {/* Line chart component */}
      <Line ref={chartRef} data={data} options={options} />
    </Paper>
  );
}

export default SalesChart;
