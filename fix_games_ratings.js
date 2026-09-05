const fs = require('fs');
let code = fs.readFileSync('src/app/actions/ratings.ts', 'utf8');

code = code.replace(/diseno: scores\.disenoNiveles \|\| 0,/g, 'disenoNiveles: scores.disenoNiveles || 0,');
code = code.replace(/arte: scores\.arte \|\| 0,/g, 'arteEstetica: scores.arte || 0,');
code = code.replace(/personajes: scores\.personajes \|\| 0,/g, 'conexionPersonajes: scores.personajes || 0,');

fs.writeFileSync('src/app/actions/ratings.ts', code);
