import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, RadioButtonUnchecked as RadioButtonUncheckedIcon, Edit as EditIcon } from '@mui/icons-material';

interface ShoppingItem {
  id: bigint;
  text: string;
  description: string;
  completed: boolean;
  createdAt: bigint;
  dueDate: bigint | null;
}

const App: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ShoppingItem | null>(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      showSnackbar('Error fetching items');
    }
  };

  const handleAddItem = async () => {
    if (newItem.trim() === '') return;
    setActionLoading(true);
    try {
      const dueDateTimestamp = newDueDate ? BigInt(new Date(newDueDate).getTime()) : null;
      const result = await backend.addItem(newItem, newDescription, dueDateTimestamp);
      if ('ok' in result) {
        setNewItem('');
        setNewDescription('');
        setNewDueDate('');
        await fetchItems();
        showSnackbar('Item added successfully');
      } else {
        showSnackbar('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      showSnackbar('Error adding item');
    }
    setActionLoading(false);
  };

  const handleToggleComplete = async (id: bigint) => {
    setActionLoading(true);
    try {
      await backend.markItemCompleted(id);
      await fetchItems();
      showSnackbar('Item status updated');
    } catch (error) {
      console.error('Error toggling item:', error);
      showSnackbar('Error updating item status');
    }
    setActionLoading(false);
  };

  const handleDeleteItem = async (id: bigint) => {
    setActionLoading(true);
    try {
      await backend.deleteItem(id);
      await fetchItems();
      showSnackbar('Item deleted');
    } catch (error) {
      console.error('Error deleting item:', error);
      showSnackbar('Error deleting item');
    }
    setActionLoading(false);
  };

  const handleEditClick = (item: ShoppingItem) => {
    setEditItem(item);
    setEditText(item.text);
    setEditDescription(item.description);
    setEditDueDate(item.dueDate ? new Date(Number(item.dueDate)).toISOString().split('T')[0] : '');
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    setActionLoading(true);
    try {
      const dueDateTimestamp = editDueDate ? BigInt(new Date(editDueDate).getTime()) : null;
      await backend.editItem(editItem.id, editText, editDescription, dueDateTimestamp);
      await fetchItems();
      setEditDialogOpen(false);
      showSnackbar('Item updated successfully');
    } catch (error) {
      console.error('Error editing item:', error);
      showSnackbar('Error updating item');
    }
    setActionLoading(false);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
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
        <TextField
          fullWidth
          variant="outlined"
          label="Due Date"
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
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
              secondary={
                <>
                  {item.description}
                  {item.dueDate && (
                    <Typography component="span" variant="body2" color="textSecondary">
                      {' | Due: '}{new Date(Number(item.dueDate)).toLocaleDateString()}
                    </Typography>
                  )}
                </>
              }
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
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default App;
