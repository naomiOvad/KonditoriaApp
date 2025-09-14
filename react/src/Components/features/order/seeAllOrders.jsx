import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllOrders } from "./orderSlice";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";

export default function SeeAllOrders() {
  const dispatch = useDispatch();
  const orders = useSelector((s) => s.order.allOrders);

  useEffect(() => {
    dispatch(getAllOrders());
  }, []);

  if (!orders || orders.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        לא נמצאו הזמנות.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom textAlign="center" color="primary">
        כל ההזמנות
      </Typography>

      {orders.map((order, index) => (
        <Card key={index} sx={{ mb: 3, boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              הזמנה #{index + 1}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              תאריך: {order.orderDate} | אספקה עד: {order.dueDate}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              מזהה לקוח: {order.userId}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {order.cart.map((product, i) => (
              <Box key={i} sx={{ mb: 1 }}>
                <Typography>
                  <strong>{product.name}</strong> - {product.price} ₪ × {product.quantity}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ mt: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
              סך הכול: {order.cart.reduce((sum, p) => sum + p.price * p.quantity, 0)} ₪
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
