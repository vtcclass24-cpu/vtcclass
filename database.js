const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("reservas.db")

db.serialize(()=>{

db.run(`

CREATE TABLE IF NOT EXISTS reservas(

id INTEGER PRIMARY KEY AUTOINCREMENT,
fecha TEXT,
hora TEXT,
hotel TEXT,
origen TEXT,
destino TEXT,
cliente TEXT,
telefono TEXT,
pax INTEGER,
precio REAL,
comision REAL,
tipo TEXT

)

`)

})

module.exports = db