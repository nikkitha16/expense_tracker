import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

export const DashboardLayout = ({children,activeMenu}) => {
  console.log("children",children);
  console.log("activeMenu",activeMenu);
    const {user}= useContext(UserContext)
  return (
    <div className=''>
        <Navbar activeMenu={activeMenu}/>
        {user &&(
            <div className='flex'>
                <div className='max-[1080px]:hidden'>
                    <SideMenu activeMenu={activeMenu}/>
                </div>
                <div className='grow mx-5'>{children}</div>
                </div>

        )}
    </div>
  )
}
