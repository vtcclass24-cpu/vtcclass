function reservar(){

let nombre=document.getElementById("nombre").value
let telefono=document.getElementById("telefono").value
let origen=document.getElementById("origen").value
let destino=document.getElementById("destino").value
let fecha=document.getElementById("fecha").value
let hora=document.getElementById("hora").value

let linea =
nombre + "," +
telefono + "," +
origen + "," +
destino + "," +
fecha + "," +
hora + "\n"

let blob=new Blob([linea],{type:"text/csv"})

let a=document.createElement("a")
a.href=URL.createObjectURL(blob)
a.download="reservas.csv"
a.click()

let whatsapp =
"https://wa.me/34600098215?text=" +
"Reserva VTC %0A" +
nombre + "%0A" +
origen + " → " +
destino + "%0A" +
fecha + " " +
hora

window.open(whatsapp)

alert("Reserva enviada")

}