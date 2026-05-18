import React from 'react';

// A simple placeholder for a setting item
const SettingItem = ({ title, description, children }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  }}>
    <div>
      <h4 style={{ margin: 0, fontSize: '1rem', color: '#e0e3eb' }}>{title}</h4>
      <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#8a91a5' }}>{description}</p>
    </div>
    <div>
      {children}
    </div>
  </div>
);

// A placeholder for a toggle switch
const ToggleSwitch = () => {
  const [isOn, setIsOn] = React.useState(false);
  return (
    <div
      onClick={() => setIsOn(!isOn)}
      style={{
        width: '50px',
        height: '28px',
        backgroundColor: isOn ? '#3d68ff' : '#2a2e39',
        borderRadius: '100px',
        padding: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
      }}
    >
      <div style={{
        width: '20px',
        height: '20px',
        backgroundColor: 'white',
        borderRadius: '50%',
        transform: isOn ? 'translateX(22px)' : 'translateX(0)',
        transition: 'transform 0.3s ease'
      }}></div>
    </div>
  );
};


const Settings = () => {
  return (
    <>
      <div className="glass-card">
        <h3 className="section-title">General Settings</h3>
        <SettingItem title="Dark Mode" description="Toggle between light and dark themes.">
          <ToggleSwitch />
        </SettingItem>
        <SettingItem title="Email Notifications" description="Receive updates and alerts via email.">
          <ToggleSwitch />
        </SettingItem>
        <SettingItem title="Push Notifications" description="Get real-time alerts on your devices.">
          <ToggleSwitch />
        </SettingItem>
      </div>

      <div className="glass-card">
        <h3 className="section-title">Account</h3>
        <SettingItem title="Profile Visibility" description="Control who can see your profile.">
           <select style={{
               background: '#12151f',
               color: '#e0e3eb',
               border: '1px solid rgba(255, 255, 255, 0.08)',
               borderRadius: '100px',
               padding: '8px 12px',
               outline: 'none'
           }}>
               <option>Public</option>
               <option>Private</option>
           </select>
        </SettingItem>
        <SettingItem title="Two-Factor Authentication" description="Enhance your account security.">
            <button style={{
                background: 'transparent',
                border: '1px solid #3d68ff',
                color: '#3d68ff',
                padding: '8px 16px',
                borderRadius: '100px',
                cursor: 'pointer',
                fontWeight: '600'
            }}>Enable</button>
        </SettingItem>
      </div>
    </>
  );
};

export default Settings;