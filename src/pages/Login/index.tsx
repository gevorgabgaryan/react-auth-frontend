import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, Button, Alert } from 'react-bootstrap';
import styles from './index.module.scss'
import { useNavigate } from 'react-router-dom';


interface IFormInput {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    // const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async () => {}


    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className={styles.formGroup} controlId="email">
                    <Form.Label className={styles.formLabel}>Email</Form.Label>
                    <Form.Control className={styles.formControl} type="email" {...register('email', { required: 'This field is required' })} />
                    {errors.email && <Alert variant="danger">{errors.email.message}</Alert>}
                </Form.Group>

                <Form.Group className={styles.formGroup} controlId="password">
                    <Form.Label className={styles.formLabel}>Password</Form.Label>
                    <Form.Control className={styles.formControl} type="password" {...register('password', { required: 'This field is required', minLength: { value: 6, message: 'Min length is 6 characters' }, maxLength: { value: 50, message: 'Max length is 50 characters' }, pattern: { value: /\d/, message: 'Password must contain at least one number' } })} />
                    {errors.password && <Alert variant="danger">{errors.password.message}</Alert>}
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
                <div className={styles.registerContainer}>
                    <Button variant="link" className={styles.registerLink} onClick={() => navigate('/register')}>
                        Dont have an account? Register
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Login;
