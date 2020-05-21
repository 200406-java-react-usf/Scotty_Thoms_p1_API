export interface UserSchema {
	user_id: number,
	username: string,
	password: string,
	first_name: string,
    last_name: string,
    email: string,
	user_role_id: string
}

export interface ReimbSchema {
    reimb_id: number;
    amount: number;
    timeSubmitted: Date;
    timeResolved: Date;
    description: String;
    author_id: number;
    resolver_id: number;
    reimb_status_id: number;
    reimb_type_id: number;
    
}