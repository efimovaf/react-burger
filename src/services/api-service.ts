import {
	AUTH_LOGIN_URL,
	AUTH_LOGOUT_URL,
	AUTH_REGISTER_URL,
	AUTH_TOKEN_URL,
	AUTH_USER_URL,
	DATA_URL,
	ORDER_URL,
	PASSWORD_RESET_SAVE_URL,
	PASSWORD_RESET_URL,
} from '../constant/system';
import {
	IErrorResponse,
	IIngredientsResponse,
	ILoginRequest,
	ILoginResponse,
	IOrderByNumberResponse,
	IOrderResponse,
	IRefreshTokenResponse,
	IRegisterResponse,
	IRegisterUserRequest,
	IServerResponse,
	IUpdateUserRequest,
	IUserResponse,
} from '../interfaces/api';

const checkResponse = <T>(response: Response): Promise<T> =>
	response.ok
		? response.json()
		: response.json().then((error) => Promise.reject(error));

const checkSuccess = <T>(result: IServerResponse<T>) => {
	if (result && result.success) {
		return result;
	}

	return Promise.reject(result);
};

export const refreshToken = () => {
	return fetch(AUTH_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			token: localStorage.getItem('refreshToken'),
		}),
	})
		.then(checkResponse<IServerResponse<IRefreshTokenResponse>>)
		.then((refreshData) => {
			if (!refreshData.success) {
				return Promise.reject(refreshData);
			}
			localStorage.setItem('refreshToken', refreshData.refreshToken);
			localStorage.setItem('accessToken', refreshData.accessToken);
			return refreshData;
		});
};

export const fetchWithRefresh = async <T>(
	url: string,
	options: RequestInit
) => {
	try {
		const result = await fetch(url, options);
		return await checkResponse<T>(result);
	} catch (error: unknown) {
		const knownError = error as IErrorResponse;
		if (knownError.message === 'jwt expired') {
			const refreshData = await refreshToken();
			(options.headers as { [key: string]: string }).authorization =
				refreshData.accessToken;
			const result = await fetch(url, options);
			return await checkResponse<T>(result);
		} else {
			return Promise.reject(knownError);
		}
	}
};

export const getIngredientsApi = () =>
	fetch(DATA_URL)
		.then(checkResponse<IServerResponse<IIngredientsResponse>>)
		.then(checkSuccess<IIngredientsResponse>);

export const getOrderApi = (param: string[]) =>
	fetchWithRefresh<IServerResponse<IOrderResponse>>(ORDER_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			authorization: localStorage.getItem('accessToken'),
		} as HeadersInit,
		body: JSON.stringify({
			ingredients: param,
		}),
	});

export const getOrderByNumberApi = (param: string) =>
	fetch(`${ORDER_URL}/${param}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		} as HeadersInit,
	})
		.then(checkResponse<IServerResponse<IOrderByNumberResponse>>)
		.then(checkSuccess<IOrderByNumberResponse>);

export const forgotPasswordApi = (email: string) =>
	fetch(PASSWORD_RESET_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		} as HeadersInit,
		body: JSON.stringify({
			email,
		}),
	}).then(checkResponse<IServerResponse<NonNullable<unknown>>>);

export const passwordResetApi = (password: string, token: string) =>
	fetch(PASSWORD_RESET_SAVE_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		} as HeadersInit,
		body: JSON.stringify({
			password,
			token,
		}),
	}).then(checkResponse<IServerResponse<NonNullable<unknown>>>);

export const authRegisterApi = (formValue: IRegisterUserRequest) =>
	fetch(AUTH_REGISTER_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		} as HeadersInit,
		body: JSON.stringify(formValue),
	})
		.then(checkResponse<IServerResponse<IRegisterResponse>>)
		.then(checkSuccess<IRegisterResponse>);

export const authLoginApi = (formValue: ILoginRequest) =>
	fetch(AUTH_LOGIN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		} as HeadersInit,
		body: JSON.stringify(formValue),
	})
		.then(checkResponse<IServerResponse<ILoginResponse>>)
		.then(checkSuccess<ILoginResponse>);

export const authLogoutApi = () =>
	fetch(AUTH_LOGOUT_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		} as HeadersInit,
		body: JSON.stringify({
			token: localStorage.getItem('refreshToken'),
		}),
	}).then(checkResponse<IServerResponse<NonNullable<unknown>>>);

export const getAuthUserApi = () =>
	fetchWithRefresh<IServerResponse<IUserResponse>>(AUTH_USER_URL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			authorization: localStorage.getItem('accessToken'),
		} as HeadersInit,
	});

export const updateAuthUserApi = (formValue: IUpdateUserRequest) =>
	fetchWithRefresh<IServerResponse<IUserResponse>>(AUTH_USER_URL, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			authorization: localStorage.getItem('accessToken'),
		} as HeadersInit,
		body: JSON.stringify(formValue),
	});
