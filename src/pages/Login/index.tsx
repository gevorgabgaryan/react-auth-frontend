import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, Button, Alert} from 'react-bootstrap';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { loginUser, selectError } from '../../features/auth/authSlice';
import FormInput from '../../components/FormInput';
import { ILoginInput } from '../../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const backendError = useAppSelector(selectError);
  const [backendErrorMessage, setBackendErrorMessage] = useState('');
  useEffect(() => {
    if (backendError) {
      setBackendErrorMessage(backendError);
    }
  }, [backendError]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
    clearErrors
  } = useForm<ILoginInput>();


  const onSubmit: SubmitHandler<ILoginInput> = async (data) => {
    try {
      if (!isValid) {
        return;
      }
      await dispatch(loginUser(data)).unwrap();
      navigate('/profile');
    } catch (e) {
      if (e instanceof Array) {
        e.forEach((errorDetail) => {
        setError(errorDetail.field, {
        type: "manual",
        message: errorDetail.constraints.join(" ")
        });
        });
        } else {
        console.error(e);
        }
    }
  };

  const onRegister = () => {
    clearErrors();
    setBackendErrorMessage('');
    navigate('/register');
 };


  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

        <FormInput label="Email" name="email" error={errors.email} register={register} validation={{ required: 'This field is required' }} />
        <FormInput
          label="Password"
          name="password"
          error={errors.password}
          register={register}
          validation={{ required: 'This field is required', minLength: { value: 6, message: 'Min length is 6 characters' }, maxLength: { value: 50, message: 'Max length is 50 characters' }, pattern: { value: /\d/, message: 'Password must contain at least one number' } }}
        />
        <Button variant="primary" type="submit" className='mt-3'>
          Login
        </Button>
      </Form>
      {backendErrorMessage && <Alert variant="danger" className="text-danger m-3 custom-medium">{backendErrorMessage}</Alert>}
      <div className={styles.registerLinkContainer}>
        <Button variant="link" className={styles.registerLink} onClick={onRegister}>
          Create account
        </Button>
      </div>
    </div>
  );
};

export default Login;