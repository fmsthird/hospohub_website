import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

const changed = [];
const edit = (file, transform) => {
  const before = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed.push(file);
  }
};
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);

edit('src/components/Header.jsx', s => s.replace(/        <div className="ml-auto pl-2">\s*<ThemeToggle \/>\s*<\/div>\n/, '').replace(/          <div className="mt-5 border-t pt-4">\s*<ThemeToggle expanded \/>\s*<\/div>\n/, '').replace('className={`min-h-11 min-w-11 p-2', 'className={`ml-auto min-h-11 min-w-11 p-2'));
edit('src/pages/StaffLogin.jsx', s => s.replace(/          <div className="mb-2 flex justify-end">\s*<ThemeToggle \/>\s*<\/div>\n/, ''));
edit('src/pages/HubSettings.jsx', s => s.replace(/      \{!profile && \(\s*<Panel className="mb-5">\s*<ThemeToggle expanded \/>\s*<\/Panel>\s*\)\}\n/, ''));
edit('src/pages/staff/StaffSettings.jsx', s => s.replace('    "Appearance",\n', '').replace(/      \{tab === "Appearance" && \(\s*<Panel>\s*<ThemeToggle expanded \/>\s*<\/Panel>\s*\)\}\n/, ''));
edit('src/components/staff/StaffCharts.jsx', s => s.replace(/import \{ useTheme \}[^\n]*\n/, '').replace(/import \{ chartPalette \}[^\n]*\n/, '').replace(/function useChartTheme\(\) \{[\s\S]*?\n\}/, `const palette = {
  text: '#475569',
  grid: '#e2e8f0',
  surface: '#ffffff',
  series: ['#008fc9', '#b7791f', '#0d9488', '#8b76c4', '#e06d71', '#64748b'],
};`).replaceAll('  const palette = useChartTheme();\n', ''));

for (const file of walk('src').filter(file => /\.(jsx|js)$/.test(file))) {
  if (/ThemeToggle|ThemeContext|useTheme|services[\\/]theme\.js/.test(file)) continue;
  edit(file, s => s.replace(/import ThemeToggle[^\n]*\n/g, '').replace(/^\s*<ThemeToggle(?: expanded)? \/>\n/gm, '').replace(/ ?dark:[^\s"'`{};<>]+/g, ''));
}
edit('src/main.jsx', () => `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Clear the former appearance preference without touching account or workspace data.
document.documentElement.classList.remove("dark");
document.documentElement.style.colorScheme = "only light";
try {
  localStorage.removeItem("hospoHubTheme");
} catch { /* Storage is optional. The site always uses its light appearance. */ }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>,
);
`);
edit('tailwind.config.js', s => s.replace('  darkMode: "class",\n', '').replace('"rgb(var(--color-background) / <alpha-value>)"', '"#F5F7FA"').replace('"rgb(var(--color-card) / <alpha-value>)"', '"#FFFFFF"').replace('"rgb(var(--color-border) / <alpha-value>)"', '"#D9E2EC"'));
edit('index.html', s => s.replace(/    <meta name="color-scheme"[\s\S]*?<\/script>\n/, `    <meta name="color-scheme" content="only light" />
    <style>html { background: #f5f7fa; color-scheme: only light; }</style>
`));
edit('src/index.css', s => {
  const root = postcss.parse(s);
  root.walkRules(rule => { if (rule.selector.includes('.dark')) rule.remove(); });
  root.walkAtRules('apply', rule => { rule.params = rule.params.replace(/ ?dark:[^\s]+/g, '').trim(); if (!rule.params) rule.remove(); });
  root.walkDecls(decl => { if (decl.prop.startsWith('--color-')) decl.remove(); if (decl.prop === 'color-scheme') decl.value = 'only light'; });
  root.walkRules(rule => { if (!rule.nodes.length) rule.remove(); });
  return root.toString();
});

edit('tests/presentation.test.mjs', s => {
  s = s.replace(/^const \{ ThemeContext \}[^\n]*\n/m, '').replace(/^const \{ default: ThemeToggle \}[^\n]*\n/m, '');
  const start = s.indexOf('function render('), end = s.indexOf('const links =', start);
  s = s.slice(0, start) + `function render(element, { path = '/', signedIn = false, staffId = 'STF-005' } = {}) {
    const staffUser = staffData.staffUsers.find(user => user.id === staffId);
    return renderToStaticMarkup(h(MemoryRouter, { initialEntries: [path] },
      h(AuthContext.Provider, { value: { user: signedIn ? customer : null, isAuthenticated: signedIn } },
        h(HubContext.Provider, { value: { data: emptyHub(), update: () => true, error: '' } },
          h(StaffAuthContext.Provider, { value: { staffUser, isStaffAuthenticated: true, data: staffData, hasPermission: permission => hasStaffPermission(staffUser, permission), dispatch: () => true, error: '' } }, element)))));
  }
  ` + s.slice(end);
  s = s.replace(' in either theme', '').replace('all main public pages share the footer and support both theme renders', 'all public pages share the footer and use the light interface').replace('all customer and staff pages render in both themes without a public footer', 'all customer and staff pages render without theme controls or a public footer').replace('staff sign-in shares the same theme options before authentication', 'staff sign-in uses the light interface without theme controls');
  s = s.replaceAll('for (const theme of ["light", "dark"]) {', '{').replace(/\n\s*theme,\n/g, '\n').replaceAll(', theme }', ' }');
  s = s.replaceAll('assert.match(html, /aria-label="Theme"/);', 'assert.doesNotMatch(html, /aria-label="Theme"|dark:/);');
  s = s.replace(/^\s*assert.match\(html, new RegExp\(`value="\$\{theme\}" selected=""`\)\);\n/gm, '').replace(/^\s*assert.match\(html, \/dark:bg-slate-9(?:50)?\/\);\n/gm, '');
  s = s.replace(/test\("theme settings expose one shared preference and native header choices",[\s\S]*$/, '');
  return s;
});
fs.writeFileSync('scripts/light-mode-files.json', JSON.stringify([...new Set(changed)]));
console.log(`Updated ${new Set(changed).size} files for a light-only interface.`);
