import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, Button, Alert } from 'react-bootstrap';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { registerUser, selectError } from '../../features/auth/authSlice';
import FormInput from '../../components/FormInput';
import PhotoUpload from '../../components/PhotoUpload';

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
  const [selectedPhotos, setSelectedPhotos] = useState<FileList | null>(null);
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
    clearErrors,
  } = useForm<IFormInput>();

  const isValidAttachedFiles = (): boolean => {
    const files = Array.from(selectedPhotos || []);
    if (files.length < 4 ) {
      setError('files', {
        type: 'manual',
        message: 'PAt least 4 photos should be selected',
      });
      return false;
    }

    for (const file of files) {
      if (file.size > 1024 * 1024 * 3) {
        setError('files', {
          type: 'manual',
          message: 'File size exceeds 3MB limit.',
        });
        return false;
      }

      if (!file.type.startsWith('image/')) {
        setError('files', {
          type: 'manual',
          message: 'Only image files are allowed.',
        });
        return false;
      }
    }
    return true;
  };


  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (!isValid) {
        return;
      }

      const isValidPhotos = isValidAttachedFiles();
      if (!isValidPhotos) {
        return;
      }

      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (selectedPhotos) {
        for (let i = 0; i < selectedPhotos.length; i++) {
          formData.append('files', selectedPhotos[i]);
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedPhotos(files);
      clearErrors('files');
    }
  };


  const onLogin = () => {
    clearErrors();
    setBackendErrorMessage('');
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
         <PhotoUpload
          handlePhotoChange={handlePhotoChange}
          error={errors.files}
          register={register}
          validation={{
            required: 'This field is required',
          }}
        />
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
        <Button
          variant="link"
          className={styles.loginLink}
          onClick={onLogin}
        >
          Already have an account?
        </Button>
      </div>
    </div>
  );
};

export default Register;
