import React, {useEffect} from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoutes from './utils/ProtectedRoute';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import SuccessRegisterPage from './pages/SuccessRegister';
import { useAppDispatch } from './hooks/redux-hooks';
import { validateToken } from './features/auth/authSlice';


function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  return (
    <div className="App">

        <Routes>
          <Route
            path="/"
            element={<PrivateRoutes />}
          >
            <Route
              path="/"
              element={<Navigate to="/profile" />}
            />
             <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/success' element={<SuccessRegisterPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

    </div>
  );
}

export default App;