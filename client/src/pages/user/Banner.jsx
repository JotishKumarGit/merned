import React from 'react';
import baner_1 from '/baner_1.png';
import baner_2 from '/baner_new_2.jpg';
import baner_3 from '/baner_new_3.jpg';

function Banner() {
    return (
        <>
            <div id="carouselExample" className="carousel slide">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={baner_1} style={{ height: '300px', width: '100%' }} className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src={baner_2} style={{ height: '300px', width: '100%' }} className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src={baner_3} style={{ height: '300px', width: '100%' }} className="d-block w-100" alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>
    )
}

export default Banner