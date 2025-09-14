import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useDispatch } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Home from './Components/features/home/home'
import NavBar from './Components/features/navBar/navBar'
import ProductList from './Components/features/products/productList'
import Login from './Components/features/user/logIn'
import SignUp from './Components/features/user/signUp'
import { updateCurrentUser, updateMnager } from './Components/features/user/userSlice';
import UserList from './Components/features/user/userList';
import AddUpdateProduct from './Components/features/products/addUpdateProduct';
import CartSummary from './Components/features/order/cartSummary';
import CheckoutPage from './Components/features/order/payment';
import SeeMyOrder from './Components/features/order/seeMyOrder';
import SeeAllOrders from './Components/features/order/seeAllOrders';

function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();

  //מתבצע אוטומטית בכניסה לאתר
  useEffect(() => {
    const userFromStorage = localStorage.getItem("currentUser");
    const managerFromStorage = localStorage.getItem("manager");

    if (userFromStorage != undefined) {
      dispatch(updateCurrentUser(JSON.parse(userFromStorage)));
    }
    if (managerFromStorage != undefined) {
      dispatch(updateMnager(JSON.parse(managerFromStorage)));
    }
  }, []);

  return (
    <>

      {<BrowserRouter>
        <NavBar></NavBar>
        <Routes >
          <Route path="" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="home" element={<Home />} />
          <Route path="productList" element={<ProductList />} />
          <Route path="users" element={<UserList />} />
          <Route path="/update" element={<AddUpdateProduct />} />
          <Route path="/addProduct" element={<AddUpdateProduct />} />
          <Route path="/cart" element={<CartSummary />} />
          <Route path="/CheckoutPage" element={<CheckoutPage />} />
          <Route path="/myOrder" element={<SeeMyOrder />} />
          <Route path="/orders" element={<SeeAllOrders />} />
        </Routes>
      </BrowserRouter>}
    </>
  )
}

export default App
