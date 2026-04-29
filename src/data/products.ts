import type { Product } from '../types';

export const products: Product[] = [
  // --- FRUTOS SECOS ---
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
    nombre: "Almendras Guara Nacionales",
    categoria: "Frutos Secos",
    precios: { kg: 21735, cincoKg: 20700, diezKg: 19780 },
    imagen: "/assets/almendras-guara.jpg"
  },
  {
    id: 5,
    nombre: "Almendras Non Pareil Chilenas",
    categoria: "Frutos Secos",
    precios: { kg: 23000, cincoKg: 21850, diezKg: 21275 },
    imagen: "/assets/almendras-chilenas.jpg"
  },
  {
    id: 6,
    nombre: "Castañas De Caju W4",
    categoria: "Frutos Secos",
    precios: { kg: 18975, cincoKg: 18400, diezKg: 17250 },
    imagen: "/assets/caju.jpg"
  },
  {
    id: 7,
    nombre: "Pistacho",
    categoria: "Frutos Secos",
    precios: { kg: 42550, cincoKg: 40250, diezKg: 36800 },
    imagen: "/assets/pistacho.jpg"
  },

  // --- MIXES ---
  {
    id: 8,
    nombre: "Mix Patagonia",
    descripcion: "Arandanos, almendras, caju, nuez",
    categoria: "Mixes",
    precios: { kg: 18975, cincoKg: 18400, diezKg: 17480 },
    imagen: "/assets/mix-patagonia.jpg"
  },
  {
    id: 9,
    nombre: "Mix Frutas Sin Mani",
    descripcion: "Almendra, nuez, pasas, castaña",
    categoria: "Mixes",
    precios: { kg: 14950, cincoKg: 13800, diezKg: 12650 },
    imagen: "/assets/mix-sin-mani.jpg"
  },
  {
    id: 10,
    nombre: "Mix Premium",
    descripcion: "Nuez, castañas, almendras, avellanas",
    categoria: "Mixes",
    precios: { kg: 21275, cincoKg: 20700, diezKg: 20125 },
    imagen: "/assets/mix-premium.jpg"
  },
  {
    id: 11,
    nombre: "Mix Economico",
    descripcion: "Pasas, mani, nuez, almendras",
    categoria: "Mixes",
    precios: { kg: 7130, cincoKg: 6900, diezKg: 6670 },
    imagen: "/assets/mix-economico.jpg"
  },

  // --- CEREALES Y SNACKS ---
  {
    id: 12,
    nombre: "Granola",
    categoria: "Cereales",
    precios: { kg: 4370, cincoKg: 3910, diezKg: 3335 },
    imagen: "/assets/granola.jpg"
  },
  {
    id: 13,
    nombre: "Mani Salado Pelado",
    categoria: "Snacks",
    precios: { kg: 3220, cincoKg: 2875, diezKg: 2645, veinticincoKg: 2530 },
    imagen: "/assets/mani-salado.jpg"
  },
  {
    id: 14,
    nombre: "Maiz Frito Salado",
    categoria: "Snacks",
    precios: { kg: 11385, cincoKg: 10350 },
    imagen: "/assets/maiz-frito.jpg"
  },

  // --- LEGUMBRES ---
  {
    id: 15,
    nombre: "Lenteja",
    categoria: "Legumbres",
    precios: { kg: 2875, cincoKg: 2530 }, // Precio bulto 5kg: $12.650 
    imagen: "/assets/lenteja.jpg"
  },
  {
    id: 16,
    nombre: "Arroz Yamani",
    categoria: "Legumbres",
    precios: { kg: 2530, cincoKg: 1978, treintaKg: 1633 }, // Precios bultos: $9.890 y $48.990 
    imagen: "/assets/arroz-yamani.jpg"
  },
  {
    id: 17,
    nombre: "Garbanzo",
    categoria: "Legumbres",
    precios: { kg: 2530, cincoKg: 2070, treintaKg: 1410 }, // Precios bultos: $10.350 y $42.320 
    imagen: "/assets/garbanzo.jpg"
  },

  // --- OTROS ---
  {
    id: 18,
    nombre: "Aceite De Oliva x 2LT",
    categoria: "Aceites",
    precios: { kg: 9660, cincoKg: 8970, diezKg: 8280 },
    imagen: "/assets/aceite-oliva.jpg"
  },
  {
    id: 19,
    nombre: "Miel Pura X 1KG",
    categoria: "Otros",
    precios: { kg: 4025, cincoKg: 3450 }, // Pack x6: $20.700 [cite: 4]
    imagen: "/assets/miel.jpg"
  }
];