import React from 'react';
import { Form, Alert } from 'react-bootstrap';
import styles from './index.module.scss'

interface FormInputProps {
    label: string;
    error?: any;
    register: any;
    name: string;
    type?: string;
    validation?: any;
    [x: string]: any;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, register, name, type = 'text', validation }) => {
  return (
    <Form.Group controlId={name} className={styles.formGroup} >
      <Form.Label className={styles.formLabel}>{label}</Form.Label>
      <Form.Control className={styles.formControl} type={type} {...register(name, validation)} isInvalid={!!error} />
      {error && <Alert variant="danger" className="text-danger m-3 custom-medium">{error.message}</Alert>}
    </Form.Group>
  );
};

export default FormInput;

