import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, Button, Alert } from 'react-bootstrap';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { registerUser, resetError, selectError } from '../../features/auth/authSlice';
import FormInput from '../../components/FormInput';

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  files: FileList;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const backendError = useAppSelector(selectError);
  const [backendErrorMessage, setBackendErrorMessage] = useState('');
  useEffect(() => {
    if (backendError) {
      setBackendErrorMessage(backendError);
    }
  }, [backendError]);
  useEffect(() => {
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (!isValid) {
        return;
      }

      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.files) {
        for (let i = 0; i < data.files.length; i++) {
          formData.append('files', data.files[i]);
        }
      }
      await dispatch(registerUser(formData)).unwrap();
      setRegistrationSuccess(true);
      navigate('/success');
    } catch (e) {
      if (e instanceof Array) {
        e.forEach((errorDetail) => {
          setError(errorDetail.field, {
            type: 'manual',
            message: errorDetail.constraints.join(' '),
          });
        });
      } else {
        console.error(e);
      }
    }
  };

  const validateFiles = (fileList: FileList) => {
    const files = Array.from(fileList);
    if (files.length < 4) {
      return 'At least 4 files must be selected';
    }

    for (const file of files) {
      if (file.size > 3 * 1024 * 1024) {
        return 'Each file must be less than 3MB';
      }
      if (!file.type.startsWith('image/')) {
        return 'Only image files are allowed.';
      }
    }

    return true;
  };

  const onLogin = () => {
    dispatch(resetError());
    navigate('/login');
  };

  if (registrationSuccess) {
    return <div>Registration successful! Redirecting...</div>;
  }

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>
      <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormInput
          label="First Name"
          name="firstName"
          error={errors.firstName}
          register={register}
          validation={{
            required: 'This field is required',
            minLength: { value: 2, message: 'Min length is 2 characters' },
            maxLength: { value: 25, message: 'Max length is 25 characters' },
          }}
        />
        <FormInput
          label="Last Name"
          name="lastName"
          error={errors.lastName}
          register={register}
          validation={{
            required: 'This field is required',
            minLength: { value: 2, message: 'Min length is 2 characters' },
            maxLength: { value: 25, message: 'Max length is 25 characters' },
          }}
        />
        <FormInput
          label="Email"
          name="email"
          error={errors.email}
          register={register}
          validation={{ required: 'This field is required' }}
        />
        <FormInput
          label="Password"
          name="password"
          error={errors.password}
          register={register}
          validation={{
            required: 'This field is required',
            minLength: { value: 6, message: 'Min length is 6 characters' },
            maxLength: { value: 50, message: 'Max length is 50 characters' },
            pattern: {
              value: /\d/,
              message: 'Password must contain at least one number',
            },
          }}
        />
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Photos</Form.Label>
          <Form.Control
            type="file"
            multiple
            {...register('files', {
              required: 'This field is required',
              validate: validateFiles,
            })}
          />
          {errors.files && <Alert variant="danger">{errors.files.message}</Alert>}
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      {backendErrorMessage && (
        <Alert variant="danger" className="text-danger m-3 custom-medium">
          {backendErrorMessage}
        </Alert>
      )}
      <div className={styles.loginLinkContainer}>
        <Button variant="link" className={styles.loginLink} onClick={onLogin}>
          Already have an account?
        </Button>
      </div>
    </div>
  );
};

export default Register;
