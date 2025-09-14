import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, deleteProduct } from './productSlice';
import ourPastryImage from '../../../assets/Our Pastry.jpg';
import OurCatering from '../../../assets/Our Catering.jpg';
import Tastyhosting from '../../../assets/Tasty hosting.jpg';
import './productList.css';
import ShowSingleProduct from './showSingleProduct';
import { useNavigate } from 'react-router-dom';
import CartSummary from '../order/cartSummary';



export default function ProductList() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const currentUser = useSelector(s => s.user.currentUser);
  const images = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png}', { eager: true });
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  const showCartTemporarily = () => {
    setShowCart(true);
    setTimeout(() => setShowCart(false), 3000); // 3 שניות
  };

  const getImageUrl = (fileName) => {
    if (!fileName) return null;

    // מוודאים שיש סיומת
    const normalizedFileName = fileName.endsWith('.jpg') ? fileName : `${fileName}.jpg`;

    const found = Object.entries(images).find(([path]) =>
      path.toLowerCase().includes(normalizedFileName.toLowerCase())
    );

    return found ? found[1].default : null;
  };

  const products = useSelector((s) => s.product.productList);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const clearCategory = () => {
    setSelectedCategory(null);
  };

  const update = (product) => {
    console.log("in update")
    navigate("/update", { state: product });
  }

  const deleteOne = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <>
      {!selectedCategory && (
        <div className="categories-container">
          <button className="category-btn" onClick={() => handleCategoryClick("קונדיטוריה")}>
            <img src={ourPastryImage} alt="קונדיטוריה" />
            קונדיטוריה
          </button>
          <button className="category-btn" onClick={() => handleCategoryClick("קייטרינג")}>
            <img src={OurCatering} alt="קייטרינג" />
            קייטרינג
          </button>
          <button className="category-btn" onClick={() => handleCategoryClick("מגשי ארוח")}>
            <img src={Tastyhosting} alt="מגשי אירוח" />
            מגשי אירוח
          </button>
        </div>
      )}

      {selectedCategory && (
        <>
          <div className="product-list-wrapper">
            <div className="product-grid">
              {products && products
                .filter((p) => p.category === selectedCategory)
                .map((item) => (
                  <div key={item.id}>
                    <ShowSingleProduct oneProduct={item} funcUpdate={() => { update(item) }} funcDelete={() => { deleteOne(item.id) }} funcImage={() => getImageUrl(item.image)} onAddToCart={showCartTemporarily} />

                  </div>
                ))}
            </div>
          </div>

          <button className="back-button" onClick={clearCategory}>
            חזרה
          </button>

          {currentUser && showCart && <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000
            }}
          >
            <CartSummary />
          </div>
          }
        </>
      )}
    </>
  );
}
