export interface CommunityCollection {
	id: string;
	name: string;
	description: string;
	display_order: number;
	space_ids: string[];
	created: number;
	modified: number;
}

export interface CommunitySpace {
	id: string;
	title: string;
	description: string;
	access: "public" | "private" | "standalone";
	owner: {
		id: string;
		username: string;
	};
	usages: {
		type: "ebook";
		courseId: string;
		unitId: string;
	}[];
	hidden_from_community: boolean;
	is_invitation_required: boolean;
	is_members_allowed_to_view_members: boolean;
	is_members_allowed_to_post: boolean;
	is_members_allowed_to_poll: boolean;
	is_members_allowed_to_comment: boolean;
	is_members_allowed_to_upvote: boolean;
	is_members_allowed_to_like: boolean;
	is_members_allowed_to_share: boolean;
	is_members_allowed_to_sort_posts: boolean;
	is_members_allowed_to_sort_posts_copy: boolean;
	is_members_allowed_to_upload_files: boolean;
	is_members_allowed_to_upload_images: boolean;
	is_members_allowed_to_upload_videos: boolean;
	is_members_allowed_to_mention_members: boolean;
	collectionId: string;
	default_post_sorting: "newest" | "oldest" | "newest_activity";
}

export interface CommunityPost {
	id: string;
	posted_in: {
		type: "space" | "course";
		id: string;
	};
	user: {
		id: string;
		username: string;
	};
	text: string;
	mentions: Record<string, unknown>[];
	likes: Record<string, unknown>[];
	upvotes: Record<string, unknown>[];
	items: {
		type: "poll" | "image" | "file" | "video";
		data: Record<string, unknown>;
	}[];
	created: number;
}

export type CommunitySpacesRequest = {
	page?: number;
	access?: "public" | "private" | "standalone";
	collectionId?: string;
	items_per_page?: number;
	usages?: string[];
};

export type CommunitySpaceCreationRequest = {
	title: string;
	description?: string;
	access: "public" | "private" | "standalone";
	collectionId?: string;
	hidden_from_community?: boolean;
	is_invitation_required?: boolean;
	is_members_allowed_to_view_members?: boolean;
	is_members_allowed_to_post?: boolean;
	is_members_allowed_to_poll?: boolean;
	is_members_allowed_to_comment?: boolean;
	is_members_allowed_to_upvote?: boolean;
	is_members_allowed_to_like?: boolean;
	is_members_allowed_to_share?: boolean;
	is_members_allowed_to_sort_posts?: boolean;
	is_members_allowed_to_upload_files?: boolean;
	is_members_allowed_to_upload_images?: boolean;
	is_members_allowed_to_upload_videos?: boolean;
	is_members_allowed_to_mention_members?: boolean;
	default_post_sorting?: "newest" | "oldest" | "newest_activity";
} & (
	| { access: "public" | "private"; collectionId: string }
	| { access: "standalone"; collectionId?: never }
);

export interface CommunitySpaceUser {
	id: string;
	username: string;
	status: "joined" | "invited" | "deleted" | "left";
}

export type CommunityPostsRequest = {
	page?: number;
	course_id?: string;
	items_per_page?: number;
	mentions?: string;
	space_id?: string;
	user_id?: string;
};

export interface CommunitySpaceModificationRequest {
	title?: string;
	description?: string;
	access?: "public" | "private";
	collectionId?: string;
	hidden_from_community?: boolean;
	is_invitation_required?: boolean;
	is_members_allowed_to_view_members?: boolean;
	is_members_allowed_to_post?: boolean;
	is_members_allowed_to_poll?: boolean;
	is_members_allowed_to_comment?: boolean;
	is_members_allowed_to_upvote?: boolean;
	is_members_allowed_to_like?: boolean;
	is_members_allowed_to_share?: boolean;
	is_members_allowed_to_sort_posts?: boolean;
	is_members_allowed_to_upload_files?: boolean;
	is_members_allowed_to_upload_images?: boolean;
	is_members_allowed_to_upload_videos?: boolean;
	is_members_allowed_to_mention_members?: boolean;
	default_post_sorting?: "newest" | "oldest" | "newest_activity";
}
