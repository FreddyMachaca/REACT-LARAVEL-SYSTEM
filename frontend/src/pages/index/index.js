import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import PageLoading from 'components/PageLoading';
import PageNotFound from 'pages/errors/PageNotFound';
export default function IndexPages(props) {
    return (
        <Suspense fallback={<PageLoading />}>
            <Outlet />
            <Routes>
				<Route path="*" element={<PageNotFound />} />
            </Routes>
        </Suspense>
    );
}
