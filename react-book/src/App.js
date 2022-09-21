import Register from "./pages/register/Register"
import Home from "./pages/home/Home"
import Cart from "./pages/cart/Cart"
import Login from "./pages/login/Login"
import Books from "./pages/books/Books"
import BookDetail from "./pages/bookDetail/BookDetail"
import Profile from "./pages/profile/Profile"
import 'react-loading-skeleton/dist/skeleton.css'



import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import Transaction from "./pages/transaction/Transaction"
import SingleTransaction from "./pages/singleTransaction/SingleTransaction"
import Loading from "./components/loading/Loading"
import { offLoading } from "./redux/loadingSlicer"

function App() {
  const dispatch = useDispatch()
  dispatch(offLoading())
  const user = useSelector((state) => state.user.currentUser)
  const loading = useSelector(state => state.loading.isLoading)
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/books" element={<Books />} />
        <Route exact path="/books/popularity" element={<Books />} />
        <Route exact path="/books/rating" element={<Books />} />
        <Route exact path="/books/recommendations" element={<Books />} />
        <Route exact path="/books" element={<Books />} />
        <Route exact path="/books/:id" element={<BookDetail />} />
        <Route exact path="/profile" element={!user ? <Navigate to="/" /> : <Profile/>} />
        <Route exact path="/transaction" element={!user ? <Navigate to="/" /> : <Transaction />} />
        <Route exact path="/transaction/:id" element={!user ? <Navigate to="/" /> : <SingleTransaction />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate  to="/" /> : <Register />} />
        <Route path="/*" element={<Home />} />
      </Routes>
      {loading && <Loading />}
    </Router>
  );
}
export const getLocalStorageToken = () =>{
  return localStorage.getItem('Token')
}


export default App;
