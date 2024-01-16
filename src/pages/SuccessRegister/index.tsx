import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

const SuccessRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className={styles.successContainer}>
      <h2>Registration Successful</h2>
      <p>Your account has been successfully created.</p>
      <button onClick={handleLoginClick}>
        Login
      </button>
    </div>
  );
};

export default SuccessRegisterPage;
