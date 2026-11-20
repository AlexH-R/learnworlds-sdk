export interface CourseCompletionRequest {
	send_course_complete_email: boolean;
	units: string[];
}

export interface CourseProgressResetRequest {
	units: string[];
}
