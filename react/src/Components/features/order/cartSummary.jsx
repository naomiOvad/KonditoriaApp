import React from 'react';
import { Button, Card, CardContent, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getMyCart, updateProductQuantity, removeProductFromCart } from './orderSlice';
import { useNavigate } from 'react-router-dom';

export default function CartSummary() {
  let navigate = useNavigate();

  const images = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png}', { eager: true });

  const getImageUrl = (fileName) => {
    if (!fileName) return null;
    const normalizedFileName = fileName.endsWith('.jpg') ? fileName : `${fileName}.jpg`;
    const found = Object.entries(images).find(([path]) =>
      path.toLowerCase().includes(normalizedFileName.toLowerCase())
    );
    return found ? found[1].default : null;
  };

  let dispatch = useDispatch();
  let currentUser = useSelector(s => s.user.currentUser);
  const CartItems = useSelector(s => s.order.myCart);
  const isCartEmpty =CartItems.cart&& CartItems.cart.length === 0;

  const total = CartItems && CartItems.cart
    ? CartItems.cart.reduce((sum, item) => {
      if (!item || item.price == null || item.quantity == null) return sum;
      return sum + item.price * item.quantity;
    }, 0)
    : 0;

  useEffect(() => {
    if (currentUser)
      dispatch(getMyCart(currentUser.id));
  }, [currentUser]);

  const handleIncrease = (productId) => {
    const product = CartItems.cart.find(p => p.id === productId);
    if (!product) return;
    dispatch(updateProductQuantity({
      userId: currentUser.id,
      productId,
      quantity: product.quantity + 1
    }));
  };

  const handleDecrease = (productId) => {
    const product = CartItems.cart.find(p => p.id === productId);
    if (!product || product.quantity <= 1) return;
    dispatch(updateProductQuantity({
      userId: currentUser.id,
      productId,
      quantity: product.quantity - 1
    }));
  };

  const handleRemove = (productId) => {
    dispatch(removeProductFromCart({
      userId: currentUser.id,
      productId
    }));
  };

  const handleCheckout = () => {
    navigate("/CheckoutPage", { state: CartItems });
  };

  if (!CartItems || !CartItems.cart) {
    return (
      <Card
        style={{
          position: 'fixed',
          left: 510,
          top: 100,
          width: 500,
          maxHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9f9f9',
          zIndex: 1000,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          padding: 32
        }}
      >
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card
      style={{
        position: 'fixed',
        left: 510,
        top: 100,
        width: 500,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9f9f9',
        zIndex: 1000,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
      }}
    >
      <div style={{ overflowY: 'auto', padding: 16, flex: 1 }}>
        <h3 style={{ marginBottom: 16 }}>🛒 הסל שלי</h3>

        {CartItems.cart.length === 0 ? (
          <p>אין מוצרים בסל.</p>
        ) : (
          <>
            {CartItems.cart.map((item, index) => (
              <div key={index} style={{ marginBottom: 12, textAlign: 'center' }}>
                <strong>{item.name}</strong>
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  style={{
                    width: '80%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    margin: '12px auto',
                    display: 'block'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 9,
                  marginTop: 4
                }}>
                  <IconButton size="small" onClick={() => handleDecrease(item.id)}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <span>{item.quantity}</span>
                  <IconButton size="small" onClick={() => handleIncrease(item.id)}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleRemove(item.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))}
            <hr style={{ margin: '12px 0' }} />
            <p><strong>סה"כ: ₪{total}</strong></p>
          </>
        )}
      </div>

      <div style={{ padding: 16, borderTop: '1px solid #ccc' }}>
        <Button
          disabled={isCartEmpty} // ← כאן מתבצעת המניעה
          variant="contained"
          fullWidth
          onClick={handleCheckout}
          style={{
            backgroundColor: '#a97342',
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          מעבר לתשלום
        </Button>
      </div>
    </Card>
  );
}
