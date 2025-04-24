import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import MetricsGrid from './MetricsGrid';
import SalesChart from './SalesChart';
import VisitsChart from './VisitsChart';
import Header from './Header';

function MainContent() {
  const [filter, setFilter] = useState('Weekly');

  return (
    <>
      <Header setFilter={setFilter} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px' // Offset for header
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <MetricsGrid />
            <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 4 }}>
              <Box>
                <SalesChart filter={filter} />
              </Box>
              <Box>
                <VisitsChart filter={filter} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default MainContent;
