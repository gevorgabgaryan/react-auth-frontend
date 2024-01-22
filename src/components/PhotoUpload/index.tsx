import React from 'react';
import { Form, Alert } from 'react-bootstrap';
import styles from './index.module.scss';

interface PhotoUploadProps {
  error?: any;
  handlePhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  register: any;
  validation?: any;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  error,
  handlePhotoChange,
  register,
  validation,
}) => {
  return (
    <Form.Group controlId="files" className={styles.formGroup}>
      <Form.Label className={styles.formLabel}>Photos</Form.Label>
      <Form.Control
        className={styles.formControl}
        type="file"
        name="files"
        multiple
        onChange={handlePhotoChange}
        isInvalid={!!error}
        {...register('files', validation)}
      />
      {error && <Alert variant="danger">{error.message}</Alert>}
    </Form.Group>
  );
};

export default PhotoUpload;



