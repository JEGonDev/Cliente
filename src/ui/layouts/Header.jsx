import React from 'react'
import { Logo } from '../components/Logo'
import { Navbar } from '../components/Navbar'

import imgLogo from '../../assets/header/logo.png'
import { AuthNav } from '../components/AuthNav'

export const Header = () => {
    return (
        <div>
            <header className='bg-primary flex items-center justify-between px-4 md:px-8 py-4'>
                {/* Logo a la izquierda */}
                <div className="flex-shrink-0">
                    <Logo filePath={imgLogo} alt="Logo_header" styleLogo="h-16 w-20 md:h-32 md:w-40" />
                </div>

                {/* Navbar en el centro */}
                <div className="flex-grow text-center ml-24">
                    <Navbar />
                </div>

                {/* AuthNav a la derecha */}
                <div className="flex-shrink-0">
                    <AuthNav />
                </div>
            </header>
        </div>
    )
}