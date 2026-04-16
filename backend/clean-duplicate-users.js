const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

console.log('=== AVANT NETTOYAGE ===');
db.all("SELECT id, phone, role FROM users WHERE phone = '+221789999999'", (err, rows) => {
  if (err) console.error(err);
  else console.table(rows);
  
  // Garder l'ID le plus bas (le plus ancien) et supprimer les doublons
  db.run("DELETE FROM users WHERE phone = '+221789999999' AND id > (SELECT MIN(id) FROM users WHERE phone = '+221789999999')", function(err) {
    if (err) console.error(err);
    else console.log(`\n✅ ${this.changes} doublon(s) supprimé(s)\n`);
    
    // Mettre à jour le rôle restant en 'doctor'
    db.run("UPDATE users SET role = 'doctor' WHERE phone = '+221789999999'", function(err) {
      if (err) console.error(err);
      else console.log(`✅ Rôle mis à jour (doctor)\n`);
      
      console.log('=== APRÈS NETTOYAGE ===');
      db.all("SELECT id, phone, role FROM users WHERE phone = '+221789999999'", (err, rows) => {
        if (err) console.error(err);
        else console.table(rows);
        db.close();
      });
    });
  });
});