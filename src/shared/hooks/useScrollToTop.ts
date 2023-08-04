import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

const useScrollToTop = () => {
    // Extracts pathname property(key) from an object
    const { pathname } = useLocation();

    const [searchParameters] = useSearchParams()
    // Automatically scrolls to top whenever pathname changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname, searchParameters]);

}

export default useScrollToTop;