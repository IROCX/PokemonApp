import React, {useState, useContext, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import {GlobalContext} from '../../App';
import {toast} from '../../hooks/notification';
import './style.css'


function LoginComponent() {

    const {setCurrentUser, getData} = useContext(GlobalContext);

    const history = useHistory()

    const util = history.location.search.split('=')[1] === 'login'

    const [isLoading, setIsLoading] = useState(false)
    const [isLogin, setIsLogin] = useState(util)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [cpassword, setCPassword] = useState("")
    const [error, setError] = useState(null)


    const validateCred = (creds, flag) => {
        const {username, password, cpassword} = creds
        if (username === "" || username.length < 4) {
            setError('Username must be at least 4 character long...')
        } else if (password === "" || password.length < 4) {
            setError('Password must be at least 4 character long...')
        } else {
            if (flag === 'signup') {
                if (password !== cpassword) {
                    setError('Passwords must match...')
                } else {
                    setError(null)
                    return true
                }
            } else {
                setError(null)
                return true
            }
        }
        return false
    }

    const loginHandler = async () => {
        setIsLoading(true)
        const creds = {username, password}

        if (validateCred(creds)) {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({username, password})
            };
            try {
                const res = await fetch('http://localhost:5001/login', requestOptions)
                const response = await res.json()
                if (response.response) {
                    setCurrentUser(username)
                    window.localStorage.setItem('user', username)
                    getData(1)
                    history.push('/')
                    toast.notify({message: "Logged in successfully", type: 'success'})
                } else {
                    toast.notify({message: "Error occurred. Please try again", type: 'error'})
                }

            } catch (e) {
                toast.notify({message: "Resource not found.", type: 'error'})
            }
        }
        setIsLoading(false)
    }
    const signupHandler = async () => {
        setIsLoading(true)
        const creds = {username, password, cpassword}

        if (validateCred(creds, 'signup')) {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({username, password})
            };
            try {
                const res = await fetch('http://localhost:5001/signup', requestOptions)
                const response = await res.json()
                if (response.response) {
                    await setCurrentUser(username)
                    window.localStorage.setItem('user', username)
                    getData(1)
                    history.push('/')
                    toast.notify({message: "Signed up in successfully", type: 'success'})
                } else {
                    toast.notify({message: response.message, type: 'error'})
                }
            } catch (e) {
                toast.notify({message: "Resource not found.", type: 'error'})
            }

        }
        setIsLoading(false)
    }


    useEffect(() => {
        const util = history.location.search.split('=')[1] === 'login'
        setIsLogin(util)
        setError(null)
    }, [history.location.search])


    return (
        <div className='login-main'>
            <SwitchTransition mode={'out-in'}>
                <CSSTransition
                    key={isLogin ? 0 : 1}
                    in={true}
                    appear={true}
                    timeout={250}
                    classNames='login-animate'
                >
                    <div className="login-container">
                        <div>
                            {isLogin ?
                                <h2>Login to your <span>Pokemon World</span></h2> :
                                <h2>Welcome <span>Pokemon World</span></h2>
                            }
                            <div className="login-form">
                                <form autoComplete="off">
                                    <div className='form-control'>
                                        <input type="text" name="username"
                                               onChange={(e) => setUsername(e.target.value)}/>
                                        <label htmlFor="username">Username</label>
                                    </div>
                                    <div className='form-control'>
                                        <input type="password" name="pw" onChange={(e) => setPassword(e.target.value)}/>
                                        <label htmlFor="pw">Password</label>
                                    </div>
                                    {!isLogin && <div className='form-control'>
                                        <input type="password" name="cpw"
                                               onChange={(e) => setCPassword(e.target.value)}/>
                                        <label htmlFor="cpw">Confirm Password</label>
                                    </div>}
                                </form>
                                <small className={'form-error'}>{error && error}</small>
                            </div>
                            <button className="submitBtn"
                                    onClick={() => isLogin ? loginHandler() : signupHandler()}>{!isLoading  && (isLogin? "Login" : "Sign up")} {isLoading &&
                            <div className="lds-dual-ring"/>}</button>
                        </div>

                    </div>

                </CSSTransition>
            </SwitchTransition>
        </div>
    );
}

export default LoginComponent;