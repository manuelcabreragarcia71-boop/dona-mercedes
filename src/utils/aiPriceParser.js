const PRODUCT_KEYWORDS = {
  tomate: ['tomate', 'tomates'],
  manzana: ['manzana', 'manzanas'],
  platano: ['plátano', 'plátanos', 'platano', 'platanos', 'banana', 'bananas'],
  naranja: ['naranja', 'naranjas'],
  lechuga: ['lechuga', 'lechugas'],
  zanahoria: ['zanahoria', 'zanahorias'],
  patata: ['patata', 'patatas', 'papa', 'papas'],
  cebolla: ['cebolla', 'cebollas'],
  pimiento: ['pimiento', 'pimientos'],
  pepino: ['pepino', 'pepinos'],
  calabacin: ['calabacín', 'calabacines', 'calabacin', 'calabacines'],
  berenjena: ['berenjena', 'berenjenas'],
  pera: ['pera', 'peras'],
  uva: ['uva', 'uvas'],
  melon: ['melón', 'melones', 'melon', 'melones'],
  sandia: ['sandía', 'sandías', 'sandia', 'sandias'],
  fresa: ['fresa', 'fresas'],
  cereza: ['cereza', 'cerezas'],
  melocoton: ['melocotón', 'melocotones', 'melocoton', 'melocotones', 'durazno', 'duraznos'],
  limon: ['limón', 'limones', 'limon', 'limones'],
  aguacate: ['aguacate', 'aguacates', 'palta', 'paltas'],
  brocoli: ['brócoli', 'brócolis', 'brocoli', 'brocolis'],
  coliflor: ['coliflor', 'coliflores'],
  espinaca: ['espinaca', 'espinacas'],
  apio: ['apio', 'apios'],
  remolacha: ['remolacha', 'remolachas', 'betabel', 'betabeles'],
  kiwi: ['kiwi', 'kiwis'],
  mango: ['mango', 'mangos'],
  piña: ['piña', 'piñas', 'pina', 'pinas', 'ananá', 'ananás'],
  ciruela: ['ciruela', 'ciruelas'],
  albaricoque: ['albaricoque', 'albaricoques', 'damasco', 'damascos'],
  granada: ['granada', 'granadas'],
  higo: ['higo', 'higos']
};

const PRICE_PATTERNS = [
  /(\d+[.,]\d+)\s*€/,
  /(\d+)\s*€/,
  /(\d+[.,]\d+)\s*euros?/i,
  /(\d+)\s*euros?/i,
  /€\s*(\d+[.,]\d+)/,
  /€\s*(\d+)/,
  /a\s+(\d+[.,]\d+)/i,
  /a\s+(\d+)/i,
  /(\d+[.,]\d+)/,
  /(\d+)/
];

const ACTION_KEYWORDS = {
  set: ['está', 'esta', 'pon', 'poner', 'establecer', 'fijar', 'precio'],
  increase: ['sube', 'subir', 'aumenta', 'aumentar', 'incrementa', 'incrementar'],
  decrease: ['baja', 'bajar', 'reduce', 'reducir', 'disminuye', 'disminuir']
};

export const parseAICommand = (command) => {
  const lowerCommand = command.toLowerCase().trim();
  
  let detectedProduct = null;
  let detectedProductKey = null;
  
  for (const [productKey, keywords] of Object.entries(PRODUCT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerCommand.includes(keyword)) {
        detectedProduct = keyword;
        detectedProductKey = productKey;
        break;
      }
    }
    if (detectedProduct) break;
  }
  
  if (!detectedProduct) {
    return {
      success: false,
      error: 'No se detectó ningún producto válido en el comando'
    };
  }
  
  let detectedPrice = null;
  for (const pattern of PRICE_PATTERNS) {
    const match = lowerCommand.match(pattern);
    if (match) {
      detectedPrice = parseFloat(match[1].replace(',', '.'));
      break;
    }
  }
  
  if (!detectedPrice || isNaN(detectedPrice)) {
    return {
      success: false,
      error: 'No se detectó un precio válido en el comando'
    };
  }
  
  let action = 'set';
  for (const [actionType, keywords] of Object.entries(ACTION_KEYWORDS)) {
    if (keywords.some(keyword => lowerCommand.includes(keyword))) {
      action = actionType;
      break;
    }
  }
  
  return {
    success: true,
    product: detectedProduct,
    productKey: detectedProductKey,
    price: detectedPrice,
    action: action,
    originalCommand: command
  };
};

export const generateAIResponse = (result) => {
  if (!result.success) {
    return result.error;
  }
  
  const actionText = {
    set: 'establecido',
    increase: 'aumentado',
    decrease: 'reducido'
  };
  
  return `✅ Precio ${actionText[result.action]} correctamente: ${result.product} a ${result.price.toFixed(2)}€`;
};

export const applyPriceAction = (currentPrice, newPrice, action) => {
  switch (action) {
    case 'increase':
      return currentPrice + newPrice;
    case 'decrease':
      return Math.max(0, currentPrice - newPrice);
    case 'set':
    default:
      return newPrice;
  }
};
