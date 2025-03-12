import React, { forwardRef, useEffect, useRef } from 'react';


export default forwardRef(({ type = 'text', icon, placeholder = '',
    name, id, value, className, required, isFocused, handleChange }, ref) => {

    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="relative flex items-center border border-gray-300 rounded-lg focus-within:border-blue-500 transition p-2">
            {icon && (
                <span className="absolute left-3 text-gray-1200 text-xl">
                    {icon}
                </span>
            )}
            <input
                type={type}
                ref={input}
                name={name}
                id={id}
                value={value}
                className={`w-full pl-10 pr-2 py-2 outline-none ${className}`}
                placeholder={placeholder}
                required={required}
                onChange={handleChange}
            />
        </div>
    );
});



/*import React from 'react'
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
})*/
