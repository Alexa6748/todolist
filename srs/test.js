import { validateCreditCard } from '../ValidateCreditCard'

describe('Validate credit card number', () => {
  it('should throw error if card number is boolean', () => {
    const invalidCC = true
    expect(() => validateCreditCard(invalidCC)).toThrow(
      'The given value is not a string'
    )
  })
  it('returns true if the credit card number is valid', () => {
    const validCreditCard = '4111111111111111'
    const validationResult = validateCreditCard(validCreditCard)
    expect(validationResult).toBe(true)
  })
  it('should throw an error on non-numeric character in given credit card number', () => {
    const nonNumericCCNumbers = ['123ABCDEF', 'ABCDKDKD', 'ADS232']
    nonNumericCCNumbers.forEach(nonNumericCC => expect(() => validateCreditCard(nonNumericCC)).toThrow(
      `${nonNumericCC} is an invalid credit card number because ` + 'it has nonnumerical characters.'
    ))
  })
  it('should throw an error on credit card with invalid length', () => {
    const ccWithInvalidLength = ['41111', '4111111111111111111111']
    ccWithInvalidLength.forEach(invalidCC => expect(() => validateCreditCard(invalidCC)).toThrow(
      `${invalidCC} is an invalid credit card number because ` + 'of its length.'
    ))
  })
  it('should throw an error on credit card with invalid start substring', () => {
    const ccWithInvalidStartSubstring = ['12345678912345', '23456789123456', '789123456789123', '891234567891234', '912345678912345', '31345678912345', '32345678912345', '33345678912345', '38345678912345']
    ccWithInvalidStartSubstring.forEach(invalidCC => expect(() => validateCreditCard(invalidCC)).toThrow(
      `${invalidCC} is an invalid credit card number because ` + 'of its first two digits.'
    ))
  })
  it('should throw an error on credit card with luhn check fail', () => {
    const invalidCCs = ['411111111111111', '371211111111111', '49999999999999']
    invalidCCs.forEach(invalidCC => expect(() => validateCreditCard(invalidCC)).toThrow(
      `${invalidCC} is an invalid credit card number because ` + 'it fails the Luhn check.'
    ))
  })
})
import { PermutationinString } from '../PermutationinString.js'

describe('PermutationinString', () => {
  it("should  return true if one of s1's permutations is the substring of s2", () => {
    expect(PermutationinString('ab', 'eidbaooo')).toEqual(true)
    expect(PermutationinString('abc', 'bcab')).toEqual(true)
    expect(PermutationinString('ab', 'eidboaoo')).toEqual(false)
    expect(PermutationinString('abc', '')).toEqual(false)
  })
})
/**
 *  @name The-Sliding-Window Algorithm is primarily used for the problems dealing with linear data structures like Arrays, Lists, Strings etc.
 *  These problems can easily be solved using Brute Force techniques which result in quadratic or exponential time complexity.
 *  Sliding window technique reduces the required time to linear O(n).
 *  @see [The-Sliding-Window](https://www.geeksforgeeks.org/window-sliding-technique/)
 */
/**
 * @function PermutationinString
 * @description Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.
 * @param {String} s1 - The input string
 * @param {String} s2 - The input string
 * @return {boolean} - Returns true if s2 contains a permutation of s1, or false otherwise.
 */

export function PermutationinString (s1, s2) {
  if (s1.length > s2.length) return false
  let start = 0
  let end = s1.length - 1
  const s1Set = SetHash()
  const s2Set = SetHash()
  for (let i = 0; i < s1.length; i++) {
    s1Set[s1[i]]++
    s2Set[s2[i]]++
  }
  if (equals(s1Set, s2Set)) return true
  while (end < s2.length - 1) {
    if (equals(s1Set, s2Set)) return true
    end++
    console.log(s2[start], s2[end], equals(s1Set, s2Set))
    const c1 = s2[start]
    const c2 = s2[end]
    if (s2Set[c1] > 0) s2Set[c1]--
    s2Set[c2]++
    start++
    if (equals(s1Set, s2Set)) return true
  }
  return false
}
function equals (a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function SetHash () {
  const set = new Set()
  const alphabets = 'abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < alphabets.length; i++) {
    set[alphabets[i]] = 0
  }
  return set
}

// Example 1:
// Input: s1 = "ab", s2 = "eidbaooo"
// Output: true
// Explanation: s2 contains one permutation of s1 ("ba").

// Example 2:
// Input: s1 = "ab", s2 = "eidboaoo"
// Output: false
