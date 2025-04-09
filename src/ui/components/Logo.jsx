import React from 'react'

export const Logo = ({filePath,styleLogo, alt}) => {
  return (
    
        <img src={filePath} className={styleLogo} alt={alt} />
    
  )
}