"use client";
import React, { useState, useEffect } from 'react';
import './BookingStyles.css';
import * as Data from './BookingData';

export default function BookingSystem() {
  const [activeSection, setActiveSection] = useState('cottages');
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<'mpesa' | 'card'>('mpesa');

  // Helper: Cart Logic[cite: 4]
  const addToCart = (item: any) => {
    if (cart.find(c => c.id === item.id)) return;
    setCart([...cart, item]);
  };

  const calculateTotal = () => {
    const sub = cart.reduce((acc, curr) => acc + curr.price, 0);
    const service = Math.round(sub * 0.1);
    return { sub, service, total: sub + service };
  };

  return (
    <div className="ubuntu-wrapper min-h-screen">
      {/* NAVIGATION[cite: 4] */}
      <nav className="nav sticky top-0 z-50">
        <div className="nav-top flex justify-between p-4">
          <div className="logo">Ubuntu <span>Kreative</span></div>
          <button className="cart-pill" onClick={() => setIsCartOpen(true)}>
            Cart <span className="badge">{cart.length}</span>
          </button>
        </div>
        <div className="nav-links flex overflow-x-auto">
          {['cottages', 'restaurant', 'spa', 'farm', 'events', 'calendar'].map(tab => (
            <div 
              key={tab} 
              className={`nl ${activeSection === tab ? 'active' : ''}`}
              onClick={() => setActiveSection(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </nav>

      {/* DYNAMIC SECTIONS[cite: 4] */}
      <main className="p-8">
        {activeSection === 'cottages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {Data.COTTAGES.map(item => (
              <ExperienceCard key={item.id} item={item} onAdd={addToCart} />
            ))}
          </div>
        )}
        {/* ... add other sections following the same pattern ... */}
      </main>

      {/* CART OVERLAY[cite: 4] */}
      {isCartOpen && (
        <div className="c-overlay on" onClick={() => setIsCartOpen(false)}>
          <div className="c-panel" onClick={e => e.stopPropagation()}>
             {/* Cart Content, M-Pesa Fields, and Checkout logic */}
          </div>
        </div>
      )}
    </div>
  );
}

function ExperienceCard({ item, onAdd }: { item: any, onAdd: (i: any) => void }) {
  return (
    <div className="ec">
      <div className="ec-corner tl"></div><div className="ec-corner br"></div>
      <div className="ec-tag">{item.tag}</div>
      <div className="ec-name">{item.name}</div>
      <div className="ec-ft flex justify-between items-end">
        <div className="ec-price">KES {item.price.toLocaleString()}</div>
        <button className="add-btn" onClick={() => onAdd(item)}>+ Add</button>
      </div>
    </div>
  );
}