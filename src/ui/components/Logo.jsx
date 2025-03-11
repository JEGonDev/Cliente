import React from 'react'

export const Logo = ({filePath,styleLogo, alt}) => {
  return (
    <div className='h-32 w-40'>
        <img src={filePath} className={styleLogo} alt={alt} />
    </div>
  )
}