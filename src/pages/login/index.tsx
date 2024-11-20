import React, { useState } from 'react';
import CenterPageWrapper from '../../components/ui/center-page-wrapper';
import {
	Button,
	EmailInput,
	PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';
import { Gap } from '../../components/ui/gap';
import { useAppDispatch } from '../../hooks/store';
import { login } from '../../services/user/action';
import style from '../common-page.module.scss';

const LoginPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onClickLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(login({ email, password }));
	};

	return (
		<CenterPageWrapper>
			<Gap size={40} />
			<div className={style.main}>
				<form onSubmit={onClickLogin}>
					<div className={style.edit}>
						<p className='text text_type_main-medium'>Вход</p>

						<EmailInput
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							name={'email'}
							isIcon={false}
						/>
						<PasswordInput
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							name={'password'}
							extraClass='mb-2'
						/>

						<Button htmlType='submit' type='primary' size='medium'>
							Войти
						</Button>
					</div>
				</form>

				<div className={style.additionalActions}>
					<div className={style.additionalAction}>
						<p className='text text_type_main-default'>
							Вы — новый пользователь?
						</p>
						<Link to={'/register'}>Зарегистрироваться</Link>
					</div>
					<div className={style.additionalAction}>
						<p className='text text_type_main-default'>Забыли пароль?</p>
						<Link to={'/forgot-password'}>Восстановить пароль</Link>
					</div>
				</div>
			</div>
		</CenterPageWrapper>
	);
};

export default LoginPage;