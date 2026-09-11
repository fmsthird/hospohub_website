import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
after(() => server.close());
const { default: EstimatedFees } = await server.ssrLoadModule('/src/components/EstimatedFees.jsx');
const { FEE_DATA } = await server.ssrLoadModule('/src/data/licensingFees.js');
const { formatNZD } = await server.ssrLoadModule('/src/utils/formatNZD.js');
const render = (props) => renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(EstimatedFees, props)));

test('only selected categories appear for every combination', () => {
  for (let mask = 0; mask < 8; mask++) {
    const props = { food: Boolean(mask & 1), alcohol: Boolean(mask & 2), outdoor: Boolean(mask & 4) };
    const html = render(props);
    for (const category of ['food', 'alcohol', 'outdoor']) {
      assert.equal(html.includes(`/licensing-guide?guide=${category}`), props[category]);
    }
    assert.doesNotMatch(html, /Total cost|Estimated total/);
  }
});

test('food maximum is a partial known amount with separate variable charges', () => {
  const html = render({ food: true });
  assert.match(html, /Up to \$111\.84/);
  assert.match(html, /plus council registration and verification/);
  assert.match(html, /Separate charge/);
  assert.match(html, /This is not the final amount/);
});

test('unknown and invalid alcohol risk never guess a price', () => {
  for (const alcoholRisk of [undefined, 'invalid', 'toString']) {
    const html = render({ alcohol: true, alcoholRisk });
    assert.match(html, /Depends on risk rating/);
    assert.doesNotMatch(html, /\$|Risk category:/);
  }
});

test('explicit risk calculates application plus annual amounts', () => {
  const html = render({ food: true, alcohol: true, outdoor: true, alcoholRisk: 'medium' });
  assert.match(html, /\$816\.50/);
  assert.match(html, /\$632\.50/);
  assert.match(html, /\$1,449\.00/);
  assert.match(html, /Up to \$1,560\.84/);
  assert.match(html, /Current council rate/);
});

test('special licences exclude the standard risk fee schedule', () => {
  const html = render({ alcohol: true, alcoholRisk: 'medium', specialLicence: true });
  assert.match(html, /Separate special licence schedule/);
  assert.doesNotMatch(html, /\$|Alcohol annual fee/);
});

test('changing a source amount updates both its display and estimate', () => {
  const original = FEE_DATA.food.levy.amount;
  try {
    FEE_DATA.food.levy.amount = 100;
    assert.equal(FEE_DATA.food.levy.display, '$100.00');
    assert.match(render({ food: true }), /Up to \$112\.65/);
  } finally {
    FEE_DATA.food.levy.amount = original;
  }
});

test('currency formatting preserves cents and thousands separators', () => {
  assert.equal(formatNZD(368), '$368.00');
  assert.equal(formatNZD(609.5), '$609.50');
  assert.equal(formatNZD(1023.5), '$1,023.50');
});
