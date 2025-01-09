export type Message = {
	role: 'human' | 'ai';
	content: string;
	options?: string[];
	timestamp: number;
};

export type UserType = {
	email: string;
	given_name: string;
	family_name: string;
	picture: string;
	id: string;
};

export type MessageOptions = {
	words: string;
};

export type StartSessionResponse = {
	session_id: string;
	message: string;
};

export type ChatResponse = {
	message: string;
	step: number;
	options: string[];
	profile?: SheetInfo;
};

export type SheetResponse = {
	message: string;
	sheetInfo: SheetInfo[];
};

export type SheetInfo = {
	id: string;
	email: string;
	school: string;
	program?: string;
	grad_year?: string;
	linkedin?: string;
	github?: string;
	industry?: string;
	track?: string;
	competition?: string;
	role_interest?: string;
	bio?: string;
	name?: string;
};
