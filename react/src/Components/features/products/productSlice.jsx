import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    status: null,
    productList: []
}

export const getAllProducts = createAsyncThunk("product-getProducts", async () => {
    try {
        let { data } = await axios.get("/api/product")
        console.log("in getAllProducts func")
        console.log(data)
        return data

    } catch {
        console.log("");
    }
})


export const updateProduct = createAsyncThunk("product-updateProduct", async (newProduct) => {
    try {
        let { data } = await axios.put("/api/product/" + newProduct.id, newProduct)
        console.log("in updateProduct func")
        console.log(data)
        return newProduct

    } catch {
        console.log("");
    }
})

export const addProduct = createAsyncThunk("product-addProduct", async (newProduct) => {
    try {
        let { data } = await axios.post("/api/product", newProduct)
        console.log("in addProduct func")
        console.log(data)
        return newProduct

    } catch {
        console.log("");
    }
})

export const deleteProduct = createAsyncThunk("product-deleteProduct", async (id) => {
    try {
        let { data } = await axios.delete("/api/product/" + id)
        console.log("in deleteProduct func")
        console.log(data)
        return id

    } catch {
        console.log("delete error:", err);
    }
})

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllProducts.fulfilled, (state, action) => {
            state.productList = action.payload
        }).addCase(getAllProducts.pending, (state, action) => {
            state.status = "loading"
        }).addCase(getAllProducts.rejected, (state, action) => {
            state.status = "failed!!"
        }).addCase(updateProduct.fulfilled, (state, action) => {
            let updatedProduct = action.payload;
            let index = state.productList.findIndex(p => p.id === updatedProduct.id);
            if (index !== -1) {
                state.productList[index] = updatedProduct;
            }

        }).addCase(addProduct.fulfilled, (state, action) => {
            state.productList.push(action.payload);
        }).addCase(deleteProduct.fulfilled, (state, action) => {
            let idToDelete = action.payload;
            state.productList = state.productList.filter(p => p.id !== idToDelete);
        })
    }
}
)

export const { } = productSlice.actions
export default productSlice.reducer;
