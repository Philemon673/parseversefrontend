const fs = require('fs');

const dbContent = fs.readFileSync('lib/database.ts', 'utf8');
const fixedDbContent = dbContent.split('\\n').join('\n');
fs.writeFileSync('lib/database.ts', fixedDbContent);

const secContent = fs.readFileSync('lib/security.ts', 'utf8');
const fixedSecContent = secContent.split('\\n').join('\n');
fs.writeFileSync('lib/security.ts', fixedSecContent);

console.log('Fixed newlines successfully');
