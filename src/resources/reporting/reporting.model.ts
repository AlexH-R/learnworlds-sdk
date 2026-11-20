export interface CourseAnalytics {
	students: number;
	videos: number;
	learning_units: number;
	video_time: number;
	video_viewing_time: number;
	avg_score_rate: number;
	success_rate: number;
	total_study_time: number;
	avg_time_to_finish: number;
	social_interactions: number;
	certificates_issued: number;
}
export interface LearningActivityAnalytics {
	type: string;
	name: string;
	users_completed: number;
	viewers: number;
	avg_study_time: number;
	total_study_time: number;
	avg_score_rate: number;
}
export interface UserProgressPerCourse {
	status: "not_started" | "completed" | "not_completed";
	progress_rate: number;
	average_score_rate: number;
	time_on_course: number;
	total_units: number;
	completed_units: number;
	completed_at: number | null;
	progress_per_section_unit: {
		section_id: string;
		units: {
			unit_section_name: string;
			unit_id: string;
			unit_name: string;
			unit_type: string;
			unit_status: string;
			unit_duration: string;
			time_on_unit: number;
			score_on_unit: number | null;
			unit_progress_rate: number;
		}[];
	}[];
}
export interface UserProgress {
	course_id: string;
	status: "not_started" | "completed" | "not_completed";
	progress_rate: number;
	average_score_rate: number;
	time_on_course: number;
	total_units: number;
	completed_units: number;
	completed_at: number | null;
	progress_per_section_unit: {
		section_id: string;
		units: {
			unit_section_name: string;
			unit_id: string;
			unit_name: string;
			unit_type: string;
			unit_status: string;
			unit_duration: string;
			time_on_unit: number;
			score_on_unit: number | null;
			unit_progress_rate: number;
		}[];
	}[];
}
