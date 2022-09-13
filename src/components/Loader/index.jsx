import React from 'react'
import './index.css'

export default function index({show, size}) {
  return (
    <div className={`indicator ${show ? 'show' : ''}`}>
        <div className="loading">
            <div className="circle" style={{ width: `${size}px`, height: `${size}px`}}></div>
            <div className="circle" style={{ width: `${size}px`, height: `${size}px`}}></div>
            <div className="circle" style={{ width: `${size}px`, height: `${size}px`}}></div>
        </div>
    </div>
  )
}
