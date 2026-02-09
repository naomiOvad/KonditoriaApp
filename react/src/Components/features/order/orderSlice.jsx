import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'axios'

const initialState = {
    myCart: {
        userId: null,
        cart: []
    },
    myOrder: [],
    allOrders: []
}

export const getMyCart = createAsyncThunk("order-getMyCart", async (userId) => {
    try {
        let { data } = await axios.get("/api/cart/" + userId)
        console.log("in getMyCart func")
        console.log(data)
        return data

    } catch {
        console.log("");
    }
})
export const addToCart = createAsyncThunk("order-addToCart", async ({ id, product }) => {
    try {
        let { data } = await axios.post("/api/cart/add-product/" + id, product);
        console.log("in addToCart func");
        console.log(data);
        return product;
    } catch (err) {
        console.log("שגיאה:", err);
    }
});

export const updateProductQuantity = createAsyncThunk("order/updateProductQuantity", async ({ userId, productId, quantity }) => {
    try {
        const { data } = await axios.patch(`/api/cart/${userId}/product/${productId}`, { quantity, });
        return { productId, quantity };
    } catch (err) {
        console.error("שגיאה בעדכון כמות:", err);
    }
}
);

export const removeProductFromCart = createAsyncThunk(
    "order/removeProductFromCart",
    async ({ userId, productId }) => {
        try {
            await axios.delete(`/api/cart/${userId}/product/${productId}`);
            return productId;
        } catch (err) {
            console.error("שגיאה במחיקת מוצר:", err);
        }
    }
);

export const deleteCart = createAsyncThunk(
    "order/deleteCart",
    async (id) => {
        try {
            await axios.delete(`/api/cart/${id}`);
            return id;
        } catch (err) {
            console.error("שגיאה במחיקת סל:", err);
        }
    }
);


export const addOrder = createAsyncThunk(
    "order/addOrder",
    async (order) => {
        try {
            await axios.post(`/api/order`, order);
            return order;
        } catch (err) {
            console.error("שגיאה בהוספת הזמנה:", err);
        }
    }
);


export const getAllOrders = createAsyncThunk(
    "order/getAllOrders ",
    async () => {
        try {
            let { data } = await axios.get(`/api/order`);
            return data;
        } catch (err) {
            console.error("שגיאה בקבלת הזמנות:", err);
        }
    }
);
export const getMyOrder = createAsyncThunk(
    "order/getMyOrder",
    async (id) => {
        try {
            let { data } = await axios.get(`/api/order/by-user/` + id);
            return data;
        } catch (err) {
            console.error("שגיאה בקבלת הזמנה:", err);
        }
    }
);

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMyCart.fulfilled, (state, action) => {
                state.myCart = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                const newProduct = action.payload;

                // אם אין סל עדיין - ניצור אחד חדש עם המוצר
                if (!state.myCart) {
                    state.myCart = {
                        userId: newProduct.id,
                        cart: [newProduct.product]
                    };
                    return;
                }

                // אם יש סל אבל אין בו מערך cart - נאתחל אותו
                if (!state.myCart.cart) {
                    console.log("state.my cart", state.myCart.cart)
                    state.myCart.cart = [newProduct.product];

                    return;
                }

                // אם הסל קיים וגם המערך - נבדוק אם המוצר כבר קיים
                const existingProduct = state.myCart.cart.find(p => p.id === newProduct.id);

                if (existingProduct) {
                    existingProduct.quantity += newProduct.quantity;
                } else {
                    state.myCart.cart.push(newProduct);
                }
            }

            ).addCase(updateProductQuantity.fulfilled, (state, action) => {
                const { productId, quantity } = action.payload;
                if (!state.myCart || !state.myCart.cart) return;

                const product = state.myCart.cart.find(p => p.id === productId);
                if (product) {
                    product.quantity = quantity;
                }
            })
            .addCase(removeProductFromCart.fulfilled, (state, action) => {
                const productId = action.payload;
                if (!state.myCart || !state.myCart.cart) return;
                state.myCart.cart = state.myCart.cart.filter(p => p.id !== productId);
            }).addCase(getMyOrder.fulfilled, (state, action) => {
                state.myOrder = action.payload;
            }).addCase(getAllOrders.fulfilled, (state, action) => {
                state.allOrders = action.payload;
            });
    }
});


export const { } = orderSlice.actions
export default orderSlice.reducer;
