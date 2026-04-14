const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

// 1. Voir les utilisateurs avant modification
console.log('=== AVANT MODIFICATION ===');
db.all("SELECT id, phone, role FROM users", (err, rows) => {
  if (err) console.error(err);
  console.table(rows);
  
  // 2. Mettre à jour le rôle du médecin (ID 2)
  db.run("UPDATE users SET role = 'doctor' WHERE id = 2", function(err) {
    if (err) console.error(err);
    else console.log(`\n✅ ${this.changes} utilisateur(s) mis à jour (ID 2 → doctor)`);
    
    // 3. Supprimer le doublon ID 3
    db.run("DELETE FROM users WHERE id = 3", function(err) {
      if (err) console.error(err);
      else console.log(`✅ ${this.changes} doublon(s) supprimé`);
      
      // 4. Mettre à jour les profils
      db.run("INSERT OR REPLACE INTO profiles (userId, fullName, email, bloodType, address) VALUES (1, 'Jean Pierre Diop', 'jean.diop@email.com', 'O+', 'Dakar, Almadies, Sénégal')", function(err) {
        if (err) console.error(err);
        else console.log(`✅ Profil patient mis à jour`);
        
        db.run("INSERT OR REPLACE INTO profiles (userId, fullName, email) VALUES (2, 'Dr. Amadou Diallo', 'dr.diallo@email.com')", function(err) {
          if (err) console.error(err);
          else console.log(`✅ Profil médecin mis à jour`);
          
          // 5. Voir les utilisateurs après modification
          console.log('\n=== APRÈS MODIFICATION ===');
          db.all("SELECT id, phone, role FROM users", (err, rows) => {
            if (err) console.error(err);
            console.table(rows);
            db.close();
            console.log('\n✅ Base de données mise à jour avec succès !');
          });
        });
      });
    });
  });
});