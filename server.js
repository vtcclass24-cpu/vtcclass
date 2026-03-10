const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bodyParser = require("body-parser")
const ExcelJS = require("exceljs")
const Stripe = require("stripe")

const stripe = Stripe("TU_CLAVE_SECRETA_STRIPE")

const app = express()

app.use(bodyParser.json())
app.use(express.static("public"))

const db = new sqlite3.Database("vtcclass.db")

db.run(`
CREATE TABLE IF NOT EXISTS reservas (
id INTEGER PRIMARY KEY AUTOINCREMENT,
fecha TEXT,
hora TEXT,
cliente TEXT,
telefono TEXT,
pax INTEGER,
origen TEXT,
destino TEXT,
vuelo TEXT,
tren TEXT,
barco TEXT,
precio REAL,
hotel TEXT,
pagado INTEGER
)
`)

app.post("/crear-reserva", async (req,res)=>{

const r = req.body

db.run(`
INSERT INTO reservas
(fecha,hora,cliente,telefono,pax,origen,destino,vuelo,tren,barco,precio,hotel,pagado)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
`,
[
r.fecha,
r.hora,
r.cliente,
r.telefono,
r.pax,
r.origen,
r.destino,
r.vuelo,
r.tren,
r.barco,
r.precio,
r.hotel,
0
])

const session = await stripe.checkout.sessions.create({

payment_method_types:["card"],

line_items:[{
price_data:{
currency:"eur",
product_data:{name:"Transfer VTC CLASS"},
unit_amount: r.precio*100
},
quantity:1
}],

mode:"payment",

success_url:"https://central.vtcclass.com/pago-ok",
cancel_url:"https://central.vtcclass.com/pago-cancelado"

})

res.json({url:session.url})

})

app.get("/reservas",(req,res)=>{

db.all("SELECT * FROM reservas ORDER BY fecha,hora",(err,rows)=>{
res.json(rows)
})

})

app.get("/excel", async (req,res)=>{

const workbook = new ExcelJS.Workbook()
const sheet = workbook.addWorksheet("Reservas")

sheet.columns = [

{header:"Fecha",key:"fecha",width:15},
{header:"Hora",key:"hora",width:10},
{header:"Cliente",key:"cliente",width:25},
{header:"PAX",key:"pax",width:10},
{header:"Origen",key:"origen",width:25},
{header:"Destino",key:"destino",width:25},
{header:"Hotel",key:"hotel",width:25},
{header:"Precio",key:"precio",width:10}

]

db.all("SELECT * FROM reservas",(err,rows)=>{

rows.forEach(r=>sheet.addRow(r))

res.setHeader(
"Content-Type",
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
)

res.setHeader(
"Content-Disposition",
"attachment; filename=reservas.xlsx"
)

workbook.xlsx.write(res).then(()=>res.end())

})

})

app.listen(3000,()=>{
console.log("CENTRAL VTC CLASS ACTIVA")
})