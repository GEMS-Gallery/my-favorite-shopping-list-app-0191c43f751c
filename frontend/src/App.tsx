import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, RadioButtonUnchecked as RadioButtonUncheckedIcon, Edit as EditIcon } from '@mui/icons-material';

interface ShoppingItem {
  id: bigint;
  text: string;
  description: string;
  completed: boolean;
  createdAt: bigint;
}

const App: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ShoppingItem | null>(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const result = await backend.getItems();
      setItems(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (newItem.trim() === '') return;
    setActionLoading(true);
    try {
      await backend.addItem(newItem, newDescription);
      setNewItem('');
      setNewDescription('');
      await fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
    setActionLoading(false);
  };

  const handleToggleComplete = async (id: bigint) => {
    setActionLoading(true);
    try {
      await backend.markItemCompleted(id);
      await fetchItems();
    } catch (error) {
      console.error('Error toggling item:', error);
    }
    setActionLoading(false);
  };

  const handleDeleteItem = async (id: bigint) => {
    setActionLoading(true);
    try {
      await backend.deleteItem(id);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setActionLoading(false);
  };

  const handleEditClick = (item: ShoppingItem) => {
    setEditItem(item);
    setEditText(item.text);
    setEditDescription(item.description);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    setActionLoading(true);
    try {
      await backend.editItem(editItem.id, editText, editDescription);
      await fetchItems();
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error editing item:', error);
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Shopping List
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Add new item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          disabled={actionLoading}
        >
          Add
        </Button>
      </Box>
      <List>
        {items.map((item) => (
          <ListItem key={Number(item.id)} dense button onClick={() => handleToggleComplete(item.id)}>
            <ListItemIcon>
              {item.completed ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon />}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              secondary={item.description}
              sx={{ textDecoration: item.completed ? 'line-through' : 'none' }} 
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={(e) => { e.stopPropagation(); handleEditClick(item); }} disabled={actionLoading}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} disabled={actionLoading}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {actionLoading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={24} />
        </Box>
      )}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item"
            fullWidth
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
