export interface User {
	uid: string;
	name: string;
	email: string;
	emailVerified: boolean;
	address?: string;
}