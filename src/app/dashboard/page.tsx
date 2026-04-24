'use client';
// import dynamic from 'next/dynamic';
// import { useState, useEffect } from 'react';

// Disable SSR for dashboard components
// const SecretPage = dynamic(() => import('../../components/SecretPage'), { ssr: false });
// const Dashboard = dynamic(() => import('../../components/Dashboard'), { ssr: false });

export default function DashboardRoute() {
    return (
        <div style={{ padding: '50px', textAlign: 'center', color: 'white' }}>
            <h1>Dashboard Disabled</h1>
            <p>The dashboard has been temporarily disabled.</p>
        </div>
    );
    
    // const [view, setView] = useState<'secret' | 'dashboard'>('secret');

    // useEffect(() => {
    //     document.body.style.overflow = 'auto';
        
    //     // Add blob container background since it relies on it
    //     const bg = document.createElement('div');
    //     bg.className = 'blob-container';
    //     bg.style.zIndex = '0';
    //     bg.innerHTML = `
    //       <div class="blob blob-1"></div>
    //       <div class="blob blob-2"></div>
    //       <div class="blob blob-3"></div>
    //       <div class="blob blob-4"></div>
    //       <div class="blob blob-5"></div>
    //       <div class="blob blob-6"></div>
    //     `;
    //     document.body.appendChild(bg);

    //     return () => {
    //         document.body.removeChild(bg);
    //     };
    // }, []);

    // return view === 'secret' 
    //     ? <SecretPage onNavigate={(s) => { if(s === 'dashboard') setView('dashboard'); }} /> 
    //     : <Dashboard onNavigate={() => {}} />;
}
