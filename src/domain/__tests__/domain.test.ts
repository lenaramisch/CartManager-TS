import domain from '../domain'
import { describe, test, expect } from '@jest/globals'; // Add this line

describe('calculate Cart Value', () => {
    test('test 1', () => {
        const testData = [
            { item: {id: 1, price: 3.5, name: "Fruitsalad"}, amount: 2 },
            { item: {id: 2, price: 1, name: "Banana"}, amount: 5 },
            { item: {id: 3, price: 0.5, name: "Apple"}, amount: 2 },
        ];
        const result = domain.calculateCartSum(testData)
        expect(result).toBe(13);
    })
});
