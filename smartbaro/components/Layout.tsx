import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React from 'react';

const Layout = ({ children, title, nav_id, device }: { children: React.ReactNode; title: string; nav_id: string; device: string }) => {
    return (
        <div className={device}>
            <Header title={title} nav_id={nav_id} device={device} />
            {children}
            <Footer title={title} nav_id={nav_id} device={device} />
        </div>
    );
};

export default Layout;
