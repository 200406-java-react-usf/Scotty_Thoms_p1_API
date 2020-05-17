import { User } from "../models/user";
import { UserSchema } from "./scemas";

/**
 * Maps the values that the database sends to a readable User object
 * @param resultSet {UserSchema} Schema used in mapping
 */
export function mapUserResultSet(resultSet: UserSchema): User {

	if (!resultSet) {
		return {} as User;
	}

	return new User (
		resultSet.id,
		resultSet.username,
		resultSet.password,
		resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.role_id
	);
}