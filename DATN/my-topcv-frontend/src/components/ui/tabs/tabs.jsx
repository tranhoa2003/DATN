// src/components/ui/tabs/tabs.jsx
import React from 'react';

export function Tabs({ children }) {
  return <div>{children}</div>;
}

export function TabsList({ children }) {
  return <div style={{ display: 'flex', gap: '10px' }}>{children}</div>;
}

export function TabsTrigger({ label, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: isActive ? '#007bff' : '#e0e0e0',
        color: isActive ? 'white' : 'black',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '4px',
      }}
    >
      {label}
    </button>
  );
}

export function TabsContent({ children, isActive }) {
  return isActive ? <div style={{ marginTop: '16px' }}>{children}</div> : null;
}
