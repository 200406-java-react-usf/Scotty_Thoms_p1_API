import { isValidId, isValidStrings } from "../util/validator";


describe('validator testing', () => {

    test(' should return true when isValidId is given a Valid ID', () => {

        expect.assertions(3);

        let rOne = isValidId(1);
        let rTwo = isValidId(999);
        let rThree = isValidId(Number('50'));

        expect(rOne).toBe(true);
        expect(rTwo).toBe(true);
        expect(rThree).toBe(true);

    });

    test(' should return false when isValidId is given an invalid ID', () => {

        expect.assertions(5);

        let rOne = isValidId(-1);
        let rTwo = isValidId(NaN);
        let rThree = isValidId(null);
        let rFour = isValidId(3.14);
        let rFive = isValidId(0);

        expect(rOne).toBe(false);
        expect(rTwo).toBe(false);
        expect(rThree).toBe(false);
        expect(rFour).toBe(false);
        expect(rFive).toBe(false);

    });

    test('should return true when isValidStrings is given a valid String', () =>{

        let rOne = isValidStrings('dog');
        let rTwo = isValidStrings('wild', 'stuff');
        let rThree = isValidStrings(String('testmaybe'));
        let rFour = isValidStrings(String('hello'), String('world'));

        expect(rOne).toBe(true);
        expect(rTwo).toBe(true);
        expect(rThree).toBe(true);
        expect(rFour).toBe(true);

    });

    test('should return false when isValidStrings is given a valid String', () =>{

        let rOne = isValidStrings('');
        let rTwo = isValidStrings('Meow', '');
        let rThree = isValidStrings(String(''));
        let rFour = isValidStrings(String('hello'), String(''));

        expect(rOne).toBe(false);
        expect(rTwo).toBe(false);
        expect(rThree).toBe(false);
        expect(rFour).toBe(false);

    });


});