import React from 'react';
import { Form, Alert } from 'react-bootstrap';
import styles from './index.module.scss'

interface PhotoUploadProps {
  error?: any;
  handlePhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ error, handlePhotoChange }) => {
  return (
    <Form.Group controlId="photos" className={styles.formGroup}>
      <Form.Label className={styles.formLabel}>Photos</Form.Label>
      <Form.Control
       className={styles.formControl}
        type="file"
        multiple
        onChange={handlePhotoChange}
        isInvalid={!!error}
      />
      {error && <Alert variant="danger">{error}</Alert>}
    </Form.Group>
  );
};

export default PhotoUpload;
