import React from 'react';
// Material-UI components for layout and styling
import { Grid, Paper, Typography, Box } from '@mui/material';
// Chart.js and Doughnut chart imports for data visualization
import { Chart, registerables } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
// Icons for showing trend indicators
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Register all Chart.js components to enable chart functionality
Chart.register(...registerables);




// MetricsGrid component - Displays key metrics in a grid layout
function MetricsGrid() {
  return (
    // Grid container with spacing between items
    <Grid container spacing={3}>

      {/* Registered Users metric card */}
      <Grid item xs={12} sm={6} md={3}>
        {/* Paper component for card styling */}
        <Paper sx={{ p: 2 }}>

          <Typography variant="h6">Registered Users</Typography>
          <Typography variant="h4">1,234</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <TrendingUpIcon fontSize="small" />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              +12.5% this period
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Active Users metric card */}
      <Grid item xs={12} sm={6} md={3}>
        {/* Paper component for card styling */}
        <Paper sx={{ p: 2 }}>

          <Typography variant="h6">Active Users</Typography>
          <Typography variant="h4">789</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <TrendingUpIcon fontSize="small" />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              +8.3% this period
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Current Visitors in Mall metric card */}
      <Grid item xs={12} sm={6} md={3}>
        {/* Paper component for card styling */}
        <Paper sx={{ p: 2 }}>

          <Typography variant="h6">Current Visitors</Typography>
          <Typography variant="h4">456</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
            <TrendingDownIcon fontSize="small" />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              -5.2% fewer than usual
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Current Users Online metric card with donut chart */}
      <Grid item xs={12} sm={6} md={3}>
        {/* Paper component for card styling */}
        <Paper sx={{ p: 2 }}>

          <Typography variant="h6">Users Online</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Donut Chart container */}
            <Box sx={{ width: 100, height: 100 }}>
              {/* Doughnut chart component showing website vs app users */}
              <Doughnut 

                data={{
                  labels: ['Website', 'App'],
                  datasets: [{
                    data: [120, 201],
                    backgroundColor: ['#4caf50', '#2196f3'],
                    borderWidth: 0
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.raw} users`;
                        }
                      }
                    }
                  }
                }}
              />
            </Box>
            {/* Container for total users and percentage change */}
            <Box>

              <Typography variant="h4" align="right">321</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                <TrendingUpIcon fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  +15.7% this period
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>


    </Grid>
  );
}

export default MetricsGrid;
