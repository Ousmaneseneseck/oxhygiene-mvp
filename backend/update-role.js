const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'oxhygiene.db');
const db = new sqlite3.Database(dbPath);

console.log('📁 Base de données ouverte:', dbPath);

// Voir les utilisateurs avant modification
db.all("SELECT id, phone, role FROM users", (err, rows) => {
  if (err) {
    console.error('Erreur:', err);
    return;
  }
  
  console.log('\n📋 Utilisateurs avant modification:');
  rows.forEach(row => {
    console.log(`ID: ${row.id}, Phone: ${row.phone}, Role: ${row.role}`);
  });
  
  // Mettre à jour le rôle du médecin
  db.run("UPDATE users SET role = 'doctor' WHERE phone = '+221779999999'", function(err) {
    if (err) {
      console.error('Erreur mise à jour:', err);
    } else {
      console.log(`\n✅ ${this.changes} utilisateur(s) mis à jour en tant que doctor`);
    }
    
    // Voir les utilisateurs après modification
    db.all("SELECT id, phone, role FROM users", (err, rows) => {
      if (err) {
        console.error('Erreur:', err);
        return;
      }
      
      console.log('\n📋 Utilisateurs après modification:');
      rows.forEach(row => {
        console.log(`ID: ${row.id}, Phone: ${row.phone}, Role: ${row.role}`);
      });
      
      db.close();
      console.log('\n✅ Base de données fermée');
    });
  });
});