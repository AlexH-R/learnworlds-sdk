export interface Paginated<T> {
	data: T[];
	meta: {
		page: number;
		totalItems: number;
		totalPages: number;
		itemsPerPage: number;
	};
}

export type PageQuery = {
	page?: number;
};
