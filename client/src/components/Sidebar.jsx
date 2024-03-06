import React, { useState } from 'react';
import {
    FaBars,
    FaUserTimes
}from "react-icons/fa";
import { MdAutoDelete, MdDashboard, MdCoPresent } from "react-icons/md";
import { IoIosPersonAdd } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";

import { NavLink } from 'react-router-dom';
import './css/Sidebar.css';



const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path:"dashboard",
            name:"Dashboard",
            icon:<MdDashboard/>
        },
        {
            path:"present",
            name:"Present ",
            icon:<MdCoPresent/>
        },
        {
            path:"absent",
            name:"Absent",
            icon:<FaUserTimes/>
        },
        {
            path:"/add",
            name:"Add Data",
            icon:<IoIosPersonAdd/>
        },
        {
            path:"/delete",
            name:"Delete",
            icon:<MdAutoDelete/>
        }, 
        {
            path:"/upload",
            name:"upload",
            icon:<FaSignOutAlt/>
        }
    ]
    return (
        <div className="containerSlide">
           <div style={{width: isOpen ? "250px" : "60px"}} className="sidebar">
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Logo</h1>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
           </div>
           <main>{children}</main>
        </div>
    );
};

export default Sidebar;