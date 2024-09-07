export interface User {
	first_name: string;
	last_name?: string | null;
	nickname?: string | null;
	email: string;
	avatar?: string | null;
}
