const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

// Voir les utilisateurs avant modification
console.log('=== AVANT MODIFICATION ===');
db.all("SELECT id, phone, role FROM users", (err, rows) => {
  if (err) {
    console.error('Erreur:', err);
    db.close();
    return;
  }
  console.table(rows);
  
  // Mettre à jour le rôle de l'utilisateur ID 2 (médecin)
  db.run("UPDATE users SET role = 'doctor' WHERE id = 2", function(err) {
    if (err) {
      console.error('Erreur mise à jour:', err);
    } else {
      console.log(`\n✅ ${this.changes} utilisateur(s) mis à jour (ID 2 → doctor)\n`);
    }
    
    // Voir les utilisateurs après modification
    console.log('=== APRÈS MODIFICATION ===');
    db.all("SELECT id, phone, role FROM users", (err, rows) => {
      if (err) {
        console.error('Erreur:', err);
      } else {
        console.table(rows);
      }
      db.close();
      console.log('\n✅ Base de données mise à jour avec succès !');
    });
  });
});