import 'react-loading-skeleton/dist/skeleton.css'
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SingleBook from "./pages/single/SingleBook";
import SingleUser from "./pages/single/SingleUser";
import SingleTransaction from "./pages/single/SingleTransaction";
import List from "./pages/list/List";
import NewUser from "./pages/new/NewUser";
import NewBook from "./pages/new/NewBook";
import './style/dark.scss'
import {userInputs, bookInputs} from './formSource'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { useSelector } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

function App() {
  const {darkMode} = useContext(DarkModeContext)
  const user = useSelector(state => state.user.currentUser?.Role) === "Admin"

  return (
    <div className={darkMode ? "app dark" : "app"}>
     <BrowserRouter>
      <Routes>
        {user && <>
          <Route path="/">
            <Route index element = {<Home/>}/>
            <Route path = '*' element = {<Home />}/>
            <Route path = 'User'>
              <Route index element ={<List/>}/>
              <Route path=":id" element = {<SingleUser/>}/>
              <Route path = 'new' element = {<NewUser inputs = {userInputs} title = "Add New User" />}/>
            </Route>
            <Route path = 'Books'>
              <Route index element ={<List/>}/>
              <Route path=":productId" element = {<SingleBook/>}/>
              <Route path = 'new' element = {<NewBook inputs = {bookInputs} title = "Add New Book"/>}/>
            </Route>
            <Route path = 'Transaction'>
              <Route index element ={<List/>}/>
              <Route path=":transactionId" element = {<SingleTransaction/>}/>
            </Route>
          </Route>
        </>}
        {!user && <Route path = "*" element = {<Login />}/>}
        
      </Routes>
    </BrowserRouter>
    <ToastContainer/>
    </div>
  );
}

export default App;
