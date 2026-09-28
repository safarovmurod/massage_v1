import test from 'node:test'
import assert from 'node:assert/strict'
import { detectSource } from '../src/lib/attribution.ts'
import { isStrongPassword } from '../src/lib/password.ts'

test('attribution distinguishes supported tagged sources without inventing identity', () => {
  assert.equal(detectSource('?utm_source=Instagram', '', 'massage.test'), 'instagram')
  assert.equal(detectSource('?utm_source=whatsapp', '', 'massage.test'), 'whatsapp')
  assert.equal(detectSource('', 'https://l.instagram.com/?token=private', 'massage.test'), 'instagram')
  assert.equal(detectSource('', '', 'massage.test'), 'unknown')
})
test('untrusted lookalike domains are not labeled as social platforms', () => {
  assert.notEqual(detectSource('', 'https://instagram.com.evil.test', 'massage.test'), 'instagram')
  assert.notEqual(detectSource('', 'https://fakewa.me', 'massage.test'), 'whatsapp')
  assert.equal(detectSource('', 'https://massage.test/contact', 'massage.test'), 'unknown')
  assert.equal(detectSource('?utm_source=__proto__', '', 'massage.test'), 'unknown')
  assert.equal(detectSource('', 'broken url', 'massage.test'), 'unknown')
})
test('password rules enforce server minimum, character requirements and bcrypt byte limit', () => {
  assert.equal(isStrongPassword('password'), false)
  assert.equal(isStrongPassword('Password'), false)
  assert.equal(isStrongPassword('Password1'), true)
  assert.equal(isStrongPassword('Aa1' + 'x'.repeat(70)), false)
  assert.equal(isStrongPassword('Aa1' + 'я'.repeat(35)), false)
})
