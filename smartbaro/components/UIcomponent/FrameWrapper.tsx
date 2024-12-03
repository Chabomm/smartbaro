import { useEffect, useRef, useState } from 'react';

export const FrameWrapper = ({ src }) => {
    const ref = useRef(null);
    const [height, setHeight] = useState('0px');

    const onLoad = () => {
        // try {
        //     const ref_current = ref.current;
        //     if (ref_current) {
        //         setHeight(ref_current.contentWindow.document.body.scrollHeight + 'px');
        //     }
        // } catch (e) {
        //     console.log(e);
        //     setHeight(1290 + 'px');
        // }
        setHeight(1400 + 'px');
    };
    useEffect(() => {
        onLoad();
    }, []);

    return <iframe ref={ref} onLoad={onLoad} style={{ width: '1200px', height: '1500px' }} id="iframe" src={src} scrolling="no" frameBorder="0"></iframe>;
};
