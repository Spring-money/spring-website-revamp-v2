'use client';

import{ useState, forwardRef } from "react";
import './Explore.css';

function Explore(props,ref){
    let link_data=[];
    if('explore' in props){
        Object.keys(props.explore).map((arr,index)=>{
            return (link_data.push(<div key={"explore"+index}><a  href={arr}>Click here</a> {props.explore[arr]}<br></br></div>))
        })
    }
    if(link_data.length>0){
        return (
            <section className="Explore" ref={ref}>
                    <div className="Explore-heading">
                        Explore for yourself:-
                    </div>
                    <div className="Explore-content">
                        {link_data}
                    </div>
            </section>
        );
    }

    return <section ref={ref}></section>
};
export default forwardRef(Explore);