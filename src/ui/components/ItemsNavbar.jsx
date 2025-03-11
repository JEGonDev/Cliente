import React from 'react'
import { Link } from 'react-router-dom'

export const ItemsNavbar = ({link, style, text}) => {
  return (
    <div>
        <Link to={link} className={style}>{text}</Link>
    </div>
  )
}
