import React, {useState} from 'react';
import {usePokemon} from '../../hooks/usePokemon';
import GridItemComponent from '../GridItemComponent/GridItemComponent';
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import PaginationComponent from '../PaginationComponent/PaginationComponent';
import './style.css'

function Home(props) {

    const query = props.location.search.split('=')[1]

    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(query)
    const {
        apiData,
        isLoading,
    } = usePokemon({
        url: `https://pokeapi.co/api/v2/pokemon/${searchTerm}?offset=${(query - 1) * 20}`,
        searchTerm: Boolean(searchTerm),
        offset: page * 20
    })

    return (
        <div className='home-main'>
            <div className="search-bar">
                <input className={'search-input'} placeholder='Search your favourite pokemon...' type="text"
                       onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>

            {!isLoading && apiData ?
                <div className="home-grid">
                    {searchTerm === "" ? !isLoading && apiData && apiData.results &&
                        <SwitchTransition mode={'out-in'} component={null}>

                            <div className={"subgrid"}>
                                {apiData.results.map((element, i) => (

                                    <CSSTransition
                                        key={element.name}
                                        in={true}
                                        appear={true}
                                        timeout={100 * i * 0.1}
                                        classNames='display'
                                    >
                                        <GridItemComponent id={element.name} url={element.url}/>
                                    </CSSTransition>

                                ))}
                            </div>

                        </SwitchTransition>

                        : !isLoading && apiData && apiData.species &&
                        <CSSTransition
                            key={apiData.species.name}
                            in={true}
                            appear={true}
                            timeout={600}
                            classNames='display'
                        >
                            <GridItemComponent id={apiData.species.name}
                                               url={`https://pokeapi.co/api/v2/pokemon/${apiData.id}`}/>
                        </CSSTransition>
                    }
                </div> :
                <div className="space-holder"/>
            }

            {searchTerm === "" && <PaginationComponent query={query} setPage={setPage}/>}
        </div>
    );
}

export default Home;