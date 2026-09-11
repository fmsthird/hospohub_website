import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPrototypeAuth } from '../src/services/authService.js';
import { authDestination, validateAuth } from '../src/utils/authValidation.js';

const storage = () => {
  const entries = new Map();
  return { getItem: (key) => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value), removeItem: (key) => entries.delete(key), contents: () => [...entries.values()].join('') };
};
const sample = { firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'MadeUp123', confirmPassword: 'MadeUp123', businessName: 'Sample Cafe', agreed: true };

test('registration saves a profile and signs in without persisting any password fields', () => {
  const local = storage(); const session = storage();
  const auth = createPrototypeAuth(local, session);
  const user = auth.register(sample);
  assert.equal(auth.getUser().id, user.id);
  assert.equal(user.businessName, sample.businessName);
  assert.doesNotMatch(local.contents() + session.contents(), /MadeUp123|password|confirmPassword/);
  auth.logout();
  assert.equal(auth.getUser(), null);
  assert.match(local.contents(), /Sample Cafe/);
});

test('login normalizes emails, rejects missing profiles and honors Remember me', () => {
  const local = storage(); const session = storage();
  const auth = createPrototypeAuth(local, session);
  assert.throws(() => auth.login({ email: sample.email }), /Create an account first/);
  auth.register(sample);
  assert.throws(() => auth.register({ ...sample, email: 'TEST@example.com' }), /already has/);
  auth.logout();
  auth.login({ email: ' TEST@example.com ', remember: true });
  assert.equal(createPrototypeAuth(local, storage()).getUser().email, sample.email);
  auth.login({ email: sample.email, remember: false });
  assert.equal(createPrototypeAuth(local, storage()).getUser(), null);
  assert.equal(auth.getUser().email, sample.email);
  local.setItem('unrelated', 'keep');
  auth.logout();
  assert.equal(local.getItem('unrelated'), 'keep');
});

test('corrupt stored profiles and sessions do not crash initialization', () => {
  const local = storage(); const session = storage();
  local.setItem('hospoHub.prototype.session', '{bad json');
  local.setItem('hospoHub.prototype.profiles', '{}');
  const auth = createPrototypeAuth(local, session);
  assert.equal(auth.getUser(), null);
  assert.doesNotThrow(() => auth.register(sample));
});

test('form validation checks every required field and password confirmation', () => {
  assert.deepEqual(validateAuth(sample, true), {});
  assert.deepEqual(validateAuth(sample), {});
  const errors = validateAuth({ ...sample, firstName: ' ', lastName: '', email: 'bad', password: 'short', confirmPassword: 'different', agreed: false }, true);
  for (const key of ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'agreed']) assert.ok(errors[key]);
  assert.ok(validateAuth({ email: '', password: '' }).password);
});

test('post-login destinations stay on known My Hub routes', () => {
  assert.equal(authDestination('/documents?folder=food'), '/documents?folder=food');
  for (const path of ['https://example.com', '//example.com', '/staff', '/help', undefined]) assert.equal(authDestination(path), '/dashboard');
});
