import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
after(() => server.close());
const { AuthContext } = await server.ssrLoadModule('/src/hooks/useAuth.js');
const { default: ProtectedRoute } = await server.ssrLoadModule('/src/components/ProtectedRoute.jsx');
const { default: Header } = await server.ssrLoadModule('/src/components/Header.jsx');
const { default: AuthForm } = await server.ssrLoadModule('/src/components/AuthForm.jsx');
const h = React.createElement;
const render = (element, authenticated = false, path = '/') => renderToStaticMarkup(h(MemoryRouter, { initialEntries: [path] }, h(AuthContext.Provider, { value: { isAuthenticated: authenticated, user: authenticated ? { firstName: 'Test' } : null } }, element)));

test('My Hub content is withheld from visitors and rendered for signed-in users', () => {
  for (const path of ['/dashboard', '/my-applications', '/documents', '/document-upload', '/messages']) {
    const content = h(ProtectedRoute, null, h('p', null, 'Private content'));
    assert.doesNotMatch(render(content, false, path), /Private content/);
    assert.match(render(content, true, path), /Private content/);
  }
});

test('public header keeps public links and changes account actions with session state', () => {
  const visitor = render(h(Header));
  for (const path of ['/get-started', '/licensing-guide', '/learning-centre', '/resources', '/help', '/login', '/create-account']) assert.ok(visitor.includes(`href="${path}"`));
  const member = render(h(Header), true);
  assert.match(member, /Sign out/);
  assert.match(member, /href="\/dashboard"/);
  assert.doesNotMatch(member, /href="\/login"|href="\/create-account"/);
});

test('account forms show labelled inputs, password controls and prototype limitations', () => {
  const login = render(h(AuthForm));
  assert.match(login, /Remember me/);
  assert.match(login, /href="\/forgot-password"/);
  const register = render(h(AuthForm, { registering: true }));
  for (const id of ['firstName', 'lastName', 'email', 'businessName', 'password', 'confirmPassword', 'agreed']) assert.ok(register.includes(`for="${id}"`));
  assert.match(register, /Show confirm password/);
  assert.match(register, /Passwords are not stored or checked/);
});
