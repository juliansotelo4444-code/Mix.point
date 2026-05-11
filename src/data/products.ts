import type { Product } from '../types';

export const products: Product[] = [

  // ─── FRUTOS SECOS ───────────────────────────────────────────────────────────
  {
    id: 1,
    nombre: "Nueces Mariposa Chandler Extra light",
    categoria: "Frutos Secos",
    precios: { kg: 21850, cincoKg: 20700, diezKg: 18630 },
    imagen: "/assets/nuez-mariposa-extra.jpg"
  },
  {
    id: 2,
    nombre: "Nueces Mariposa Ambar",
    categoria: "Frutos Secos",
    precios: { kg: 17250, cincoKg: 16100, diezKg: 15525 },
    imagen: "/assets/nuez-ambar.jpg"
  },
  {
    id: 3,
    nombre: "Nuez Cuarto Extra Light",
    categoria: "Frutos Secos",
    precios: { kg: 19435, cincoKg: 18400, diezKg: 16100 },
    imagen: "/assets/nuez-cuarto.jpg"
  },
  {
    id: 4,
    nombre: "Nuez Con Cascara",
    categoria: "Frutos Secos",
    precios: { kg: 7935, cincoKg: 5520 },
    imagen: "/assets/nuez-con-cascara.jpg"
  },
  {
    id: 5,
    nombre: "Almendras Guara Nacionales",
    categoria: "Frutos Secos",
    precios: { kg: 21735, cincoKg: 20700, diezKg: 19780 },
    imagen: "/assets/almendras-guara.jpg"
  },
  {
    id: 6,
    nombre: "Almendras Non Pareil Chilenas",
    categoria: "Frutos Secos",
    precios: { kg: 23000, cincoKg: 21850, diezKg: 21275 },
    imagen: "/assets/Almendras-Chilenas.jpg"
  },
  {
    id: 7,
    nombre: "Castañas De Caju W4",
    categoria: "Frutos Secos",
    precios: { kg: 18975, cincoKg: 18400, diezKg: 17250 },
    imagen: "/assets/castanas-caju.jpg"
  },
  {
    id: 8,
    nombre: "Avellanas",
    categoria: "Frutos Secos",
    precios: { kg: 31050, cincoKg: 29900, diezKg: 27600 },
    imagen: "/assets/avellanas.jpg"
  },
  {
    id: 9,
    nombre: "Pistacho",
    categoria: "Frutos Secos",
    precios: { kg: 42550, cincoKg: 40250, diezKg: 36800 },
    imagen: "/assets/Pistacho.jpg"
  },
  {
    id: 10,
    nombre: "Pasas De Uva Jumbo",
    categoria: "Frutos Secos",
    precios: { kg: 8280, cincoKg: 7360, diezKg: 6670 },
    imagen: "/assets/pasas-jumbo.jpg"
  },
  {
    id: 11,
    nombre: "Pasas De Uva Sultaninas",
    categoria: "Frutos Secos",
    precios: { kg: 4600, cincoKg: 4140, diezKg: 3565 },
    imagen: "/assets/pasas-sultaninas.jpg"
  },
  {
    id: 12,
    nombre: "Pasas De Uva Rubias",
    categoria: "Frutos Secos",
    precios: { kg: 8280, cincoKg: 7475, diezKg: 6785 },
    imagen: "/assets/pasas-rubias.jpg"
  },
  {
    id: 13,
    nombre: "Ciruela Sin Carozo",
    categoria: "Frutos Secos",
    precios: { kg: 8625, cincoKg: 7820, diezKg: 7095 },
    imagen: "/assets/ciruela-sin-carozo.jpg"
  },
  {
    id: 14,
    nombre: "Arandanos",
    categoria: "Frutos Secos",
    precios: { kg: 15525, cincoKg: 14375, diezKg: 13685 },
    imagen: "/assets/arandanos.jpg"
  },
  {
    id: 15,
    nombre: "Banana Chips Desecada",
    categoria: "Frutos Secos",
    precios: { kg: 13225, cincoKg: 11730 },
    imagen: "/assets/banana-chips.jpg"
  },
  {
    id: 16,
    nombre: "Datiles",
    categoria: "Frutos Secos",
    precios: { kg: 8970, cincoKg: 8280 },
    imagen: "/assets/datiles.jpg"
  },
  {
    id: 17,
    nombre: "Higos Negros",
    categoria: "Frutos Secos",
    precios: { kg: 12075 },
    imagen: "/assets/higos-negros.jpg"
  },
  {
    id: 18,
    nombre: "Pasta De Mani Odiis",
    categoria: "Frutos Secos",
    precios: { kg: 2875 },
    imagen: "/assets/pasta-mani.jpg"
  },

  // ─── MIXES ──────────────────────────────────────────────────────────────────
  {
    id: 19,
    nombre: "Mix Patagonia",
    descripcion: "Arandanos, almendras, caju, nuez",
    categoria: "Mixes",
    precios: { kg: 18975, cincoKg: 18400, diezKg: 17480 },
    imagen: "/assets/Mix Patagonia.jpg"
  },
  {
    id: 20,
    nombre: "Mix Frutas Sin Mani",
    descripcion: "Almendra, nuez, pasas, castaña",
    categoria: "Mixes",
    precios: { kg: 14950, cincoKg: 13800, diezKg: 12650 },
    imagen: "/assets/Mix Frutas Sin Mani.jpg"
  },
  {
    id: 21,
    nombre: "Mix Sin Pasas",
    descripcion: "Nuez, mani, almendra, castaña",
    categoria: "Mixes",
    precios: { kg: 14950, cincoKg: 13800, diezKg: 12650 },
    imagen: "/assets/mix-sin-pasas.jpg"
  },
  {
    id: 22,
    nombre: "Mix Premium",
    descripcion: "Nuez, castañas, almendras, avellanas",
    categoria: "Mixes",
    precios: { kg: 21275, cincoKg: 20700, diezKg: 20125 },
    imagen: "/assets/Mix Premium.jpg"
  },
  {
    id: 23,
    nombre: "Mix Banana",
    descripcion: "Banana, nuez, almendras, pasas, mani",
    categoria: "Mixes",
    precios: { kg: 7820, cincoKg: 7475, diezKg: 7130 },
    imagen: "/assets/mix-banana.jpg"
  },
  {
    id: 24,
    nombre: "Mix Tropical",
    descripcion: "Banana, pasas, papaya, ananá cubos, nuez",
    categoria: "Mixes",
    precios: { kg: 14835, cincoKg: 14375 },
    imagen: "/assets/mix-tropical.jpg"
  },
  {
    id: 25,
    nombre: "Mix Economico",
    descripcion: "Pasas, mani, nuez, almendras",
    categoria: "Mixes",
    precios: { kg: 7130, cincoKg: 6900, diezKg: 6670 },
    imagen: "/assets/mix-economico.jpg"
  },
  {
    id: 26,
    nombre: "Mix Cervecero",
    descripcion: "Maiz frito, mani salado, girasol, semilla zapallo, mani chino",
    categoria: "Mixes",
    precios: { kg: 7130, cincoKg: 6555, diezKg: 6325 },
    imagen: "/assets/mix-cervecero.jpg"
  },

  // ─── CEREALES / PRODUCTOS NATURALES ─────────────────────────────────────────
  {
    id: 27,
    nombre: "Almohaditas Frutilla",
    categoria: "Cereales",
    precios: { kg: 6900, diezKg: 15525 },
    imagen: "/assets/almohaditas.jpg"
  },
  {
    id: 28,
    nombre: "Almohaditas Avellanas",
    categoria: "Cereales",
    precios: { kg: 6900, diezKg: 15525 },
    imagen: "/assets/almohaditas.jpg"
  },
  {
    id: 29,
    nombre: "Almohaditas Limon",
    categoria: "Cereales",
    precios: { kg: 6900, diezKg: 15525 },
    imagen: "/assets/almohaditas.jpg"
  },
  {
    id: 30,
    nombre: "Almohaditas Chocolate",
    categoria: "Cereales",
    precios: { kg: 7475, diezKg: 17135 },
    imagen: "/assets/almohaditas.jpg"
  },
  {
    id: 31,
    nombre: "Quinoa Pop Inflada",
    categoria: "Cereales",
    precios: { kg: 5750, diezKg: 14835 },
    imagen: "/assets/quinoa-pop.jpg"
  },
  {
    id: 32,
    nombre: "Arito Frutal",
    categoria: "Cereales",
    precios: { kg: 5750, cincoKg: 12937 },
    imagen: "/assets/arito-frutal.jpg"
  },
  {
    id: 33,
    nombre: "Bolita Chocolate",
    categoria: "Cereales",
    precios: { kg: 6325, diezKg: 15985 },
    imagen: "/assets/bolita-chocolate.jpg"
  },
  {
    id: 34,
    nombre: "Fibra De Salvado",
    categoria: "Cereales",
    precios: { kg: 4025, cincoKg: 9430 },
    imagen: "/assets/fibra-salvado.jpg"
  },
  {
    id: 35,
    nombre: "Copos Con Azucar",
    categoria: "Cereales",
    precios: { kg: 4600, diezKg: 12075 },
    imagen: "/assets/copos.jpg"
  },
  {
    id: 36,
    nombre: "Copos Sin Azucar",
    categoria: "Cereales",
    precios: { kg: 4025, diezKg: 9568 },
    imagen: "/assets/copos.jpg"
  },
  {
    id: 37,
    nombre: "Granola",
    categoria: "Cereales",
    precios: { kg: 4370, cincoKg: 3910, treintaKg: 33350 },
    imagen: "/assets/granola.jpg"
  },
  {
    id: 38,
    nombre: "Sal De Himalaya",
    categoria: "Cereales",
    precios: { kg: 2875, cincoKg: 2415 },
    imagen: "/assets/sal-himalaya.jpg"
  },
  {
    id: 39,
    nombre: "Sal Marina Fina",
    descripcion: "Por 500gr",
    categoria: "Cereales",
    precios: { kg: 1100 },
    imagen: "/assets/sal-marina.jpg"
  },
  {
    id: 40,
    nombre: "Bicarbonato",
    categoria: "Cereales",
    precios: { kg: 3795, cincoKg: 3565 },
    imagen: "/assets/bicarbonato.jpg"
  },
  {
    id: 41,
    nombre: "Gelatina Sin Sabor",
    categoria: "Cereales",
    precios: { kg: 23575 },
    imagen: "/assets/gelatina.jpg"
  },
  {
    id: 42,
    nombre: "Tomates Secos",
    categoria: "Cereales",
    precios: { kg: 17135 },
    imagen: "/assets/tomates-secos.jpg"
  },

  // ─── REPOSTERÍA ─────────────────────────────────────────────────────────────
  {
    id: 43,
    nombre: "Chips Chocolate Negro y Blanco",
    categoria: "Reposteria",
    precios: { kg: 11040, cincoKg: 10120 },
    imagen: "/assets/chips-chocolate.jpg"
  },
  {
    id: 44,
    nombre: "Cacao Amargo Puro",
    categoria: "Reposteria",
    precios: { kg: 9890, cincoKg: 8740 },
    imagen: "/assets/cacao-amargo.jpg"
  },
  {
    id: 45,
    nombre: "Mani Con Chocolate",
    categoria: "Reposteria",
    precios: { kg: 12650, cincoKg: 11730 },
    imagen: "/assets/mani-chocolate.jpg"
  },
  {
    id: 46,
    nombre: "Almendras Con Chocolate",
    categoria: "Reposteria",
    precios: { kg: 28750, cincoKg: 26450 },
    imagen: "/assets/almendras-chocolate.jpg"
  },
  {
    id: 47,
    nombre: "Pasas Con Chocolate",
    categoria: "Reposteria",
    precios: { kg: 18860, cincoKg: 17250 },
    imagen: "/assets/pasas-chocolate.jpg"
  },
  {
    id: 48,
    nombre: "Rocklert Aguila",
    categoria: "Reposteria",
    precios: { kg: 15180, cincoKg: 13800 },
    imagen: "/assets/rocklert.jpg"
  },
  {
    id: 49,
    nombre: "Coco Rallado",
    categoria: "Reposteria",
    precios: { kg: 8970, cincoKg: 8280 },
    imagen: "/assets/coco-rallado.jpg"
  },
  {
    id: 50,
    nombre: "Polvo Para Hornear",
    categoria: "Reposteria",
    precios: { kg: 7360, cincoKg: 6900 },
    imagen: "/assets/polvo-hornear.jpg"
  },
  {
    id: 51,
    nombre: "Tabletas Aguila x5KG",
    categoria: "Reposteria",
    precios: {kg:0, cincoKg: 125350 },
    imagen: "/assets/tabletas-aguila.jpg"
  },

  // ─── SNACKS ─────────────────────────────────────────────────────────────────
  {
    id: 52,
    nombre: "Mani Salado Pelado",
    categoria: "Snacks",
    precios: { kg: 3220, cincoKg: 2875, diezKg: 2645, veinticincoKg: 2530 },
    imagen: "/assets/mani-salado.jpg"
  },
  {
    id: 53,
    nombre: "Mani Tostado Sin Sal",
    categoria: "Snacks",
    precios: { kg: 3220, cincoKg: 2875, diezKg: 2645, veinticincoKg: 2530 },
    imagen: "/assets/mani-tostado.jpg"
  },
  {
    id: 145,
    nombre: "Aceite De Sesamo",
    descripcion: "x250cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 6555, cincoKg: 6210 },
    imagen: "/assets/aceite-sesamo.jpg"
  },

  // ─── OTROS ──────────────────────────────────────────────────────────────────
  {
    id: 146,
    nombre: "Miel Pura X 1KG",
    categoria: "Otros",
    precios: { kg: 4025 },
    imagen: "/assets/Miel Pura X 1KG.jfif"
  },
  {
    id: 56,
    nombre: "Mani Saborizado / Mani Chino",
    categoria: "Snacks",
    precios: { kg: 4025, cincoKg: 3450, diezKg: 2990 },
    imagen: "/assets/mani-chino.jpg"
  },
  {
    id: 57,
    nombre: "Mani De Vaina",
    categoria: "Snacks",
    precios: { kg: 4025, cincoKg: 3680, diezKg: 3220 },
    imagen: "/assets/mani-vaina.jpg"
  },
  {
    id: 58,
    nombre: "Maiz Frito Salado",
    categoria: "Snacks",
    precios: { kg: 11385, cincoKg: 10350 },
    imagen: "/assets/maiz-frito.jpg"
  },
  {
    id: 59,
    nombre: "Garrapiñadas",
    categoria: "Snacks",
    precios: { kg: 4025, cincoKg: 3680 },
    imagen: "/assets/garrapinadas.jpg"
  },
  {
    id: 60,
    nombre: "Palito Salado",
    categoria: "Snacks",
    precios: { kg: 3680, cincoKg: 3450, diezKg: 3220, veinticincoKg: 2875 },
    imagen: "/assets/palito-salado.jpg"
  },
  {
    id: 61,
    nombre: "Tutuca",
    categoria: "Snacks",
    precios: { kg: 4140, cincoKg: 3450 },
    imagen: "/assets/tutuca.jpg"
  },

  // ─── LEGUMBRES ──────────────────────────────────────────────────────────────
  {
    id: 62,
    nombre: "Lenteja",
    categoria: "Legumbres",
    precios: { kg: 2875, cincoKg: 12650 },
    imagen: "/assets/lenteja.jpg"
  },
  {
    id: 63,
    nombre: "Lentejon",
    categoria: "Legumbres",
    precios: { kg: 3335, cincoKg: 13800, treintaKg: 66700 },
    imagen: "/assets/lentejon.jpg"
  },
  {
    id: 64,
    nombre: "Arroz Yamani",
    categoria: "Legumbres",
    precios: { kg: 2530, cincoKg: 9890, treintaKg: 48990 },
    imagen: "/assets/arroz-yamani.jpg"
  },
  {
    id: 65,
    nombre: "Arroz Integral",
    categoria: "Legumbres",
    precios: { kg: 2300, cincoKg: 9315, treintaKg: 42435 },
    imagen: "/assets/arroz-integral.jpg"
  },
  {
    id: 66,
    nombre: "Avena Instantanea",
    categoria: "Legumbres",
    precios: { kg: 2300, cincoKg: 9430, treintaKg: 44850 },
    imagen: "/assets/avena.jpg"
  },
  {
    id: 67,
    nombre: "Garbanzo",
    categoria: "Legumbres",
    precios: { kg: 2530, cincoKg: 10350, treintaKg: 42320 },
    imagen: "/assets/garbanzo.jpg"
  },
  {
    id: 68,
    nombre: "Poroto Alubia",
    categoria: "Legumbres",
    precios: { kg: 3910, cincoKg: 17480 },
    imagen: "/assets/poroto-alubia.jpg"
  },
  {
    id: 69,
    nombre: "Poroto Soja",
    categoria: "Legumbres",
    precios: { kg: 1495 },
    imagen: "/assets/poroto-soja.jpg"
  },
  {
    id: 70,
    nombre: "Poroto Colorado",
    categoria: "Legumbres",
    precios: { kg: 2990, cincoKg: 12880 },
    imagen: "/assets/poroto-colorado.jpg"
  },
  {
    id: 71,
    nombre: "Poroto Aduki",
    categoria: "Legumbres",
    precios: { kg: 3335, cincoKg: 14835 },
    imagen: "/assets/poroto-aduki.jpg"
  },
  {
    id: 72,
    nombre: "Poroto Negro",
    categoria: "Legumbres",
    precios: { kg: 2875, cincoKg: 11270 },
    imagen: "/assets/poroto-negro.jpg"
  },
  {
    id: 73,
    nombre: "Poroto Pallares Grande",
    categoria: "Legumbres",
    precios: { kg: 6440, cincoKg: 31050 },
    imagen: "/assets/poroto-pallares.jpg"
  },
  {
    id: 74,
    nombre: "Pisingallo",
    categoria: "Legumbres",
    precios: { kg: 1610, cincoKg: 6670, treintaKg: 34500 },
    imagen: "/assets/pisingallo.jpg"
  },

  // ─── CONDIMENTOS ────────────────────────────────────────────────────────────
  {
    id: 75,
    nombre: "Oregano",
    categoria: "Condimentos",
    precios: { kg: 6900, cincoKg: 6325 },
    imagen: "/assets/oregano.jpg"
  },
  {
    id: 76,
    nombre: "Provenzal",
    categoria: "Condimentos",
    precios: { kg: 4370, cincoKg: 4025 },
    imagen: "/assets/provenzal.jpg"
  },
  {
    id: 77,
    nombre: "Adobo Para Pizza",
    categoria: "Condimentos",
    precios: { kg: 4025, cincoKg: 3680 },
    imagen: "/assets/adobo-pizza.jpg"
  },
  {
    id: 78,
    nombre: "Pimenton",
    categoria: "Condimentos",
    precios: { kg: 4025, cincoKg: 3680 },
    imagen: "/assets/pimenton.jpg"
  },
  {
    id: 79,
    nombre: "Pimenton Ahumado",
    categoria: "Condimentos",
    precios: { kg: 8970, cincoKg: 8280 },
    imagen: "/assets/pimenton-ahumado.jpg"
  },
  {
    id: 80,
    nombre: "Pimienta Negra Molida",
    categoria: "Condimentos",
    precios: { kg: 12880 },
    imagen: "/assets/pimienta-negra.jpg"
  },
  {
    id: 81,
    nombre: "Pimienta Blanca Molida",
    categoria: "Condimentos",
    precios: { kg: 15985, cincoKg: 15410 },
    imagen: "/assets/pimienta-blanca.jpg"
  },
  {
    id: 82,
    nombre: "Ajo En Polvo",
    categoria: "Condimentos",
    precios: { kg: 7820, cincoKg: 7130 },
    imagen: "/assets/ajo-polvo.jpg"
  },
  {
    id: 83,
    nombre: "Aji Puro",
    categoria: "Condimentos",
    precios: { kg: 7360, cincoKg: 6900 },
    imagen: "/assets/aji-puro.jpg"
  },
  {
    id: 84,
    nombre: "Jengibre En Polvo",
    categoria: "Condimentos",
    precios: { kg: 8395, cincoKg: 7935 },
    imagen: "/assets/jengibre.jpg"
  },
  {
    id: 85,
    nombre: "Chimichurri",
    categoria: "Condimentos",
    precios: { kg: 5060, cincoKg: 4577 },
    imagen: "/assets/chimichurri.jpg"
  },
  {
    id: 86,
    nombre: "Nuez Moscada Molida",
    categoria: "Condimentos",
    precios: { kg: 11385, cincoKg: 10580 },
    imagen: "/assets/nuez-moscada.jpg"
  },
  {
    id: 87,
    nombre: "Comino",
    categoria: "Condimentos",
    precios: { kg: 3335 },
    imagen: "/assets/comino.jpg"
  },
  {
    id: 88,
    nombre: "Curcuma",
    categoria: "Condimentos",
    precios: { kg: 3335 },
    imagen: "/assets/curcuma.jpg"
  },
  {
    id: 89,
    nombre: "Anis En Grano",
    categoria: "Condimentos",
    precios: { kg: 17135 },
    imagen: "/assets/anis.jpg"
  },
  {
    id: 90,
    nombre: "Paprika",
    categoria: "Condimentos",
    precios: { kg: 7360, cincoKg: 7130 },
    imagen: "/assets/paprika.jpg"
  },
  {
    id: 91,
    nombre: "Canela En Polvo",
    categoria: "Condimentos",
    precios: { kg: 10580, cincoKg: 10005 },
    imagen: "/assets/canela.jpg"
  },
  {
    id: 92,
    nombre: "Curry",
    categoria: "Condimentos",
    precios: { kg: 6785, cincoKg: 6440 },
    imagen: "/assets/curry.jpg"
  },
  {
    id: 93,
    nombre: "Ajo Triturado",
    categoria: "Condimentos",
    precios: { kg: 11040, cincoKg: 10580 },
    imagen: "/assets/ajo-triturado.jpg"
  },

  // ─── AZÚCARES ───────────────────────────────────────────────────────────────
  {
    id: 94,
    nombre: "Azucar Impalpable",
    categoria: "Azucares",
    precios: { kg: 2185, cincoKg: 1955, diezKg: 1725 },
    imagen: "/assets/azucar-impalpable.jpg"
  },
  {
    id: 95,
    nombre: "Azucar Negra",
    categoria: "Azucares",
    precios: { kg: 2185, cincoKg: 1955, diezKg: 1725 },
    imagen: "/assets/azucar-negra.jpg"
  },
  {
    id: 96,
    nombre: "Azucar Rubia",
    categoria: "Azucares",
    precios: { kg: 2185, cincoKg: 1955, diezKg: 1725 },
    imagen: "/assets/azucar-rubia.jpg"
  },
  {
    id: 97,
    nombre: "Azucar Mascabo",
    categoria: "Azucares",
    precios: { kg: 4600, cincoKg: 3910, diezKg: 3450 },
    imagen: "/assets/azucar-mascabo.jpg"
  },

  // ─── HARINAS ────────────────────────────────────────────────────────────────
  {
    id: 98,
    nombre: "Harina Integral",
    categoria: "Harinas",
    precios: { kg: 1035, cincoKg: 4370, veinticincoKg: 18285 },
    imagen: "/assets/harina-integral.jpg"
  },
  {
    id: 99,
    nombre: "Harina Paraguaya",
    categoria: "Harinas",
    precios: { kg: 1380, cincoKg: 5750 },
    imagen: "/assets/harina-paraguaya.jpg"
  },
  {
    id: 100,
    nombre: "Harina De Soja",
    categoria: "Harinas",
    precios: { kg: 1138, cincoKg: 5060 },
    imagen: "/assets/harina-soja.jpg"
  },
  {
    id: 101,
    nombre: "Harina De Arroz",
    categoria: "Harinas",
    precios: { kg: 1725, cincoKg: 7935 },
    imagen: "/assets/harina-arroz.jpg"
  },
  {
    id: 102,
    nombre: "Harina Glutinada",
    categoria: "Harinas",
    precios: { kg: 862 },
    imagen: "/assets/harina-glutinada.jpg"
  },
  {
    id: 103,
    nombre: "Harina De Garbanzo",
    categoria: "Harinas",
    precios: { kg: 1035, cincoKg: 4600, veinticincoKg: 20125 },
    imagen: "/assets/harina-garbanzo.jpg"
  },
  {
    id: 104,
    nombre: "Harina De Centeno",
    categoria: "Harinas",
    precios: { kg: 1610, cincoKg: 6325 },
    imagen: "/assets/harina-centeno.jpg"
  },
  {
    id: 105,
    nombre: "Harina De Almendras",
    categoria: "Harinas",
    precios: { kg: 4830, cincoKg: 4600, veinticincoKg: 4140 },
    imagen: "/assets/harina-almendras.jpg"
  },
  {
    id: 106,
    nombre: "Harina De Coco",
    categoria: "Harinas",
    precios: { kg: 4715, cincoKg: 4485 },
    imagen: "/assets/harina-coco.jpg"
  },
  {
    id: 107,
    nombre: "Harina De Avena",
    categoria: "Harinas",
    precios: { kg: 2300, cincoKg: 9200 },
    imagen: "/assets/harina-avena.jpg"
  },
  {
    id: 108,
    nombre: "Soja Texturizada",
    categoria: "Harinas",
    precios: { kg: 2530, cincoKg: 9775 },
    imagen: "/assets/soja-texturizada.jpg"
  },
  {
    id: 109,
    nombre: "Salvado De Trigo Fino/Grueso",
    categoria: "Harinas",
    precios: { kg: 1495 },
    imagen: "/assets/salvado-trigo.jpg"
  },
  {
    id: 110,
    nombre: "Semola",
    categoria: "Harinas",
    precios: { kg: 1725, cincoKg: 8050 },
    imagen: "/assets/semola.jpg"
  },
  {
    id: 111,
    nombre: "Semolin",
    categoria: "Harinas",
    precios: { kg: 1725, cincoKg: 6210 },
    imagen: "/assets/semolin.jpg"
  },
  {
    id: 112,
    nombre: "Maizena",
    categoria: "Harinas",
    precios: { kg: 2300, cincoKg: 9430, treintaKg: 44850 },
    imagen: "/assets/maizena.jpg"
  },
  {
    id: 113,
    nombre: "Mandioca",
    categoria: "Harinas",
    precios: { kg: 2760, cincoKg: 11500, treintaKg: 51750 },
    imagen: "/assets/mandioca.jpg"
  },
  {
    id: 114,
    nombre: "Cascarilla",
    categoria: "Harinas",
    precios: { kg: 5635 },
    imagen: "/assets/cascarilla.jpg"
  },

  // ─── SEMILLAS ───────────────────────────────────────────────────────────────
  {
    id: 115,
    nombre: "Semilla Amapola",
    categoria: "Semillas",
    precios: { kg: 15525 },
    imagen: "/assets/semilla-amapola.jpg"
  },
  {
    id: 116,
    nombre: "Semilla Zapallo",
    categoria: "Semillas",
    precios: { kg: 14375, cincoKg: 13800 },
    imagen: "/assets/semilla-zapallo.jpg"
  },
  {
    id: 117,
    nombre: "Semilla De Sesamo Blanco",
    categoria: "Semillas",
    precios: { kg: 8510, veinticincoKg: 35650 },
    imagen: "/assets/sesamo-blanco.jpg"
  },
  {
    id: 118,
    nombre: "Semilla De Sesamo Integral",
    categoria: "Semillas",
    precios: { kg: 4140, veinticincoKg: 18975 },
    imagen: "/assets/sesamo-integral.jpg"
  },
  {
    id: 119,
    nombre: "Semilla De Sesamo Negro",
    categoria: "Semillas",
    precios: { kg: 7935, veinticincoKg: 37375 },
    imagen: "/assets/sesamo-negro.jpg"
  },
  {
    id: 120,
    nombre: "Semilla De Chia",
    categoria: "Semillas",
    precios: { kg: 7820, veinticincoKg: 35650 },
    imagen: "/assets/chia.jpg"
  },
  {
    id: 121,
    nombre: "Semilla De Quinoa",
    categoria: "Semillas",
    precios: { kg: 10580, veinticincoKg: 48300 },
    imagen: "/assets/quinoa.jpg"
  },
  {
    id: 122,
    nombre: "Semilla De Lino",
    categoria: "Semillas",
    precios: { kg: 2300, cincoKg: 10580 },
    imagen: "/assets/lino.jpg"
  },
  {
    id: 123,
    nombre: "Girasol Pelado",
    categoria: "Semillas",
    precios: { kg: 4370, cincoKg: 18400 },
    imagen: "/assets/girasol.jpg"
  },
  {
    id: 124,
    nombre: "Mix De Semillas",
    descripcion: "Girasol, lino, sesamo integral, chia",
    categoria: "Semillas",
    precios: { kg: 3910, cincoKg: 17250, veinticincoKg: 69000 },
    imagen: "/assets/mix-semillas.jpg"
  },

  // ─── SUPLEMENTOS ────────────────────────────────────────────────────────────
  {
    id: 125,
    nombre: "Barritas Proteicas Iron Bar",
    descripcion: "Chocolate, banana, cookies, frutilla, ddl, coco — Caja x20 uni",
    categoria: "Suplementos",
    precios: { kg: 920 },
    imagen: "/assets/iron-bar.jpg"
  },
  {
    id: 126,
    nombre: "Colageno Hidrolizado",
    categoria: "Suplementos",
    precios: { kg: 920, cincoKg: 805 },
    imagen: "/assets/colageno.jpg"
  },
  {
    id: 127,
    nombre: "Harina De Coca",
    categoria: "Suplementos",
    precios: { kg: 920, cincoKg: 805 },
    imagen: "/assets/harina-coca.jpg"
  },
  {
    id: 128,
    nombre: "Cartilago De Tiburon",
    categoria: "Suplementos",
    precios: { kg: 920, cincoKg: 805 },
    imagen: "/assets/cartilago-tiburon.jpg"
  },
  {
    id: 129,
    nombre: "Maca En Polvo",
    descripcion: "x 500 gramos",
    categoria: "Suplementos",
    precios: { kg: 2185, cincoKg: 1955 },
    imagen: "/assets/maca.jpg"
  },
  {
    id: 130,
    nombre: "Aceite De Cannabis",
    descripcion: "30 ml",
    categoria: "Suplementos",
    precios: { kg: 7935, cincoKg: 7475 },
    imagen: "/assets/aceite-cannabis.jpg"
  },
  {
    id: 131,
    nombre: "Flor De Jamaica (Hibiscus)",
    categoria: "Suplementos",
    precios: { kg: 20470, cincoKg: 18630 },
    imagen: "/assets/flor-jamaica.jpg"
  },

  // ─── ACEITES ────────────────────────────────────────────────────────────────
  {
    id: 132,
    nombre: "Aceite De Coco",
    descripcion: "x360ml",
    categoria: "Aceites",
    precios: { kg: 6325, cincoKg: 5980, diezKg: 5405 },
    imagen: "/assets/aceite-coco.jpg"
  },
  {
    id: 133,
    nombre: "Aceite De Oliva x 2LT",
    categoria: "Aceites",
    precios: { kg: 9660, cincoKg: 8970, diezKg: 8280 },
    imagen: "/assets/Aceite De Oliva x 2LT.jfif"
  },
  {
    id: 134,
    nombre: "Aceite De Oliva x 1/2 Vidrio",
    categoria: "Aceites",
    precios: { kg: 5290, cincoKg: 4830 },
    imagen: "/assets/aceite-oliva-vidrio.jpg"
  },
  {
    id: 135,
    nombre: "Aceite De Oregano",
    descripcion: "x30cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 7360, cincoKg: 6785 },
    imagen: "/assets/aceite-oregano.jpg"
  },
  {
    id: 136,
    nombre: "Aceite De Chia",
    descripcion: "x250cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 9430, cincoKg: 8970 },
    imagen: "/assets/aceite-chia.jpg"
  },
  {
    id: 137,
    nombre: "Aceite De Lino",
    descripcion: "x250cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 6670, cincoKg: 6210 },
    imagen: "/assets/aceite-lino.jpg"
  },
  {
    id: 138,
    nombre: "Aceite De Almendra",
    descripcion: "x250cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 8625, cincoKg: 8280 },
    imagen: "/assets/aceite-almendra.jpg"
  },
  {
    id: 139,
    nombre: "Aceite De Jojoba",
    descripcion: "x100cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 6785, cincoKg: 6325 },
    imagen: "/assets/aceite-jojoba.jpg"
  },
  {
    id: 140,
    nombre: "Aceite De Ricino",
    descripcion: "x100cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 5635, cincoKg: 5175 },
    imagen: "/assets/aceite-ricino.jpg"
  },
  {
    id: 141,
    nombre: "Aceite De Palta",
    descripcion: "x250cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 12075, cincoKg: 11270 },
    imagen: "/assets/aceite-palta.jpg"
  },
  {
    id: 142,
    nombre: "Aceite De Coco Virgen",
    descripcion: "x360cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 9890 },
    imagen: "/assets/aceite-coco-virgen.jpg"
  },
  {
    id: 143,
    nombre: "Aceite De Romero",
    descripcion: "x30cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 7130 },
    imagen: "/assets/aceite-romero.jpg"
  },
  {
    id: 144,
    nombre: "Aceite De Rosa Mosqueta",
    descripcion: "x30cc — Bio Nativa",
    categoria: "Aceites",
    precios: { kg: 9430, cincoKg: 8970 },
    imagen: "/assets/aceite-rosa-mosqueta.jpg"
  },
  
];