"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MainMenu.module.css';

interface MainMenuProps {
  isRealData: boolean;
  onToggleData: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ isRealData, onToggleData }) => {
  const [isVertical, setIsVertical] = useState(false);

  const toggleMenu = () => {
    setIsVertical(!isVertical);
    window.dispatchEvent(new CustomEvent('menuOrientationChange', { 
      detail: { isVertical: !isVertical } 
    }));
  };

  return (
    <nav className={`${styles.mainMenu} ${isVertical ? styles.vertical : styles.horizontal}`}>
      <Link href="/" className={styles.menuItem}>
        <div className={styles.homeLink}>
          <Image 
            src="/stock-icon.svg" 
            alt="Grekais Stocks" 
            width={24} 
            height={24} 
          />
          <span className={styles.menuText}>Home</span>
        </div>
      </Link>
      
      <Link href="/about" className={styles.menuItem}>
        <span className={styles.menuText}>About</span>
      </Link>
      
      <div className={styles.menuItem}>
        <span className={styles.menuText}>Services</span>
        <div className={styles.dropdown}>
          <Link href="/services/1" className={styles.dropdownItem}>Service 1</Link>
          <Link href="/services/2" className={styles.dropdownItem}>Service 2</Link>
        </div>
      </div>
      
      <Link href="/contact" className={styles.menuItem}>
        <span className={styles.menuText}>Contact</span>
      </Link>

      <button 
        className={`${styles.menuItem} ${styles.dataSwitch}`}
        onClick={onToggleData}
      >
        <span className={styles.menuText}>
          Using: {isRealData ? 'Real' : 'Mock'} Data
        </span>
      </button>
      
      <button className={styles.menuToggle} onClick={toggleMenu}>
        <span className={styles.menuText}>
          {isVertical ? '← Collapse' : '☰ Expand'} Menu
        </span>
      </button>
    </nav>
  );
};

export default MainMenu; 