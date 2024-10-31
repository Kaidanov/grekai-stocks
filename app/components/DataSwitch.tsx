"use client";

import React from 'react';
import styles from './DataSwitch.module.css';

interface DataSwitchProps {
  isRealData: boolean;
  onToggle: () => void;
}

const DataSwitch: React.FC<DataSwitchProps> = ({ isRealData, onToggle }) => {
  return (
    <div className={styles.switchContainer}>
      <button 
        onClick={onToggle} 
        className={styles.switchButton}
      >
        Switch to {isRealData ? 'Mock' : 'Real'} Data
      </button>
      <span className={styles.dataStatus}>
        Using: {isRealData ? 'Real' : 'Mock'} Data
      </span>
    </div>
  );
};

export default DataSwitch; 