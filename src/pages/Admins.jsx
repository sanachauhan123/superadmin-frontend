// src/pages/Admins.jsx
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config'

const API_URL = `${API_BASE_URL}/admin`;
const token = localStorage.getItem('token');
//console.log(token)

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const fetchAdmins = async () => {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    setAdmins(res.data.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpen = (admin) => {
    if (admin) {
      setEditId(admin._id);
      setFormData({ name: admin.name, email: admin.email, password: '' });
    } else {
      setEditId(null);
      setFormData({ name: '', email: '', password: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token'); // ✅ fetch token at runtime
    console.log("Token being used:", token); // ✅ debug line
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/register`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      handleClose();
      fetchAdmins();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAdmins();
  };
  const currentAdminId = JSON.parse(localStorage.getItem('admin'))?.admin?.id;
  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const isCurrentUser = params.row._id === currentAdminId;
        return (
          <>
            <Button onClick={() => handleOpen(params.row)}>Edit</Button>
            {!isCurrentUser && (
              <Button color="error" onClick={() => handleDelete(params.row._id)}>Delete</Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h2>Admin Management</h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen(null)} style={{ marginBottom: 16 }}>
        Add Admin
      </Button>
      <DataGrid
        rows={admins}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={10}
        autoHeight
        checkboxSelection
        disableSelectionOnClick
        sx={{ borderRadius: 2, boxShadow: 1 }}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Admin' : 'Add Admin'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="name" label="Name" fullWidth value={formData.name} onChange={handleChange} />
          <TextField margin="dense" name="email" label="Email" fullWidth value={formData.email} onChange={handleChange} />
          <TextField margin="dense" name="password" label="Password" fullWidth type="password" value={formData.password} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admins;
