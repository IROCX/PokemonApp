import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './style.css'

function PaginationComponent({ query, setPage }) {

    const [queryState, setQueryState] = useState(query)

    useEffect(() => {
        if (!query) {
            setQueryState("1")
        }else{
            setQueryState(query)
        }
    }, [query])


    return (
        <CSSTransition
            appear={true}
            in={true}
            timeout={500}
            classNames='pagination-animate'
        >
            <div className='pagination-container'>
                <div>

                    {[...Array(5)].map((e, i) => <Link to={`/?page=${i + 1}`} key={i + 1}><span className={queryState === i + 1 + "" ? "active-page" : ""} onClick={() => setPage(i + 1)}>{i + 1}</span></Link>)}
                </div>
            </div>
        </CSSTransition>
    );
}

export default PaginationComponent;