import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateProduct, addProduct } from './productSlice';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Alert,
  Stack
} from '@mui/material';

export default function AddUpdateProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productChange = location.state || {
    name: '',
    price: '',
    category: '',
    image: '',
    id: ''
  };

  const [product, setProduct] = useState({ ...productChange });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const saveChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setProduct((prev) => ({
        ...prev,
        image: file.name
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.category || !product.image) {
      setError('יש למלא את כל השדות כולל תמונה.');
      return;
    }
    setError('');

    if (location.state) {
      dispatch(updateProduct(product));
    } else {
      dispatch(addProduct(product));
    }
    navigate(-1);
  };

  const images = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png}', { eager: true });
  const getImageUrl = (fileName) => {
    const entry = Object.entries(images).find(([path]) =>
      path.toLowerCase().includes(fileName.toLowerCase())
    );
    return entry ? entry[1].default : null;
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom sx={{ color: '#a97342' }}>
            {location.state ? 'עדכון מוצר' : 'הוספת מוצר חדש'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="שם המוצר"
                  name="name"
                  value={product.name}
                  onChange={saveChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="מחיר"
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={saveChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="קטגוריה"
                  name="category"
                  value={product.category}
                  onChange={saveChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                  >
                    בחר תמונה
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {product.image && (
                    <Typography variant="body2">
                      קובץ נבחר: {product.image}
                    </Typography>
                  )}
                </Stack>
              </Grid>
              {location.state && product.image && (
                <Grid item xs={12} textAlign="center">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    style={{ maxWidth: '80%', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: '#a97342', color: 'white', fontWeight: 'bold' }}
                >
                  {location.state ? 'עדכן' : 'הוסף'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
