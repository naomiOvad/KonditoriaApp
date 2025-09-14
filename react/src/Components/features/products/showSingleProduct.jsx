import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import ConfirmDelete from './confirmDelete';
import {
  Card, CardContent, CardMedia,
  IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Typography
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { addToCart } from '../order/orderSlice';
import EditIcon from '@mui/icons-material/Edit';

const ShowSingleProduct = ({ oneProduct, funcUpdate, funcDelete, funcImage, onAddToCart }) => {
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const currentUser = useSelector(s => s.user.currentUser);
  const manager = useSelector(s => s.user.manager);

  const handleDelete = () => {
    funcDelete(oneProduct.id);
    setOpenDeleteDialog(false);
  };

  const handleAddToCart = async () => {
    let productToAdd = { ...oneProduct, quantity };
    console.log("productToAdd",productToAdd)
    await dispatch(addToCart({ id: currentUser.id, product: productToAdd }));
    setOpenCartDialog(false);
    setQuantity(1);
    setTimeout(() => onAddToCart(), 500); // 3 שניות


  };

  return (
    <Card style={{ maxWidth: 570, borderRadius: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.1)', margin: 'auto' }}>
      <CardMedia
        component="img"
        height="220"
        image={funcImage(oneProduct.image)}
        alt={oneProduct.name}
        style={{ objectFit: 'cover' }}
      />
      <CardContent style={{ textAlign: 'center' }}>
        <Typography variant="h6">{oneProduct.name}</Typography>
        <Typography variant="body2" color="text.secondary">{oneProduct.price} ₪</Typography>

        {/* מנהל */}
        {manager && (
          <>
            <IconButton onClick={() => setOpenDeleteDialog(true)}><DeleteIcon style={{ color: '#a97342' }} /></IconButton>
            <IconButton onClick={funcUpdate}> <EditIcon style={{ color: '#a97342' }} /> </IconButton>
            <ConfirmDelete
              open={openDeleteDialog}
              onClose={() => setOpenDeleteDialog(false)}
              onConfirm={handleDelete}
              
            />
          </>
        )}

        {/* משתמש */}
        {currentUser && (
          <IconButton
            onClick={() => setOpenCartDialog(true)}
            sx={{
              color: '#a97342',
              '&:hover': {
                color: '#8b5c2c',
              },
            }}
          >
            <AddShoppingCartIcon />
          </IconButton>

        )}
      </CardContent>

      {/* דיאלוג כמות */}
      <Dialog open={openCartDialog} onClose={() => setOpenCartDialog(false)} maxWidth="xs" fullWidth>
        <DialogContent style={{ textAlign: 'center' }}>
          <img
            src={funcImage(oneProduct.image)}
            alt={oneProduct.name}
            style={{
              width: '80%',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '16px'
            }}
          />
          <DialogTitle style={{ textAlign: 'center' }}>{oneProduct.name}</DialogTitle>

          <p>מחיר: {oneProduct.price * quantity} ₪</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <IconButton onClick={() => quantity > 1 && setQuantity(prev => prev - 1)}>
              <RemoveIcon />
            </IconButton>
            <span>{quantity}</span>
            <IconButton onClick={() => setQuantity(prev => prev + 1)}>
              <AddIcon />
            </IconButton>
          </div>
        </DialogContent>

        <DialogActions style={{ justifyContent: 'center', marginBottom: 12 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenCartDialog(false)}
            style={{ color: '#a97342', borderColor: '#a97342', marginLeft: 12 }}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={handleAddToCart}
            style={{ backgroundColor: '#a97342', color: '#fff' }}
          >
            הוסף לסל
          </Button>
        </DialogActions>



      </Dialog>
    </Card>
  );
};

export default ShowSingleProduct;
