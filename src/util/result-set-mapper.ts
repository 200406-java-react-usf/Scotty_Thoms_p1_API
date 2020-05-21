import { User } from "../models/user";
import { UserSchema, ReimbSchema } from "./scemas";
import { Reimbursement } from "../models/reimbursement";

/**
 * Maps the values that the database sends to a readable User object
 * @param resultSet {UserSchema} Schema used in mapping
 */
export function mapUserResultSet(resultSet: UserSchema): User {

	if (!resultSet) {
		return {} as User;
	}

	return new User (
		resultSet.user_id,
		resultSet.username,
		resultSet.password,
		resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.user_role_id
	);
}

export function mapReimbResultSet(resultSet: ReimbSchema): Reimbursement {
    if (!resultSet) {
        return {} as Reimbursement;
    }

    return new Reimbursement (
        resultSet.reimb_id,
        resultSet.amount,
        resultSet.timeSubmitted,
        resultSet.timeResolved,
        resultSet.description,
        resultSet.author_id,
        resultSet.resolver_id,
        resultSet.reimb_status_id,
        resultSet.reimb_type_id

    )
}