import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Button } from '@mui/material';
import { db, storage } from '../firebaseconfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Shops() {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newShop, setNewShop] = useState({
    storeID: 1001,
    name: "",
    title: "",
    description: "",
    phone: "",
    address: "",
    storeCategory: "",
    rating: 0,
    image: null, // Changed from empty string to null
    imageFile: null, // New field to track the File object
    imagePreview: null, // New field for preview URL
    logo: "",
    hours: { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "", Saturday: "", Sunday: "" }
  });

  const uploadImage = async (file) => {
    try {
      const imageRef = ref(storage, `shopImages/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'shops'));
        const shopsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShops(shopsList);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const handleCardClick = (shop) => setSelectedShop(selectedShop === shop ? null : shop);

  // ADD Shop
  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewShop({ ...newShop, name: "", description: "", image: "", address: "", phone: "", storeCategory: "", rating: 0, title: "", hours: { Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "", Saturday: "", Sunday: "" } });
  };
  // Modified ADD Shop function
  const handleAddShop = async () => {
    try {
      console.log("Attempting to add shop...");
      console.log("Form data before processing:", newShop);
      
      // Validate all required fields
      const requiredFields = ['name', 'description', 'storeCategory'];
      const missingFields = requiredFields.filter(field => !newShop[field] || (field === 'imageFile' && !newShop.imageFile));
      
      if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Ensure imageFile is not included in the shopData
      const { imageFile, ...shopData } = newShop;
      
      // Remove non-serializable fields
      delete shopData.imageFile;
      delete shopData.imagePreview;
      
      // Handle image upload if a file is selected
      if (newShop.imageFile instanceof File) {
        try {
          const imageUrl = await uploadImage(newShop.imageFile);
          shopData.image = imageUrl;
        } catch (error) {
          console.error("Image upload failed:", {
            error: error,
            message: error.message,
            stack: error.stack,
            file: newShop.image
          });
          shopData.image = ""; // Set empty string on upload failure
        }
      } else {
        console.log("No new image uploaded, using existing URL or empty.");
        shopData.image = shopData.image || "";
      }

      console.log("Final shop data to be saved:", shopData);
      
      // Add to Firestore
      console.log("Adding to Firestore collection 'shops'");
      const docRef = await addDoc(collection(db, 'shops'), shopData);
      console.log("Shop added with ID:", docRef.id);
      
      // Update local state
      setShops([...shops, { ...shopData, id: docRef.id }]);
      alert("Shop added successfully!");
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding shop:", {
        error: error,
        message: error.message,
        stack: error.stack,
        newShop: newShop
      });
      alert(`Failed to add shop: ${error.message}\nCheck console for details.`);
    }
  };

  // UPDATE Shop
  const handleOpenUpdateDialog = () => {
    if (!selectedShop) {
      alert("Please select a shop to update.");
      return;
    }
    setNewShop({
      ...selectedShop,
      imagePreview: selectedShop.image // Set initial preview to existing image
    });
    setOpenUpdateDialog(true);
  };
  const handleCloseUpdateDialog = () => setOpenUpdateDialog(false);
  // Modified UPDATE Shop function
const handleUpdateShop = async () => {
  try {
    if (!newShop.name || !newShop.description) {
      alert("Please fill in all required fields (Name & Description).");
      return;
    }

    let shopData = { ...newShop };
    // Remove non-serializable fields before update
    delete shopData.imageFile;
    delete shopData.imagePreview;
    
    // Handle image upload if a new file is selected
    if (newShop.imageFile && newShop.imageFile instanceof File) {
      try {
        console.log("Uploading new image for update...");
        // Validate image file type and size
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!validTypes.includes(newShop.imageFile.type)) {
          console.warn("Invalid image type:", newShop.imageFile.type);
          shopData.image = selectedShop.image; // Keep existing image if invalid type
        } else if (newShop.imageFile.size > maxSize) {
          console.warn("Image too large:", newShop.imageFile.size);
          shopData.image = selectedShop.image; // Keep existing image if too large
        } else {
          const imageRef = ref(storage, `shopImages/${Date.now()}-${newShop.imageFile.name}`);
          const snapshot = await uploadBytes(imageRef, newShop.imageFile);
          const imageUrl = await getDownloadURL(snapshot.ref);
          shopData.image = imageUrl;
          console.log("New image uploaded:", imageUrl);
        }
      } catch (error) {
        console.error("Image upload error:", error);
        shopData.image = selectedShop.image; // Fall back to existing image on error
      }
    } else {
      console.log("No new image uploaded, keeping existing image");
      shopData.image = shopData.image || selectedShop.image || "";
    }

    // Update in Firestore
    await updateDoc(doc(db, 'shops', selectedShop.id), shopData);
    setShops(shops.map(shop => 
      shop.id === selectedShop.id ? { ...shopData, id: selectedShop.id } : shop
    ));
    alert("Shop updated successfully!");
    handleCloseUpdateDialog();
  } catch (error) {
    console.error("Error updating shop:", error);
    alert("Failed to update shop: " + error.message);
  }
};

  // DELETE Shop
  const handleDelete = async () => {
    if (!selectedShop) {
      alert("Please select a shop to delete.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        await deleteDoc(doc(db, 'shops', selectedShop.id));
        setShops(shops.filter(shop => shop.id !== selectedShop.id));
        alert("Shop deleted successfully!");
        setSelectedShop(null);
      } catch (error) {
        console.error("Error deleting shop:", error);
        alert("Failed to delete shop.");
      }
    }
  };

  // VIEW Shop
  const handleOpenViewDialog = () => {
    if (!selectedShop) {
      alert("Please select a shop to view.");
      return;
    }
    setOpenViewDialog(true);
  };
  const handleCloseViewDialog = () => setOpenViewDialog(false);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {shops.map((shop) => (
          <Grid item xs={12} sm={6} md={4} key={shop.id}>
            <Card sx={{ cursor: "pointer", textAlign: "center", border: selectedShop === shop ? "2px solid blue" : "none" }} onClick={() => handleCardClick(shop)}>
              <CardMedia component="img" height="100" sx={{ maxWidth: "80px", margin: "auto" }} image={shop.image || "https://via.placeholder.com/300x200?text=No+Image"} alt={shop.name} />
              <CardContent>
                <Typography variant="h6">{shop.name}</Typography>
                <Typography variant="body2">{shop.description}</Typography>
                <Typography variant="body2">Address: {shop.address || "N/A"}</Typography>
                <Typography variant="body2">Rating: {shop.rating}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
<Button variant="contained" color="primary" onClick={handleOpenViewDialog} sx={{ m: 1 }} component="button">View Shop</Button>
<Button variant="contained" color="success" onClick={handleOpenAddDialog} component="button">Add Shop</Button>
<Button variant="contained" color="warning" onClick={handleOpenUpdateDialog} sx={{ ml: 1 }} component="button">Update Shop</Button>
<Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 1 }} component="button">Delete Shop</Button>
      </Box>

      {/* ADD Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add Shop</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Shop Name" value={newShop.name} onChange={(e) => setNewShop(prev => ({ ...prev, name: e.target.value }))} />
          <TextField fullWidth margin="dense" label="Description" value={newShop.description} onChange={(e) => setNewShop(prev => ({ ...prev, description: e.target.value }))} />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Logo
            <input 
              type="file" 
              hidden 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setNewShop(prev => ({
                      ...prev,
                      imageFile: file,
                      imagePreview: event.target.result
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </Button>
              {newShop.imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img 
                    src={newShop.imagePreview} 
                    alt="Logo preview" 
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                  <Typography variant="caption" display="block">
                    {newShop.imageFile?.name || 'No file selected'}
                  </Typography>
                </Box>
              )}
          <TextField fullWidth margin="dense" label="Store Category" value={newShop.storeCategory} onChange={(e) => setNewShop(prev => ({ ...prev, storeCategory: e.target.value }))} />
          <TextField fullWidth margin="dense" label="Rating" type="number" value={newShop.rating} onChange={(e) => setNewShop(prev => ({ ...prev, rating: parseInt(e.target.value, 10) }))} />
          <TextField fullWidth margin="dense" label="Title" value={newShop.title} onChange={(e) => setNewShop(prev => ({ ...prev, title: e.target.value }))} />
          <TextField fullWidth margin="dense" label="Phone" value={newShop.phone} onChange={(e) => setNewShop(prev => ({ ...prev, phone: e.target.value }))} />
          <TextField fullWidth margin="dense" label="Address" value={newShop.address} onChange={(e) => setNewShop(prev => ({ ...prev, address: e.target.value }))} />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Operating Hours</Typography>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
            <TextField
              key={day}
              fullWidth
              margin="dense"
              label={day}
              value={newShop.hours[day]}
              onChange={(e) => setNewShop(prev => ({ ...prev, hours: { ...prev.hours, [day]: e.target.value } }))}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddShop}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* UPDATE Dialog */}
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update Shop</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Shop Name" value={newShop.name} onChange={(e) => setNewShop(prev => ({ ...prev, name: e.target.value }))} />
          <TextField fullWidth margin="dense" label="Description" value={newShop.description} onChange={(e) => setNewShop(prev => ({ ...prev, description: e.target.value }))} />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Logo
            <input 
              type="file" 
              hidden 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setNewShop(prev => ({
                      ...prev,
                      imageFile: file,
                      imagePreview: event.target.result
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }} 
            />
          </Button>
          {newShop.imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img 
                src={newShop.imagePreview} 
                alt="Logo preview" 
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
              <Typography variant="caption" display="block">
                {newShop.imageFile?.name || 'No file selected'}
              </Typography>
            </Box>
          )}
          <TextField fullWidth margin="dense" label="Store Category" value={newShop.storeCategory} onChange={(e) => setNewShop(prev => ({ ...prev, storeCategory: e.target.value }))} />
          <TextField fullWidth margin="dense" label="Title" value={newShop.title} onChange={(e) => setNewShop(prev => ({ ...prev, title: e.target.value }))} />
          <TextField fullWidth margin="dense" label="Phone" value={newShop.phone} onChange={(e) => setNewShop(prev => ({ ...prev, phone: e.target.value }))} />
          <TextField fullWidth margin="dense" label="Address" value={newShop.address} onChange={(e) => setNewShop(prev => ({ ...prev, address: e.target.value }))} />
          <TextField fullWidth margin="dense" label="Rating" type="number" value={newShop.rating} onChange={(e) => setNewShop(prev => ({ ...prev, rating: parseInt(e.target.value, 10) }))} />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Operating Hours</Typography>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
            <TextField
              key={day}
              fullWidth
              margin="dense"
              label={day}
              value={newShop.hours[day]}
              onChange={(e) => setNewShop(prev => ({ ...prev, hours: { ...prev.hours, [day]: e.target.value } }))}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button onClick={handleUpdateShop}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* VIEW Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>Shop Details</DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          {selectedShop && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <img src={selectedShop.image} alt={selectedShop.name} width="100%" style={{ borderRadius: 8, boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{selectedShop.name}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>{selectedShop.description}</Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}><strong>Address:</strong> {selectedShop.address || "N/A"}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}><strong>Rating:</strong> {selectedShop.rating}</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Operating Hours:</Typography>
                    {selectedShop.hours && Object.entries(selectedShop.hours).map(([day, time]) => (
                      <Typography key={day} variant="body2">{day}: {time || "Closed"}</Typography>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseViewDialog} variant="outlined" color="primary" sx={{ width: '100%' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Shops;