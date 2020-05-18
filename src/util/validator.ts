/*
    All validators are in one class for ease of access and reusability.
*/

/**
 * Checks to see if object is empty
 * @param obj {Object} object being checked
 */
export function isEmptyObject<T>(obj: T) {
    return obj && Object.keys(obj).length === 0;
}

/**
 * Checks to see if the given param(s) are ALL of type string && truthy
 * @param strs {...strs} strings being checked
 */
export const isValidStrings = (...strs: string[]): boolean => {
   
    for (let str of strs) {
        if (!str || typeof str !== 'string') {
            return false;
        }
    }

    return true;

}

/**
 * Will check to see if the given object is valid -- every key is truthy
 * @param obj {Object} the object being checked
 * @param nullableProps {...string} values you want this function to ignore
 */
export const isValidObject = (obj: Object, ...nullableProps: string[]) => {
    
    return obj && Object.keys(obj).every(key => {
        if (nullableProps.includes(key)) return true;
        return obj[key];
    });

}
