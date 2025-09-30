import React, { useEffect, useState } from 'react';
import {
  Button, TextField, Dialog, DialogActions,
  DialogContent, DialogTitle, Snackbar, Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import API_BASE_URL from '../config';

const API_URL = `${API_BASE_URL}/restaurants`;

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      //console.log("Calling API:", API_URL);
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleOpen = (restaurant = null) => {
    if (restaurant) {
      setEditId(restaurant._id);
      setForm({ name: restaurant.name, email: restaurant.email, password: '' });
    } else {
      setEditId(null);
      setForm({ name: '', email: '', password: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

const handleSubmit = async () => {
  const token = localStorage.getItem('token');

  // ✅ Debug: Check if token is available before API call
  if (!token) {
    console.error("❌ No token found in localStorage");
    setSnackbar({ open: true, message: "You must log in first.", severity: "error" });
    return;
  }

  try {
    let payload = { name: form.name, email: form.email };
    if (form.password) {
      payload.password = form.password;
    }

    const headers = { Authorization: `Bearer ${token}` };

    if (editId) {
      await axios.put(`${API_URL}/${editId}`, payload, { headers });
      setSnackbar({ open: true, message: "Restaurant updated!", severity: "success" });
    } else {
      await axios.post(API_URL, payload, { headers });
      setSnackbar({ open: true, message: "Restaurant added!", severity: "success" });
    }

    fetchRestaurants();
    handleClose();
  } catch (err) {
    console.error("❌ API Error:", err.response?.data || err.message);
    setSnackbar({
      open: true,
      message: err.response?.data?.error || "Error",
      severity: "error",
    });
  }
};



  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: 'Restaurant deleted!', severity: 'info' });
      fetchRestaurants();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'restaurantId', headerName: 'Restaurant ID', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <>
          <Button onClick={() => handleOpen(row)} variant="outlined" size="small" style={{ marginRight: 8 }}>Edit</Button>
          <Button onClick={() => handleDelete(row._id)} variant="outlined" size="small" color="error">Delete</Button>
        </>
      ),
      flex: 1
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Restaurants</h2>
      <Button variant="contained" onClick={() => handleOpen()} style={{ marginBottom: 20 }}>Add Restaurant</Button>

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
            rows={restaurants.map(r => ({ ...r, id: r._id }))}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={10}
            autoHeight
            checkboxSelection
            disableSelectionOnClick
            sx={{ borderRadius: 2, boxShadow: 1 }}
        />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit' : 'Add'} Restaurant</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          {!editId && (
            <TextField
              margin="dense"
              label="Password"
              fullWidth
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
}
