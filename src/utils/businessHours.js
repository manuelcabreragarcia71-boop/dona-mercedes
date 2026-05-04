import { BUSINESS_HOURS } from './constants';

export const isStoreOpen = () => {
  const now = new Date();
  const currentHour = now.getHours();
  
  return BUSINESS_HOURS.some(({ start, end }) => {
    return currentHour >= start && currentHour < end;
  });
};

export const getNextOpeningTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  
  for (const { start, end } of BUSINESS_HOURS) {
    if (currentHour < start) {
      return `${start}:00`;
    }
  }
  
  return `${BUSINESS_HOURS[0].start}:00 (mañana)`;
};

export const getStoreStatus = () => {
  if (isStoreOpen()) {
    return {
      isOpen: true,
      message: '¡Tienda abierta! Realiza tu pedido ahora'
    };
  }
  
  return {
    isOpen: false,
    message: `La tienda está cerrada. Próxima apertura: ${getNextOpeningTime()}`
  };
};
