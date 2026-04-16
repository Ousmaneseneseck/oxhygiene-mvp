const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

// Voir les utilisateurs
console.log('=== UTILISATEURS ===');
db.all("SELECT id, phone, role FROM users", (err, rows) => {
  if (err) console.error(err);
  else console.table(rows);
  
  // Mettre à jour le médecin
  db.run("UPDATE users SET role = 'doctor' WHERE phone = '+221789999999'", function(err) {
    if (err) console.error(err);
    else console.log(`\n✅ Médecin mis à jour (${this.changes} ligne)`);
    
    // Vérifier après modification
    db.all("SELECT id, phone, role FROM users", (err, rows) => {
      if (err) console.error(err);
      else console.table(rows);
      db.close();
    });
  });
});