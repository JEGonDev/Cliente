import React from 'react'
import { forwardRef, useEffect,useRef } from 'react'

export default forwardRef = (({ type='text', icon='user', placeholder='',
    name, id, value, className, required, isFocused,handleChange}, ref) => {
    const input = ref ? ref : useRef();
    useEffect(() => {
        if(isFocused) input.current.focus();
    }, []);
    return (
        <div className="input-group">
            <div className="input-group-prepend">
                <span className="input-group-text">
                    <i className={`fa fa-${icon}`}></i>
                </span>
            </div>
            <input type={type} ref={input} name={name} id={id} value={value}
                className={className} placeholder={placeholder}
                required={required} onChange={ (e)=> handleChange(e)} />
        </div>
    )
})
