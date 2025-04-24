import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Select, MenuItem, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from 'xlsx';

function Receipts() {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [actionType, setActionType] = useState(''); // Define actionType state
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [months, setMonths] = useState(6);
  const [receiptsData, setReceiptsData] = useState([
    { id: '001', userid: 'U123', point: '50', status: '🟡 Pending', time: '2025-03-18 12:30 PM' },
    { id: '002', userid: 'U456', point: '30', status: '🟢 Approved', time: '2025-03-17 10:15 AM' },
    { id: '003', userid: 'U789', point: '20', status: '🔴 Discarded', time: '2025-03-16 06:45 PM' },
    { id: '004', userid: 'U123', point: '15', status: '🟡 Pending', time: '2025-03-15 09:00 AM' },
    { id: '005', userid: 'U234', point: '40', status: '🟢 Approved', time: '2025-03-14 11:00 AM' },
    { id: '006', userid: 'U345', point: '25', status: '🔴 Discarded', time: '2025-03-13 08:30 AM' },
    { id: '007', userid: 'U456', point: '35', status: '🟡 Pending', time: '2025-03-12 07:45 AM' },
    { id: '008', userid: 'U567', point: '45', status: '🟢 Approved', time: '2025-03-11 06:15 AM' },
    { id: '009', userid: 'U678', point: '55', status: '🔴 Discarded', time: '2025-03-10 05:00 AM' },
    { id: '010', userid: 'U789', point: '65', status: '🟡 Pending', time: '2025-03-09 04:30 AM' },
    { id: '011', userid: 'U890', point: '75', status: '🟢 Approved', time: '2025-03-08 03:15 AM' },
    { id: '012', userid: 'U901', point: '85', status: '🔴 Discarded', time: '2025-03-07 02:00 AM' },
    { id: '013', userid: 'U123', point: '95', status: '🟡 Pending', time: '2025-03-06 01:45 AM' },
    { id: '014', userid: 'U234', point: '105', status: '🟢 Approved', time: '2025-03-05 12:30 AM' },
    { id: '015', userid: 'U345', point: '115', status: '🔴 Discarded', time: '2025-03-04 11:15 PM' },
    { id: '016', userid: 'U456', point: '125', status: '🟡 Pending', time: '2025-03-03 10:00 PM' },
    { id: '017', userid: 'U567', point: '135', status: '🟢 Approved', time: '2025-03-02 08:45 PM' },
    { id: '018', userid: 'U678', point: '145', status: '🔴 Discarded', time: '2025-03-01 07:30 PM' },
    { id: '019', userid: 'U789', point: '155', status: '🟡 Pending', time: '2025-02-28 06:15 PM' },
    { id: '020', userid: 'U890', point: '165', status: '🟢 Approved', time: '2025-02-27 05:00 PM' },
    { id: '021', userid: 'U901', point: '175', status: '🔴 Discarded', time: '2025-02-26 03:45 PM' },
    { id: '022', userid: 'U123', point: '185', status: '🟡 Pending', time: '2025-02-25 02:30 PM' },
    { id: '023', userid: 'U234', point: '195', status: '🟢 Approved', time: '2025-02-24 01:15 PM' },
    { id: '024', userid: 'U345', point: '205', status: '🔴 Discarded', time: '2025-02-23 12:00 PM' },
    { id: '025', userid: 'U456', point: '215', status: '🟡 Pending', time: '2025-02-22 10:45 AM' },

  ]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(receiptsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");
    XLSX.writeFile(workbook, "ReceiptsData.xlsx");
  };

  const handleFilter = () => {
    setFilterOpen(true);
    setSelectedReceipt(null); // Reset selected receipt for filtering
  };

  const handleDeleteRecords = () => {
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    
    setReceiptsData(prevData => prevData.filter(receipt => new Date(receipt.time) > cutoffDate));
    setDeleteOpen(false);
  };

  const applyFilter = () => {
    let filteredData = receiptsData;

    if (filterType === 'userid' && filterValue) {
      filteredData = filteredData.filter(receipt => receipt.userid === filterValue);
    } else if (filterType === 'status' && filterValue) {
      filteredData = filteredData.filter(receipt => receipt.status.includes(filterValue));
    } else if (filterType === 'time' && selectedDate) {
      // Format time comparison to string date without time for simplicity
      const selectedDateString = selectedDate.toISOString().split('T')[0];  // Format as YYYY-MM-DD
      filteredData = filteredData.filter(receipt => receipt.time.split(' ')[0] === selectedDateString);
    }

    setReceiptsData(filteredData);
    setFilterOpen(false);
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <br/>
      <br/>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="info" onClick={exportToExcel}>Export to Excel</Button>
        <Button variant="contained" color="error" onClick={handleDeleteRecords}>Delete Old Records</Button>
        <Button variant="contained" color="warning">Delete Duplicates</Button>
        <Button variant="contained" color="primary" onClick={handleFilter}>View Filter</Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ mt: 3, width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Action Taken</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receiptsData.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell>{receipt.id}</TableCell>
                <TableCell>{receipt.userid}</TableCell>
                <TableCell>{receipt.point}</TableCell>
                <TableCell>{receipt.status}</TableCell>
                <TableCell>{receipt.time}</TableCell>
                <TableCell>
                  <Select
                    value={actionType}
                    onChange={(e) => {
                      const selectedAction = e.target.value;
                      const newStatus = selectedAction === 'approve' ? '🟢 Approved' : selectedAction === 'discard' ? '🔴 Discarded' : '⚠️ Flagged';
                      setReceiptsData(prevData => prevData.map(r => r.id === receipt.id ? { ...r, status: newStatus } : r));
                    }}
                    disabled={receipt.status !== '🟡 Pending'} // Disable button if status is not Pending
                  >
<MenuItem value=""><em>Take Action</em></MenuItem> // Ensure button label is visible

                    <MenuItem value="approve">Approve</MenuItem>
                    <MenuItem value="discard">Discard</MenuItem>
                    <MenuItem value="flag">Flag</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, maxWidth: 400, mx: 'auto', mt: '10%', position: 'relative' }}>
          <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => setDeleteOpen(false)}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Select Months to Delete Records</Typography>
          <Select fullWidth value={months} onChange={(e) => setMonths(e.target.value)} sx={{ mt: 2 }} displayEmpty>
            <MenuItem value={6}>6 Months</MenuItem>
            <MenuItem value={12}>12 Months</MenuItem>
            <MenuItem value={18}>18 Months</MenuItem>
            <MenuItem value={24}>24 Months</MenuItem>
          </Select>
          <Typography sx={{ mt: 2 }}>Please confirm deletion of records older than {months} months.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="error" onClick={confirmDelete}>Confirm Deletion</Button>
            <Button variant="contained" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={filterOpen} onClose={() => setFilterOpen(false)} sx={{ p: 3 }}>
        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, maxWidth: 400, mx: 'auto', mt: '10%', position: 'relative' }}>
          <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => setFilterOpen(false)}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Filter Receipts</Typography>
          <Select fullWidth value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={{ mt: 2 }} displayEmpty>
            <MenuItem value=""><em>Select Filter Type</em></MenuItem>
            <MenuItem value="userid">User ID</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="time">Time</MenuItem>
          </Select>
          {filterType === 'status' && (
            <Select fullWidth value={filterValue} onChange={(e) => setFilterValue(e.target.value)} sx={{ mt: 2 }} displayEmpty>
              <MenuItem value=""><em>Select Status</em></MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Discarded">Discarded</MenuItem>
              <MenuItem value="Flagged">Flagged</MenuItem>
            </Select>
          )}
          {filterType === 'userid' && (
            <TextField
              fullWidth
              label="Enter User ID"
              variant="outlined"
              onChange={(e) => setFilterValue(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
          {filterType === 'time' && (
            <TextField
              fullWidth
              label="Enter Time (YYYY-MM-DD)"
              variant="outlined"
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              sx={{ mt: 2 }}
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={applyFilter}>Apply Filter</Button>
            <Button variant="contained" onClick={() => setFilterOpen(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" align="center">Manage your receipts effectively!</Typography>
      </Box>
    </Box>
  );
}

export default Receipts;
