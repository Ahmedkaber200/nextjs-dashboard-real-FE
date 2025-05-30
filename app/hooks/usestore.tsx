import { combine } from 'zustand/middleware';
import {
	createRef,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import { create } from 'zustand';
import { get as GET } from "@/client/api-client";
import { zustandMiddleware } from '@/lib/zustand';

interface IStore {
	customers: [];
	
}
const initialState: IStore = {
	customers: [],
	
};
export const useStore = zustandMiddleware(
	combine(initialState, (set, get) => ({
		fetchCustomers: async () => {
			const state = get();
			const response = await GET('/customers')
			state.customers = response as IStore['customers'];
			set({ ...state });
		},
	})),
	'store'
);

export const storeRef = createRef<any>();
export const storeRefFunc = {
	reloadStore: () => {
		storeRef.current?.reloadStore();
	},
};

export const InitializeStore = forwardRef((_, ref) => {
	const [reload, setReload] = useState<boolean>(true);
	const {
		fetchCustomers,
	} = useStore();

	useImperativeHandle(ref, () => {
		return {
			reloadStore: () => {
				setReload(true);
			},
		};
	});

	useEffect(() => {
		const fetchData = async () => {
			await Promise.allSettled([
				fetchCustomers(),
			]);
		};

		if (reload) {
			fetchData();
			setReload(false);
		}
	}, [reload]);
	return null;
});
