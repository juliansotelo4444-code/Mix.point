/**
 * Mapeo de imágenes locales en /assets/ para productos que no poseían una
 * en el archivo original de Google Sheets o que tenían URLs externas.
 */
export const PRODUCT_IMAGE_MAP: Record<number, string> = {
  // Aceites
  138: 'aceite-almendra.jpg',
  140: 'aceite-ricino.jpg',
  143: 'aceite-romero.jpg',

  // Repostería / Condimentos / Snacks / Suplementos
  43: 'chips-chocolate-negro.jpg',
  89: 'anis-en-grano.jpg',
  216: 'hierbabuena.jpg',
  218: 'mirra.jpg',
  220: 'pimienta-negra-granos.jpg',
  222: 'chips-chocolate-blanco.jpg',
  223: 'goma-xantica.jpg',
  224: 'honey-del-amor.jpg',
  225: 'huang-he.jpg',
  226: 'pum-pum.jpg',
  227: 'castanas-de-para.jpg',
  228: 'agar-agar.jpg',
  229: 'pistacho-sin-cascara.jpg',
  230: 'anis-estrellado.jpg',
  231: 'canela-en-rama.jpg',
  350: 'clavo-de-olor.jpg',
  351: 'galletas-arroz-sin-sal.jpg',
  352: 'galletas-arroz-con-sal.jpg',
  353: 'galletas-arroz-dulces.jpg',

  // Herboristería
  159: 'gingko-biloba.jpg',
  160: 'moringa.jpg',
  161: 'rosa-mosqueta.jpg',
  162: 'sen.jpg',
  163: 'cascara-sagrada.jpg',
  164: 'castanas-india.jpg',
  165: 'graviola.jpg',
  166: 'manzanilla.jpg',
  167: 'petalo-rosas.jpg',
  168: 'sandalo.jpg',
  169: 'siempre-viva.jpg',
  170: 'flor-de-tilo.jpg',
  171: 'valeriana.jpg',
  172: 'cedron.jpg',
  173: 'laurel.jpg',
  174: 'hammamelis.jpg',
  175: 'higuera-tintura.jpg',
  176: 'malva.jpg',
  177: 'melisa.jpg',
  178: 'lapacho.jpg',
  179: 'llanten-tintura.jpg',
  180: 'menta.jpg',
  181: 'muna-muna.jpg',
  182: 'ortiga.jpg',
  183: 'salvia.jpg',
  184: 'poleo.jpg',
  185: 'romero-tintura.jpg',
  186: 'peperina.jpg',
  187: 'pasionaria.jpg',
  188: 'te-negro.jpg',
  189: 'te-rojo.jpg',
  190: 'te-verde.jpg',
  191: 'marcela.jpg',
  192: 'pesuna-de-vaca.jpg',
  193: 'rompe-piedra.jpg',
  194: 'rompe-piedra-tintura.jpg',
  195: 'ajenjo.jpg',
  196: 'alcachofa.jpg',
  197: 'amargon.jpg',
  198: 'ambay.jpg',
  199: 'burrito.jpg',
  200: 'boldo.jpg',
  201: 'carqueja.jpg',
  202: 'cola-de-caballo.jpg',
  203: 'cola-de-quirquincho.jpg',
  204: 'chanar-tintura.jpg',
  205: 'calendula.jpg',
  206: 'diente-de-leon-tintura.jpg',
  207: 'espina-colorada.jpg',
  208: 'doradilla.jpg',
  209: 'estigma-de-maiz.jpg',
  210: 'eucalipto.jpg',
  211: 'cardo-mariano.jpg',
  212: 'hisopo.jpg',
  213: 'palo-amarillo.jpg',
  214: 'salvia-blanca.jpg',
  215: 'tilo.jpg',
  217: 'yerba-de-pollo.jpg'
};

/**
 * Retorna la ruta de la imagen asegurando que siempre resuelva
 * a un asset local válido de /assets/.
 */
export function getProductImage(id: number, rawImagen?: string): string {
  const cleanRaw = rawImagen?.trim() ?? '';

  // 1. Si está mapeado localmente a un archivo en public/assets/
  const mapped = PRODUCT_IMAGE_MAP[id];
  if (mapped) {
    return `/assets/${mapped}`;
  }

  // 2. Si ya viene con ruta local /assets/...
  if (cleanRaw.startsWith('/assets/') || cleanRaw.startsWith('assets/')) {
    return cleanRaw.startsWith('/') ? cleanRaw : `/${cleanRaw}`;
  }

  // 3. Si viene con URL externa o texto
  if (cleanRaw) {
    return cleanRaw;
  }

  // 4. Fallback por defecto si no posee imagen
  return '/assets/Flyer-mix-point.png';
}
