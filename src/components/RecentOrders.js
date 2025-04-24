import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function RecentOrders() {
  // Sample data for recent orders
  const orders = [
    { id: 1, customer: 'John Doe', amount: '$120', status: 'Completed' },
    { id: 2, customer: 'Jane Smith', amount: '$80', status: 'Pending' },
    { id: 3, customer: 'Bob Johnson', amount: '$250', status: 'Completed' },
    { id: 4, customer: 'Alice Brown', amount: '$150', status: 'Processing' }
  ];

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Orders
      </Typography>
      {/* Table container */}
      <TableContainer>
        <Table>
          {/* Table header */}
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          {/* Table body with order data */}
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default RecentOrders;
