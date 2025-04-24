import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, TextField, IconButton, Menu, MenuItem, Input, FormControl, InputLabel, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { db, storage } from '../firebaseconfig'; // Adjust the path to your firebase.js file
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function Rewards() {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [newReward, setNewReward] = useState({
    id: '',
    name: '',
    description: '',
    limitLeft: '',
    photoLink: '',
    title: '',
    points: '',
    storeID: '',
    storeName: '',
    logoPicture: ''
  });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [rewardsData, setRewardsData] = useState([]);
  const [filterField, setFilterField] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // Fetch rewards from Firestore on component mount
  useEffect(() => {
    const fetchRewards = async () => {
      const rewardsCollection = collection(db, 'rewards');
      const rewardsSnapshot = await getDocs(rewardsCollection);
      const rewardsList = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRewardsData(rewardsList);
    };
    fetchRewards();
  }, []);

  const handleOpen = (reward) => {
    setSelectedReward(reward);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUpdateOpen(false);
    setAddOpen(false);
    setSelectedReward(null);
  };

  const handleMenuClick = (event, reward) => {
    setSelectedReward(reward);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleUpdateOpen = () => {
    setUpdateOpen(true);
    handleMenuClose();
  };

  const handleUpdateChange = (e) => {
    setSelectedReward({ ...selectedReward, [e.target.name]: e.target.value });
  };

  const handleAddChange = (e) => {
    setNewReward({ ...newReward, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e, field, isAdd = false) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `rewards/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      if (isAdd) {
        setNewReward({ ...newReward, [field]: url });
      } else {
        setSelectedReward({ ...selectedReward, [field]: url });
      }
    }
  };
  const handleUpdateSubmit = async () => {
    const keys = Object.keys(selectedReward);
    for (let key of keys) {
      if (selectedReward[key] === '' || selectedReward[key] === null) {
        alert("All fields are required.");
        return;
      }
    }
    const rewardDoc = doc(db, 'rewards', selectedReward.id);
    await updateDoc(rewardDoc, selectedReward);
    setRewardsData(rewardsData.map(r => r.id === selectedReward.id ? selectedReward : r));
    handleClose();
  };

  const handleAddSubmit = async () => {
    const keys = Object.keys(newReward).filter(key => key !== 'id');
    for (let key of keys) {
      if (newReward[key] === '' || newReward[key] === null) {
        alert("All fields are required.");
        return;
      }
    }
    const rewardsCollection = collection(db, 'rewards');
    const docRef = await addDoc(rewardsCollection, newReward);
    setRewardsData([...rewardsData, { id: docRef.id, ...newReward }]);
    setNewReward({
      id: '',
      name: '',
      description: '',
      limitLeft: '',
      photoLink: '',
      title: '',
      points: '',
      storeID: '',
      storeName: '',
      logoPicture: ''
    });
    handleClose();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this reward?")) {
      const rewardDoc = doc(db, 'rewards', selectedReward.id);
      await deleteDoc(rewardDoc);
      setRewardsData(rewardsData.filter(r => r.id !== selectedReward.id));
    }
    handleMenuClose();
  };

  const handleAddOpen = () => {
    setNewReward({
      id: '',
      name: '',
      description: '',
      limitLeft: '',
      photoLink: '',
      title: '',
      points: '',
      storeID: '',
      storeName: '',
      logoPicture: ''
    });
    setAddOpen(true);
  };

  const filteredRewards = rewardsData.filter((reward) => {
    if (!filterField) return true;
    const fieldValue = reward[filterField] ? String(reward[filterField]).toLowerCase() : '';
    return fieldValue.includes(filterQuery.toLowerCase());
  });

  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedRewards = useMemo(() => {
    let sortableRewards = [...filteredRewards];
    if (sortConfig.key) {
      sortableRewards.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        } else {
          return sortConfig.direction === 'asc'
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        }
      });
    }
    return sortableRewards;
  }, [filteredRewards, sortConfig]);

  const clearFilter = () => {
    setFilterQuery('');
    setFilterField('');
  };

  const renderSortIndicator = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  return (
    <Box sx={{ p: 3 }}>
      <br />
      <br />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleAddOpen}>
          Add Reward
        </Button>
      </Box>

      {/* Enhanced Filter Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <FormControl sx={{ minWidth: 150, mr: 2 }}>
          <InputLabel id="filter-field-label">Filter By</InputLabel>
          <Select
            labelId="filter-field-label"
            value={filterField}
            label="Filter By"
            onChange={(e) => setFilterField(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="storeName">Store Name</MenuItem>
            <MenuItem value="points">Points</MenuItem>
            <MenuItem value="limitLeft">Limit Left</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search Keyword"
          variant="outlined"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          sx={{ mr: 2, flex: 1 }}
          disabled={!filterField}
        />
        <Button variant="outlined" color="secondary" onClick={clearFilter}>
          Clear
        </Button>
      </Box>

      <br />
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('id')} sx={{ cursor: 'pointer' }}>
                ID{renderSortIndicator('id')}
              </TableCell>
              <TableCell onClick={() => handleSort('name')} sx={{ cursor: 'pointer' }}>
                Name{renderSortIndicator('name')}
              </TableCell>
              <TableCell onClick={() => handleSort('description')} sx={{ cursor: 'pointer' }}>
                Description{renderSortIndicator('description')}
              </TableCell>
              <TableCell onClick={() => handleSort('limitLeft')} sx={{ cursor: 'pointer' }}>
                Limit Left{renderSortIndicator('limitLeft')}
              </TableCell>
              <TableCell onClick={() => handleSort('points')} sx={{ cursor: 'pointer' }}>
                Points{renderSortIndicator('points')}
              </TableCell>
              <TableCell onClick={() => handleSort('title')} sx={{ cursor: 'pointer' }}>
                Title{renderSortIndicator('title')}
              </TableCell>
              <TableCell onClick={() => handleSort('storeID')} sx={{ cursor: 'pointer' }}>
                Store ID{renderSortIndicator('storeID')}
              </TableCell>
              <TableCell onClick={() => handleSort('storeName')} sx={{ cursor: 'pointer' }}>
                Store Name{renderSortIndicator('storeName')}
              </TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>Logo</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRewards.map((reward) => (
              <TableRow key={reward.id}>
                <TableCell>{reward.id}</TableCell>
                <TableCell>{reward.name}</TableCell>
                <TableCell>{reward.description}</TableCell>
                <TableCell>{reward.limitLeft}</TableCell>
                <TableCell>{reward.points}</TableCell>
                <TableCell>{reward.title}</TableCell>
                <TableCell>{reward.storeID}</TableCell>
                <TableCell>{reward.storeName}</TableCell>
                <TableCell>
                  {reward.photoLink ? (
                    <img
                      src={reward.photoLink}
                      alt="Reward Photo"
                      style={{ maxWidth: '50px', maxHeight: '50px' }}
                    />
                  ) : (
                    'No Photo'
                  )}
                </TableCell>
                <TableCell>
                  {reward.logoPicture ? (
                    <img
                      src={reward.logoPicture}
                      alt="Store Logo"
                      style={{ maxWidth: '50px', maxHeight: '50px' }}
                    />
                  ) : (
                    'No Logo'
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleMenuClick(event, reward)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleOpen(reward)}>View</MenuItem>
                    <MenuItem onClick={handleUpdateOpen}>Update</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 3, width: 400, maxHeight: '80vh', overflowY: 'auto' }}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
          {selectedReward && (
            <>
              <Typography variant="h6" gutterBottom>Reward Details</Typography>
              <Typography><strong>ID:</strong> {selectedReward.id}</Typography>
              <Typography><strong>Name:</strong> {selectedReward.name}</Typography>
              <Typography><strong>Description:</strong> {selectedReward.description}</Typography>
              <Typography><strong>Limit Left:</strong> {selectedReward.limitLeft}</Typography>
              <Typography><strong>Points:</strong> {selectedReward.points}</Typography>
              <Typography><strong>Title:</strong> {selectedReward.title}</Typography>
              <Typography><strong>Store ID:</strong> {selectedReward.storeID}</Typography>
              <Typography><strong>Store Name:</strong> {selectedReward.storeName}</Typography>
              {selectedReward.photoLink && (
                <Box sx={{ mt: 2 }}>
                  <Typography><strong>Photo:</strong></Typography>
                  <img src={selectedReward.photoLink} alt="Reward Photo" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </Box>
              )}
              {selectedReward.logoPicture && (
                <Box sx={{ mt: 2 }}>
                  <Typography><strong>Logo:</strong></Typography>
                  <img src={selectedReward.logoPicture} alt="Store Logo" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </Box>
              )}
            </>
          )}
        </Box>
      </Modal>

      {/* Update Modal */}
      <Modal open={updateOpen} onClose={handleClose}>
  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 3, width: 400 }}>
    <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
      <CloseIcon />
    </IconButton>
    <Typography variant="h6" gutterBottom>Update Reward</Typography>
    <TextField
      label="Reward Name"
      name="name"
      value={selectedReward?.name}
      onChange={handleUpdateChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Description"
      name="description"
      value={selectedReward?.description}
      onChange={handleUpdateChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Points"
      name="points"
      value={selectedReward?.points}
      onChange={handleUpdateChange}
      fullWidth
      sx={{ mb: 2 }}
      type="number"
    />
    <TextField
      label="Limit Left"
      name="limitLeft"
      value={selectedReward?.limitLeft}
      onChange={handleUpdateChange}
      fullWidth
      sx={{ mb: 2 }}
      type="number"
    />
    <TextField
      label="Title"
      name="title"
      value={selectedReward?.title}
      onChange={handleUpdateChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Store ID"
      name="storeID"
      value={selectedReward?.storeID}
      onChange={handleUpdateChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Store Name"
      name="storeName"
      value={selectedReward?.storeName}
      onChange={handleUpdateChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <Box sx={{ mb: 2 }}>
      <label>Upload Photo:</label>
      <Input
        type="file"
        onChange={(e) => handleFileChange(e, 'photoLink')}
        fullWidth
      />
      {selectedReward?.photoLink && (
        <img src={selectedReward.photoLink} alt="Current Photo" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '8px' }} />
      )}
    </Box>
    <Box sx={{ mb: 2 }}>
      <label>Upload Logo:</label>
      <Input
        type="file"
        onChange={(e) => handleFileChange(e, 'logoPicture')}
        fullWidth
      />
      {selectedReward?.logoPicture && (
        <img src={selectedReward.logoPicture} alt="Current Logo" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '8px' }} />
      )}
    </Box>
    <Button variant="contained" color="primary" onClick={handleUpdateSubmit} fullWidth>
      Update Reward
    </Button>
  </Box>
</Modal>

      {/* Add Modal */}
      <Modal open={addOpen} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 3, width: 400 }}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>Add Reward</Typography>
          <TextField
            label="Reward Name"
            name="name"
            value={newReward.name}
            onChange={handleAddChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={newReward.description}
            onChange={handleAddChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Points"
            name="points"
            value={newReward.points}
            onChange={handleAddChange}
            fullWidth
            sx={{ mb: 2 }}
            type="number" // Ensure points is a number
          />
          <TextField
            label="Limit Left"
            name="limitLeft"
            value={newReward.limitLeft}
            onChange={handleAddChange}
            fullWidth
            sx={{ mb: 2 }}
            type="number" // Ensure limitLeft is a number
          />
          <TextField
            label="Title"
            name="title"
            value={newReward.title}
            onChange={handleAddChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Store ID"
            name="storeID"
            value={newReward.storeID}
            onChange={handleAddChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Store Name"
            name="storeName"
            value={newReward.storeName}
            onChange={handleAddChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <label>Upload Photo:</label>
            <Input
              type="file"
              onChange={(e) => handleFileChange(e, 'photoLink', true)}
              fullWidth
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <label>Upload Logo:</label>
            <Input
              type="file"
              onChange={(e) => handleFileChange(e, 'logoPicture', true)}
              fullWidth
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleAddSubmit} fullWidth>
            Add Reward
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Rewards;
