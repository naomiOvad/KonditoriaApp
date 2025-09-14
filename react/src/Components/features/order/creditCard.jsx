import { Box, TextField, Typography, Grid } from '@mui/material';
import { useState } from 'react';

export default function CreditCardFields() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // פורמט של כרטיס: אוטומטית מוסיף " / " אחרי כל 4 ספרות
  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 / ')
      .trim()
      .slice(0, 25); // כולל הרווחים והסלאשים
  };

  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom sx={{ color: '#5c4532' }}>
        פרטי כרטיס אשראי
      </Typography>

      <TextField
        label="מספר כרטיס אשראי"
        variant="outlined"
        fullWidth
        margin="normal"
        value={cardNumber}
        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
        placeholder="0000 / 0000 / 0000 / 0000"
      />

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            label="תוקף (MM/YY)"
            value={expiry}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, '').slice(0, 4);
              if (val.length >= 3) {
                val = val.slice(0, 2) + '/' + val.slice(2);
              }
              setExpiry(val);
            }}
            placeholder="MM/YY"
            inputProps={{ maxLength: 5 }}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="CVV"
            value={cvv}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 3);
              setCvv(val);
            }}
            inputProps={{ maxLength: 3 }}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
