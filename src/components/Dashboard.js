import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { collection, getDocs } from "firebase/firestore";  // Firestore imports
import { db } from '../firebaseconfig.js';  // Import Firestore
import Header from './Header.js';
import Sidebar from './Sidebar.js';
import MainContent from './MainContent.js';
import SalesChart from './SalesChart.js';
import VisitsChart from './VisitsChart.js';
import OccupancyMetrics from './OccupancyMetrics.js';
import MetricsGrid from './MetricsGrid.js';

// This function defines the Dashboard component
function Dashboard() { // Main dashboard component
  const [filter, setFilter] = useState('Weekly'); // State to manage the selected filter
  const [users, setUsers] = useState([]);  // State to store Firestore data
    
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));  // Fetch Firestore data
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);  // Store in state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}> 

      <Header /> 
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}> 

        <Sidebar /> 
        <MainContent sx={{ flexGrow: 1, padding: 1 }}> 

          <MetricsGrid /> 
          <div className="charts" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}> 

            <SalesChart filter={filter} /> 
            <VisitsChart filter={filter} /> 

          </div>
          <OccupancyMetrics />
        </MainContent>
      </Box>
    </Box>
  );
}

export default Dashboard;
