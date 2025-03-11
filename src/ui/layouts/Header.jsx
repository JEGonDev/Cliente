import React from 'react'
import { Logo } from '../components/Logo'
import { Navbar } from '../components/Navbar'

import imgLogo from '../../assets/header/logo.png'

export const Header = () => {
    return (
        <div>
            <header className='bg-primary flex justify-betwen items-center' >
                <Logo filePath={imgLogo} alt="Logo_header" styleLogo="h-32 w-40" />
                <Navbar />
                
            </header>
        </div>
    )
}