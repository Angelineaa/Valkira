// Productos exportados desde Valkira (productos.data.js)
export const PRODUCTOS = [
  {id:1,  nombre:"Summer Dress",        categoria:"vestidos",   precio:80000, precioAntes:null,   tallas:["XS","S","M","L"],      status:"nuevo",    imagen:"/img/summer_dress.jpg", material:"100% Lino",   descripcion:"Vestido ajustado con efecto degradado en tonos rosa, coral y naranja inspirado en los colores del atardecer."},
  {id:2,  nombre:"Black Dress",       categoria:"vestidos",   precio:80000, precioAntes:null,   tallas:["S","M","L","XL"],      status:"nuevo",    imagen:"/img/Black_dress.jpg", material:"Viscosa 100%", descripcion:"Un vestido negro que combina sofisticación y modernidad en cada detalle."},
  {id:3,  nombre:"Body Liso",    categoria:"blusas",   precio:69000, precioAntes:100000, tallas:["XS","S","M"],          status:"oferta",   imagen:"/img/Body_Liso.jpg", material:"Algodón 95%, Elastano 5%", descripcion:"Minivestido de satén con acabado brillante suave."},
  {id:4,  nombre:"Noviembre",          categoria:"blusas",     precio:38000, precioAntes:70000, tallas:["XS","S","M","L","XL"], status:"oferta",   imagen:"/img/clasico_liso.jpg", material:"Seda 100%",   descripcion:"Blusa de seda natural en tono marfil."},
  {id:5, nombre:"Falda Brillante",        categoria:"faldas",     precio:62000, precioAntes:null,   tallas:["XS","S","M","L"],      status:"nuevo",    imagen:null, material:"Satén 100%",  descripcion:"Falda brillante, perfecta para conciertos y elevar cualquier outfit."},
  {id:6, nombre:"Baguette Clasico Liso",          categoria:"accesorios", precio:45000,  precioAntes:null,   tallas:[],                      status:"nuevo",    imagen:null, material:"cuero sintético", descripcion:"La combinación perfecta entre elegancia y practicidad."},
  {id:7, nombre:"Sweet",         categoria:"accesorios", precio:45000,  precioAntes:null,   tallas:[],                      status:null,       imagen:null, material:"Cuero sintético", descripcion:"Un bolso versátil diseñado para acompañarte en cada momento del día."},
  {id:8, nombre:"Aurora",         categoria:"accesorios", precio:45000,  precioAntes:null,   tallas:[],                      status:null,       imagen:null, material:"Cuero sintético", descripcion:"La combinación perfecta entre elegancia y practicidad."},
  {id:9, nombre:"BJean",         categoria:"accesorios", precio:45000,  precioAntes:null,   tallas:[],                      status:null,       imagen:null, material:"Tela de Jean", descripcion:"Jean + Bolso= BJean!"},
  {id:10, nombre:"Low cost",         categoria:"accesorios", precio:29000,  precioAntes:null,   tallas:[],                      status:null,       imagen:null, material:"Cuero sintético", descripcion:"Una opcion mas casual pero igual de hermosa."},
];

export function getProductoById(id){
  return PRODUCTOS.find(p => String(p.id) === String(id));
}
