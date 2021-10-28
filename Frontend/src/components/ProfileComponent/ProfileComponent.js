import React, {useContext} from 'react';
import GridItemComponent from '../GridItemComponent/GridItemComponent';
import {GlobalContext} from '../../App';
import {Link} from 'react-router-dom';
import './style.css'
import {CSSTransition, SwitchTransition} from "react-transition-group";

function Profile() {

    const {user, fav} = useContext(GlobalContext);

    return (
        <div className='home-main'>

            <h3>Hi <span className='distinct'>{user.username}</span>! Here are your favourite pokemons...</h3>

            {fav.favPokemons && fav.favPokemons.length > 0 ?
                <SwitchTransition mode={'out-in'} component={null}>

                    <div className='home-grid'>
                        <div className="subgrid">
                            {fav.favPokemons.map((element, i) => {
                                return <CSSTransition
                                    key={element}
                                    in={true}
                                    appear={true}
                                    timeout={100 * i * 0.1}
                                    classNames='display'
                                >
                                    <GridItemComponent key={element} id={element}
                                                        url={`https://pokeapi.co/api/v2/pokemon/${element}`}/>
                                </CSSTransition>
                            })}
                        </div>
                    </div>

                </SwitchTransition> :

                <div>
                    <CSSTransition
                        in={true}
                        appear={true}
                        timeout={1000}
                        classNames='display-empty'
                    >
                        <div>
                            <p>You haven't liked any of the cute pokemons yet...</p>
                            <p>To get started, go to <Link to='/'>home page</Link>.</p>
                        </div>
                    </CSSTransition>

                </div>}
        </div>
    );
}

export default Profile;