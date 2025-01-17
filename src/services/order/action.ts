import { AppDispatch, AppThunk } from '../../store/store';
import { getOrderApi, getOrderByNumberApi } from '../api-service';
import { IOrder } from '../../interfaces/order';

export const ORDER_LOADING = 'ORDER_LOADING';
export const ORDER_SUCCESS = 'ORDER_SUCCESS';
export const ORDER_FAILED = 'ORDER_FAILED';
export const ORDER_CLEAR = 'ORDER_CLEAR';
export const ORDER_GET_BY_NUMBER = 'ORDER_GET_BY_NUMBER';

const addSuccess = (payload: IOrder) => ({
	type: ORDER_SUCCESS,
	payload,
});

const addFailed = (payload: string) => ({
	type: ORDER_FAILED,
	payload,
});

const getByNumber = (payload: IOrder) => ({
	type: ORDER_GET_BY_NUMBER,
	payload,
});

export const getOrder = (param: string[]): AppThunk => {
	return (dispatch) => {
		dispatch({
			type: ORDER_LOADING,
		});
		getOrderApi(param)
			.then((result) => {
				if (result.success) {
					dispatch(addSuccess(result.order));

					return;
				}

				return Promise.reject(result);
			})
			.catch((error) => {
				dispatch(
					addFailed(
						`There has been a problem with your fetch operation: ${error}`
					)
				);
			});
	};
};

export const clearOrder = () => (dispatch: AppDispatch) => {
	dispatch({
		type: ORDER_CLEAR,
	});
};

export const getOrderByNumber = (param: string): AppThunk => {
	return (dispatch) => {
		dispatch({
			type: ORDER_LOADING,
		});
		getOrderByNumberApi(param)
			.then((result) => {
				if (result.success && result.orders?.length > 0) {
					dispatch(getByNumber(result.orders[0]));

					return;
				}

				return Promise.reject(result);
			})
			.catch((error) => {
				dispatch(
					addFailed(
						`There has been a problem with your fetch operation: ${JSON.stringify(
							error
						)}`
					)
				);
			});
	};
};
