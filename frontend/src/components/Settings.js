import React from 'react';
import './Settings.css';

function Settings() {
  return (
    <div className="settings">
      <label>Word Speed</label>
      <input type="range" min="0" max="1000" defaultValue="500" />
      <label>
        <input type="checkbox" defaultChecked />
        Eye-Tracking
      </label>
    </div>
  );
}

export default Settings;