import { Card, CardContent, Typography, TextField, Button, Divider, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CreditCardFields from './creditCard';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, deleteCart } from './orderSlice';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const cartItems = Array.isArray(location.state.cart) ? location.state.cart : [];
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 5);
    const currentUser = useSelector(s => s.user.currentUser);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const [formValues, setFormValues] = useState({
        fullName: '',
        address: '',
        city: '',
        phone: '',
        dueDate: ''
    });

    useEffect(() => {
        if (currentUser) {
            setFormValues(prev => ({
                ...prev,
                fullName: currentUser.name || '',
                phone: currentUser.phoneNumber || ''
            }));
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = Object.values(formValues).every(val => val.trim() !== '');

    const PlacingOrder = () => {
        const order = {
            orderDate: formatDate(today),
            dueDate: formValues.dueDate,
            userId: currentUser.id,
            cart: cartItems
        };
        dispatch(addOrder(order));
        dispatch(deleteCart(currentUser.id));
        navigate("/cart");
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: -1, p: 2, direction: 'rtl' }}>
            <Card sx={{ p: 2, borderRadius: '20px', boxShadow: 4 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom sx={{ color: '#5c4532' }}>
                        פרטי ההזמנה
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {cartItems.map((item, idx) => (
                        <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography>{item.name} (x{item.quantity})</Typography>
                            <Typography>{item.price * item.quantity} ₪</Typography>
                        </Box>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight="bold">סה"כ:</Typography>
                        <Typography fontWeight="bold">{totalPrice} ₪</Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>פרטי משלוח</Typography>

                    <TextField
                        required
                        label="שם מלא"
                        name="fullName"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formValues.fullName}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        label="כתובת"
                        name="address"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formValues.address}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        label="עיר"
                        name="city"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formValues.city}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        label="טלפון"
                        name="phone"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formValues.phone}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        label="מועד אספקה"
                        name="dueDate"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: formatDate(minDate) }}
                        value={formValues.dueDate}
                        onChange={handleChange}
                    />

                    <CreditCardFields />

                    <Box display="flex" justifyContent="space-between" mt={3} gap={2}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/cart')}
                            sx={{
                                color: '#5c4532',
                                borderColor: '#a86c3c',
                                '&:hover': {
                                    backgroundColor: '#f1e3d3',
                                    borderColor: '#915a30',
                                },
                            }}
                        >
                            חזרה לסל
                        </Button>

                        <Button
                            onClick={PlacingOrder}
                            disabled={!isFormValid}
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: '#a86c3c',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#915a30',
                                },
                            }}
                        >
                            סיום
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
