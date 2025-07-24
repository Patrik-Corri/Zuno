import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Home/Login';
import Home from './components/Home/Zuno-homepage';
import PostItem from './components/MyItems/PostItem';
import MarketHomepage from './components/MyItems/Market-homepage';
import Signup from './components/Home/Signup';
import VerifyUser from './components/Verification/UserVerificaition';
import Forgotpass from './components/Verification/ForgotPassword';
import ResetPass from './components/Verification/NewPassword';
import Layout from './components/Navbar/Layout';
import ProductDetails from './components/MyItems/ProductDetails';
import EditProfile from './components/MyItems/EditProfile';
import EditAccount from './components/MyItems/EditAccount';
import MyListings from './components/MyItems/MyListings';
import MyProductDetails from './components/MyItems/MyProductDetails';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post" element={<ProtectedRoute><PostItem /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/edit-account" element={<ProtectedRoute><EditAccount /></ProtectedRoute>} />
          <Route path="/market-homepage" element={<ProtectedRoute><MarketHomepage/></ProtectedRoute>} />
          <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>}/>
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/myproduct/:id" element={<ProtectedRoute><MyProductDetails /></ProtectedRoute>} />
          <Route path="/verify-user" element={<VerifyUser/>}/>
          <Route path="/forgot-password" element={<Forgotpass />} />
          <Route path="/reset-password" element={<ResetPass />}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
