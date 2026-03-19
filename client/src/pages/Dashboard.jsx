import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../api';
import BottomNav from '../components/BottomNav';
import HomeTab from '../components/tabs/HomeTab';
import ShieldTab from '../components/tabs/ShieldTab';
import PolicyTab from '../components/tabs/PolicyTab';
import HistoryTab from '../components/tabs/HistoryTab';
import EarningsTab from '../components/tabs/EarningsTab';
import ProfileTab from '../components/tabs/ProfileTab';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const renderTab = () => {
    switch (activeTab) {
      case 'Home': return <HomeTab setActiveTab={setActiveTab} />;
      case 'Shield': return <ShieldTab setActiveTab={setActiveTab} />;
      case 'Policy': return <PolicyTab setActiveTab={setActiveTab} />;
      case 'History': return <HistoryTab setActiveTab={setActiveTab} />;
      case 'Earnings': return <EarningsTab setActiveTab={setActiveTab} />;
      case 'Profile': return <ProfileTab setActiveTab={setActiveTab} />;
      default: return <HomeTab setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#f8f9fa', maxWidth: '480px', margin: '0 auto' }}>
      {renderTab()}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
