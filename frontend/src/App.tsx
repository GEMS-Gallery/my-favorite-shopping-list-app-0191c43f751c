import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, CircularProgress, Box } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, RadioButtonUnchecked as RadioButtonUncheckedIcon } from '@mui/icons-material';

interface ShoppingItem {
  id: bigint;
  text: string;
  completed: boolean;
  createdAt: bigint;
}

const App: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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
      await backend.addItem(newItem);
      setNewItem('');
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
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Add new item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          disabled={actionLoading}
          sx={{ ml: 1 }}
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
            <ListItemText primary={item.text} sx={{ textDecoration: item.completed ? 'line-through' : 'none' }} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)} disabled={actionLoading}>
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
    </Container>
  );
};

export default App;
