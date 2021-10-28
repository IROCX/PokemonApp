import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import Home from './components/HomeComponent/HomeComponent';
import LoginComponent from './components/LoginComponent/LoginComponent';
import Navbar from './components/NavbarComponent/NavbarComponent';
import {createContext, useEffect, useState} from 'react'
import Profile from './components/ProfileComponent/ProfileComponent';
import {toast} from './hooks/notification';
import ProtectedRoute from './components/utils/ProtectedRoute';

export const GlobalContext = createContext()

function App() {

  const [user, setUser] = useState({
    username: window.localStorage.getItem('user'),
  })
  const [fav, setFav] = useState({
    favPokemons: [],
  })


  const setCurrentUser = async (username) => {
    setUser({...user, username})
  }

  const getData = async (flag) => {
    if (flag === 1 && user.username) {
      try {
        const favlist = await fetch('http://localhost:5001/getData', {credentials: "include"})
        const res = await favlist.json()
        if (res.response) {
          setFav({...fav, favPokemons: res.message})
        } else {
          window.localStorage.clear()
          setFav({...fav, favPokemons: []})
          if (user.username)
            setCurrentUser(null)
        }
      } catch (e) {
        toast.notify({message: 'Couldn\'t connect to server...Please Check your internet connection.', type: 'error'})
      }
    } else {
      setFav({...fav, favPokemons: []})
    }

  }
  const addFav = async (id) => {
    const isPresent = fav.favPokemons.find(element => element === id)
    if (isPresent) {
      setFav({...fav, favPokemons: fav.favPokemons.filter(ele => ele !== id)})
    } else {
      const temp = fav.favPokemons
      temp.push(id)
      setFav({...fav, favPokemons: temp})
    }
    try {
      const favlist = await fetch('http://localhost:5001/addList',
          {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
            body: JSON.stringify({
              "id": id,
              "flag": !isPresent
            })
          }
      )
      const res = await favlist.json()
      if (res.response) {
        toast.notify({
          message: isPresent !== undefined ? 'Removed from favorites' : 'Added to favorites...',
          type: 'success'
        })
      } else {
        toast.notify({message: 'Please login first...', type: 'error'})
      }
    } catch (e) {
      toast.notify({message: 'Couldn\'t connect to server...Please Check your internet connection.', type: 'error'})
      if (isPresent) {
        setFav({...fav, favPokemons: fav.favPokemons.slice(0, isPresent) + [id] + fav.favPokemons.slice(isPresent)})
      }
    }
  }

  useEffect(() => {
    getData(1)
  }, [user])


  return (
      <div className="App">
        <GlobalContext.Provider value={{user, fav, setCurrentUser, getData, addFav}}>
          <Router>
            <Navbar user={user}/>
            <Switch>
              <Route exact path='/user' component={() => (<LoginComponent/>)}/>
              <ProtectedRoute exact path='/profile' component={() => (<Profile/>)}/>
              <Route exact path='/' component={Home}/>
            </Switch>
          </Router>
        </GlobalContext.Provider>
      </div>
  );
}

export default App;
