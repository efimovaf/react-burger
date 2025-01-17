import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { logout } from '../../services/user/action';
import { useAppDispatch } from '../../hooks/store';
import { Gap } from '../../components/ui/gap';
import style from './user-page.module.scss';

const UserPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();

	const onClickExit = () => {
		dispatch(logout());
	};

	return (
		<>
			<div className={style.main}>
				<nav className={style.nav}>
					<ul className={style.ul}>
						<li>
							<NavLink to={'/profile'} end>
								{({ isActive }) => (
									<p className={isActive ? style.navTextActive : style.navText}>
										Профиль
									</p>
								)}
							</NavLink>
						</li>
						<li>
							<NavLink to={'/profile/orders'} end>
								{({ isActive }) => (
									<p className={isActive ? style.navTextActive : style.navText}>
										История заказов
									</p>
								)}
							</NavLink>
						</li>
						<li>
							<button className={style.navButton} onClick={onClickExit}>
								Выход
							</button>
						</li>
					</ul>

					<Gap size={27} />

					<p className='text text_type_main-default text_color_inactive'>
						{location.pathname === '/profile'
							? 'В этом разделе вы можете изменить свои персональные данные'
							: 'В этом разделе вы можете просмотреть свою историю заказов'}
					</p>
				</nav>

				<Outlet />
			</div>
		</>
	);
};

export default UserPage;
