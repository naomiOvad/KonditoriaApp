import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  status: 'idle', // ← התחלה תקינה
  userList: [],
  currentUser: null,
  manager: null
};

export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  try {
    const { data } = await axios.get("/api/user");
    console.log("in getAllUsers func");
    console.log(data);
    return data;
  } catch (err) {
    console.error("שגיאה בקבלת המשתמשים:", err);
    throw err; // חשוב: כדי ש-redux יזהה כ-rejected
  }
});

export const addUserTOJESON = createAsyncThunk("user/addUser", async (newUser) => {
  try {
    const { data } = await axios.post("/api/user", newUser);
    localStorage.setItem("currentUser", JSON.stringify(data));
    return data;
  } catch (err) {
    console.error("שגיאה בהוספת משתמש:", err);
    throw err;
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.userList.push(action.payload);
    },
    updateCurrentUser: (state, action) => {
      console.log("in updateCurrentUser");
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
    updateMnager: (state, action) => {
      console.log("in updateMnager");
      state.manager = action.payload;
    },
    logoutManager: (state) => {
      state.manager = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userList = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        console.error("שגיאה ב-getAllUsers:", action.error.message);
      });
  }
});

export const { addUser, updateCurrentUser, logout, updateMnager, logoutManager } = userSlice.actions;
export default userSlice.reducer;
