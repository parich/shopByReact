import { Link, Route } from 'react-router-dom';
import ProductScreen from './screens/ProductScreen';
import HomeScreen from './screens/HomeScreen';
import { BrowserRouter } from 'react-router-dom';
import CartScreen from './screens/CartScreen';
import { useDispatch, useSelector } from 'react-redux';
import SigninScreen from './screens/SigninScreen';
import { signout } from './actions/userActions';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAdressScreen from './screens/ShippingAdressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerRoute from './components/SellerRoute';
import SellerScreen from './screens/SellerScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import { useEffect, useState } from 'react';
import { listProductCategories } from './actions/productActions';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import MapScreen from './screens/MapScreen';

function App() {

  const cart = useSelector(state => state.cart);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { cartItems } = cart;
  //เรียกข้อมูลที่อยู่ใน Redux .store ที่ชื่อ useSignin มาเก็บใน userSignin
  const userSignin = useSelector((state) => state.userSignin);
  //เรียกใช้เฉพาะ userInfo ที่อยู่ใน Redux .store
  const { userInfo } = userSignin;

  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  }

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const { loading: loadingCategories, error: errorCategories, categories } = productCategoryList

  useEffect(() => {
    dispatch(listProductCategories())
  }, [dispatch]);


  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>

            <button
              type='button'
              className='open-sidebar'
              onClick={() => setSidebarIsOpen(true)}>
              <i className='fa fa-bars'></i>
            </button>

            <Link className="brand" to="/">shop-cart</Link>
          </div>
          <div>
            <Route render={({ history }) => <SearchBox history={history}></SearchBox>}></Route>
          </div>
          <div>
            <Link to="/cart">Cart
              {cartItems.length > 0 && (<span className="badge">{cartItems.length}</span>)}
            </Link>

            {userInfo ? (
              <div className="dropdown">
                <Link to="#">{userInfo.name} <i className="fa fa-caret-down"></i>{''}</Link>
                <ul className="dropdown-content">
                  <li> <Link to='/profile'>Profile</Link> </li>
                  <li> <Link to='/orderhistory'>Order History</Link> </li>
                  <li><Link to="#signout" onClick={signoutHandler}>Sign Out</Link></li>
                </ul>
              </div>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}

            {userInfo && userInfo.isSeller && (
              <div className="dropdown">
                <Link to="#admin">
                  Seller <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/productlist/seller">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/seller">Orders</Link>
                  </li>
                </ul>
              </div>
            )}

            {userInfo && userInfo.isAdmin && (
              <div className='dropdown'>
                <Link to='#admin'>Admin <i className='fa fa-caret-down'></i></Link>
                <ul className='dropdown-content'>
                  <li>
                    <Link to='/dashboard'>Dashboard</Link>
                  </li>
                  <li>
                    <Link to='/productlist'>Products</Link>
                  </li>
                  <li>
                    <Link to='/orderlist'>Orders</Link>
                  </li>
                  <li>
                    <Link to='/userlist'>Users</Link>
                  </li>
                </ul>
              </div>
            )}

          </div>

        </header>

        <aside className={sidebarIsOpen ? 'open' : ''}>
          <ul className='categories'>
            <li>
              <strong>Categories</strong>

              <button onClick={() => setSidebarIsOpen(false)}
                className='close-sidebar'
                type='button'
              >
                <i className='fa fa-close'></i>
              </button>
            </li>
            {
              loadingCategories ? (
                <LoadingBox></LoadingBox>
              ) : errorCategories ? (
                <MessageBox variant="danger">{errorCategories}</MessageBox>
              ) : (
                categories.map((c) => (
                  <li key={c}>
                    <Link to={`/search/category/${c}`}
                      onClick={() => setSidebarIsOpen(false)}
                    >{c}</Link>
                  </li>
                ))
              )
            }
          </ul>
        </aside>

        <main>
          <Route path='/seller/:id' component={SellerScreen}></Route>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/product/:id" component={ProductScreen} exact></Route>
          <AdminRoute path="/product/:id/edit/" component={ProductEditScreen} exact></AdminRoute>
          <Route path="/" component={HomeScreen} exact></Route>
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/shipping" component={ShippingAdressScreen}></Route>
          <Route path="/payment" component={PaymentMethodScreen}></Route>
          <Route path="/placeorder" component={PlaceOrderScreen}></Route>
          <Route path="/order/:id" component={OrderScreen}></Route>
          <Route path="/orderhistory" component={OrderHistoryScreen}></Route>
          <Route path="/search/name/:name?" component={SearchScreen} exact></Route>
          <Route path="/search/category/:category" component={SearchScreen} exact></Route>
          <Route path="/search/category/:category/name/:name" component={SearchScreen} exact></Route>
          <Route path="/search/category/:category/name/:name/min/:min/max/:max" component={SearchScreen} exact></Route>
          <Route path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order" component={SearchScreen} exact></Route>
          <PrivateRoute path="/profile" component={ProfileScreen}></PrivateRoute>
          <AdminRoute path="/productlist" component={ProductListScreen} exact ></AdminRoute>
          <AdminRoute path="/orderlist" component={OrderListScreen} exact ></AdminRoute>
          <AdminRoute path="/userlist" component={UserListScreen}></AdminRoute>
          <AdminRoute path="/user/:id/edit" component={UserEditScreen}></AdminRoute>
          <SellerRoute path='/productlist/seller' component={ProductListScreen}></SellerRoute>
          <SellerRoute path='/orderlist/seller' component={OrderListScreen}></SellerRoute>
          <PrivateRoute path="/map" component={MapScreen}></PrivateRoute>
        </main>

        <footer className="row center">All right resered</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
