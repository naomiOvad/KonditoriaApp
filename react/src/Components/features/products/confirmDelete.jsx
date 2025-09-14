import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

function ConfirmDelete({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle >אישור מחיקה</DialogTitle>
      <DialogContent>
        <DialogContentText>
          האם את/ה בטוח/ה שברצונך למחוק את המוצר?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ color: '#a97342', borderColor: '#a97342', marginLeft: 12 }}
        >ביטול</Button>
        <Button onClick={onConfirm} color="error" style={{ backgroundColor: '#a97342', color: '#fff' }}
        >מחק</Button>
      </DialogActions>
    </Dialog>
  );
}
export default ConfirmDelete;
