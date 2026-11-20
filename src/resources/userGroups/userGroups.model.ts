export interface UserGroup {
	id: string;
	title: string;
	description: string;
	products: {
		courses: string[];
		learning_programs: string[];
	};
	max_number_of_users: number;
	enroll_users_on_courses: boolean;
	group_managers: {
		id: string;
		username: string;
		email: string;
		role_id: string;
	}[];
	tags: string[];
	created: number;
	modified: number;
}

export interface UserGroupCreationRequest {
	title: string;
	description?: string;
	products: {
		courses?: string[];
		learning_programs?: string[];
	};
	enroll_users_on_courses?: boolean;
	max_number_of_users?: number;
	group_managers?: string[];
	tags?: string[];
}

export type UserGroupModificationRequest = UserGroupCreationRequest;
