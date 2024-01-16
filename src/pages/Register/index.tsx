import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, Button, Alert} from 'react-bootstrap';
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
  photos: FileList;
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
    formState: { errors },
    clearErrors
  } = useForm<IFormInput>();


  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      clearErrors();
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (selectedPhotos) {
        for (let i = 0; i < selectedPhotos.length; i++) {
          formData.append('file', selectedPhotos[i]);
        }
      }
      await dispatch(registerUser(formData)).unwrap();
      setRegistrationSuccess(true);
      navigate('/success');
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedPhotos(files);
    }
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
          {...{ required: 'This field is required', minLength: { value: 2, message: 'Min length is 2 characters' }, maxLength: { value: 25, message: 'Max length is 25 characters' } }}
        />
        <FormInput
          label="Last Name"
          name="lastName"
          error={errors.lastName}
          register={register}
          {...{ required: 'This field is required', minLength: { value: 2, message: 'Min length is 2 characters' }, maxLength: { value: 25, message: 'Max length is 25 characters' } }}
        />
        <FormInput label="Email" name="email" error={errors.email} register={register} {...{ required: 'This field is required' }} />
        <FormInput
          label="Password"
          name="password"
          error={errors.password}
          register={register}
          {...{ required: 'This field is required', minLength: { value: 6, message: 'Min length is 6 characters' }, maxLength: { value: 50, message: 'Max length is 50 characters' }, pattern: { value: /\d/, message: 'Password must contain at least one number' } }}
        />
        <PhotoUpload error={errors.photos} handlePhotoChange={handlePhotoChange} />
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      {backendErrorMessage && <Alert variant="danger" className="text-danger m-3 custom-medium">{backendErrorMessage}</Alert>}
      <div className={styles.loginLinkContainer}>
        <Button variant="link" className={styles.loginLink} onClick={() => navigate('/login')}>
          Already have an account?
        </Button>
      </div>
    </div>
  );
};

export default Register;
