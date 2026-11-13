import heroImage from '../assets/images/conecta_hero_workshop_1793978783424.jpg';
import displayImage from '../assets/images/cat_display_screens_1793978783447.jpg';
import batteryImage from '../assets/images/cat_battery_power_1793978784019.jpg';
import dockImage from '../assets/images/cat_charging_docks_1793978784250.jpg';

export const HERO_IMAGE = heroImage;

export interface CategoryInfo {
  name: string;
  image?: string;
  iconName: string;
  badge: string;
  shortDesc: string;
}

export const CATEGORY_METADATA: Record<string, CategoryInfo> = {
  'Telas & Displays': {
    name: 'Telas & Displays',
    image: displayImage,
    iconName: 'Smartphone',
    badge: '1.280+ modelos',
    shortDesc: 'Módulos frontais com e sem aro, Incell, OLED e JK com alta sensibilidade ao toque.'
  },
  'Baterias': {
    name: 'Baterias',
    image: batteryImage,
    iconName: 'BatteryCharging',
    badge: 'Foxconn & Premium',
    shortDesc: 'Células de alta densidade e durabilidade calibrada com proteção contra superaquecimento.'
  },
  'Placas de Carga (Dock)': {
    name: 'Placas de Carga (Dock)',
    image: dockImage,
    iconName: 'Cpu',
    badge: 'Turbo Fast & Mic',
    shortDesc: 'Subplacas de conector Type-C e V8 com CI de carga rápida e microfones integrados.'
  },
  'Tampas Traseiras': {
    name: 'Tampas Traseiras',
    iconName: 'Shield',
    badge: 'Vidro & Policarbonato',
    shortDesc: 'Tampas com acabamento idêntico ao original, encaixe exato e lentes instaladas.'
  },
  'Flex & Cabos': {
    name: 'Flex & Cabos',
    iconName: 'GitBranch',
    badge: 'Placa-Mãe & LCD',
    shortDesc: 'Cabos flat condutores de sinal de vídeo, placa de carga, botoeiras e sensores.'
  },
  'Câmeras & Lentes': {
    name: 'Câmeras & Lentes',
    iconName: 'Camera',
    badge: 'Frontal & Traseira',
    shortDesc: 'Módulos de câmera com foco rápido e lentes protetoras de vidro temperado.'
  },
  'Alto-falantes & Som': {
    name: 'Alto-falantes & Som',
    iconName: 'Volume2',
    badge: 'Buzzer & Auricular',
    shortDesc: 'Campainhas de viva-voz e alto-falantes auriculares com áudio limpo sem ruídos.'
  },
  'Gavetas & Componentes': {
    name: 'Gavetas & Componentes',
    iconName: 'Layers',
    badge: 'SIM Tray & Botões',
    shortDesc: 'Gavetas de chip dual-SIM com vedação de borracha, botões power/volume e biometrias.'
  }
};
