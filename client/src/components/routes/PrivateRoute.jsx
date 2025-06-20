import { useNavigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/store';
import { useEffect } from 'react';

const PrivateRoute = ({ redirectTo }) => {
    const { userInfo } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate(redirectTo);
        }
    }, [userInfo, navigate, redirectTo]);

    return userInfo ? <Outlet /> : null;
};

export default PrivateRoute;
