import React, { useState, useEffect } from 'react';
import Seo from '@/components/Seo';

export default function LayoutPopupClean({ children, title }) {
    return (
        <>
            <Seo title={title} />
            {children}
        </>
    );
}
