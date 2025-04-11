'use client';

import './Header.css';
function Header(props){
    return (
        <section className="header">
            <div className="category">
            {props.children}
            </div>
        </section>
    );
};
export default Header;