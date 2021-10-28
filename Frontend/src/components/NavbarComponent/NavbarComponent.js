import React, {useContext, useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom/cjs/react-router-dom.min';
import {CSSTransition} from 'react-transition-group';
import {GlobalContext} from '../../App';
import pokemon from '../../assets/logo.png'
import './style.css'
import {toast} from "../../hooks/notification";

function Navbar() {


    const {user, getData, setCurrentUser} = useContext(GlobalContext);
    const [currentUser, setUser] = useState(user.username)
    const [activeTabHandler, setActiveTabHandler] = useState(null)
    const history = useHistory()

    const setTab = (location) => {
        if (location.search !== "") {
            const temp = location.search.split('=')[1]
            if (temp === 'login') {

                setActiveTabHandler(0)
            } else if (temp === 'signup') {

                setActiveTabHandler(1)
            } else {

                setActiveTabHandler(null)
            }
        } else {
            setActiveTabHandler(location.pathname.split('/')[1])
        }
    }

    // 0 = LoginComponent
    // 1 = Signup
    // others = path
    history.listen((location) => {
       setTab(location)
    });


    const logoutHandler = async () => {

        try {
            const res = await fetch('http://localhost:5001/logout', {credentials: 'include'})
            const response = await res.json()

            if (response.response) {
                window.localStorage.clear()
                setUser(null)
                setCurrentUser(null)
                getData(0)
                history.push('/')
                toast.notify({message: "Logged out successfully", type: 'success'})

            } else {
                toast.notify({message: "Error occurred. Please try again", type: 'error'})
            }
        } catch (e) {
            toast.notify({
                message: 'Couldn\'t connect to server...Please Check your internet connection.',
                type: 'error'
            })
        }

    }


    useEffect(() => {
        if (user && user.username)
            setUser(user.username)
    }, [user])

    useEffect(() => {
        setTab(history.location)
    }, [])


    return (
        <CSSTransition
            appear={true}
            in={true}
            timeout={500}
            classNames='navbar-animate'
        >
            <div className={'navbar-main'}>
                <div className="navbar-container">
                    <div className="navbar-left">
                        <Link to='/'>
                            <img className={"logo"} src={pokemon} alt={"pokemon logo"}/>
                        </Link>
                    </div>
                    <div className="navbar-right">
                        <ul className='navbar-list'>

                            {!currentUser &&
                            <Link className={activeTabHandler === 0 ? 'nav-active' : ""} to='/user?screen=login'>
                                <li>Login</li>
                            </Link>}

                            {currentUser &&
                            <Link to='/profile'
                                  className={`${activeTabHandler === 'profile' ? 'nav-active' : ""} nav-profile`}>
                                <li>{currentUser}</li>
                            </Link>}

                            {currentUser &&
                            <Link to={'#'} onClick={logoutHandler}>
                                Logout
                            </Link>}

                            {!currentUser &&
                            <Link className={activeTabHandler === 1 ? 'nav-active' : ""} to='/user?screen=signup'>
                                <li>Signup</li>
                            </Link>}
                        </ul>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default Navbar;