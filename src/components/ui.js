import React from 'react';
import './ui.css'; // Importing the CSS for button styles

// Button Component
export const Button = ({ onClick, children, variant, color }) => (
  <button onClick={onClick} className={`styled-button ${variant} ${color}`}>
    {children}
  </button>
);

// Select Component
export const Select = ({ onChange, value, children }) => (
  <select onChange={onChange} value={value} className="select">
    {children}
  </select>
);

// Table Component
export const Table = ({ children }) => (
  <table className="table">
    {children}
  </table>
);

// Modal Component
export const Modal = ({ onClose, children }) => (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      {children}
    </div>
  </div>
);

// Input Component
export const Input = ({ onChange, type = "text", placeholder, value }) => (
  <input onChange={onChange} type={type} placeholder={placeholder} value={value} className="input" />
);
