import React, {useContext} from 'react';
import {usePokemon} from '../../hooks/usePokemon';
import pokeball from '../../assets/pokeball.jpg'
import {GlobalContext} from '../../App';
import './style.css'


function GridItemComponent({id, url}) {


    const {addFav} = useContext(GlobalContext);

    const {apiData} = usePokemon({url, searchTerm: true})

    return (
        <div className='grid-item' onClick={() => addFav(apiData.id)}>
            <img src={apiData ? apiData?.sprites?.front_default : pokeball} alt={id}/>
            <div className='grid-item-content'>
                <p className='grid-item-title'>{apiData ? apiData.name : "Pokemon"}</p>
                <div className="stats">
                    {apiData && apiData?.stats?.slice(0, 3).map(stat => <li
                        key={stat.stat.name}>{stat.stat.name} :<strong> {stat.base_stat}</strong></li>)}
                </div>
            </div>
        </div>
    );
}

export default GridItemComponent;