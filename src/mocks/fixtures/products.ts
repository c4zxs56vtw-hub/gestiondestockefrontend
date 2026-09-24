import type { Product } from '@/shared/domain/models'

function stock(qty: number, min: number): Product['stockStatus'] {
  if (qty === 0) return 'OUT_OF_STOCK'
  if (qty <= min) return 'LOW_STOCK'
  return 'IN_STOCK'
}

const now = '2026-09-23T12:00:00Z'

export const PRODUCTS_FIXTURE: Product[] = [
  // ── Informatique (cat 1) ──────────────────────────────────────────────────
  {
    id: 1, sku: 'PC-DELL-5520', name: 'Laptop Dell Latitude 5520', description: 'Core i5 11e gen, 16 Go RAM, 512 Go SSD',
    category: { id: 1, name: 'Informatique' }, supplier: { id: 1, name: 'Tech Cameroun SARL' },
    unit: 'PIECE', purchasePrice: '680000', salePrice: '850000',
    quantityInStock: 12, minimumStock: 5, status: 'ACTIVE', stockStatus: stock(12, 5), stockVersion: 8,
    createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-09-10T10:00:00Z',
  },
  {
    id: 2, sku: 'PC-HP-PROBB', name: 'HP ProBook 450 G9', description: 'Core i7, 8 Go RAM, 256 Go SSD',
    category: { id: 1, name: 'Informatique' }, supplier: { id: 1, name: 'Tech Cameroun SARL' },
    unit: 'PIECE', purchasePrice: '520000', salePrice: '650000',
    quantityInStock: 4, minimumStock: 5, status: 'ACTIVE', stockStatus: stock(4, 5), stockVersion: 12,
    createdAt: '2026-02-05T09:00:00Z', updatedAt: '2026-09-15T08:00:00Z',
  },
  {
    id: 3, sku: 'PC-LENOVO-T14', name: 'Lenovo ThinkPad T14', description: 'AMD Ryzen 5, 16 Go RAM, 512 Go SSD',
    category: { id: 1, name: 'Informatique' }, supplier: { id: 2, name: 'Afrique Informatique' },
    unit: 'PIECE', purchasePrice: '620000', salePrice: '790000',
    quantityInStock: 7, minimumStock: 3, status: 'ACTIVE', stockStatus: stock(7, 3), stockVersion: 5,
    createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-08-20T11:00:00Z',
  },
  {
    id: 4, sku: 'SERV-DELL-T150', name: 'Serveur Dell PowerEdge T150', description: 'Xeon E-2336, 32 Go ECC RAM',
    category: { id: 1, name: 'Informatique' }, supplier: { id: 3, name: 'Douala Tech Import' },
    unit: 'PIECE', purchasePrice: '1850000', salePrice: '2300000',
    quantityInStock: 2, minimumStock: 1, status: 'ACTIVE', stockStatus: stock(2, 1), stockVersion: 3,
    createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-07-15T09:00:00Z',
  },
  {
    id: 5, sku: 'PC-ASUS-VIVOBOOK', name: 'ASUS VivoBook 15', description: 'Intel Core i3, 8 Go RAM, 256 Go SSD',
    category: { id: 1, name: 'Informatique' }, supplier: { id: 2, name: 'Afrique Informatique' },
    unit: 'PIECE', purchasePrice: '280000', salePrice: '360000',
    quantityInStock: 0, minimumStock: 3, status: 'ACTIVE', stockStatus: stock(0, 3), stockVersion: 6,
    createdAt: '2026-03-10T09:00:00Z', updatedAt: '2026-09-20T14:00:00Z',
  },
  {
    id: 6, sku: 'PC-MAC-M3', name: 'MacBook Air M3 13"', description: 'Apple M3, 16 Go RAM, 512 Go SSD, Minuit',
    category: { id: 1, name: 'Informatique' }, supplier: { id: 1, name: 'Tech Cameroun SARL' },
    unit: 'PIECE', purchasePrice: '1100000', salePrice: '1380000',
    quantityInStock: 6, minimumStock: 2, status: 'ACTIVE', stockStatus: stock(6, 2), stockVersion: 4,
    createdAt: '2026-04-01T09:00:00Z', updatedAt: '2026-09-01T10:00:00Z',
  },
  // ── Périphériques (cat 2) ─────────────────────────────────────────────────
  {
    id: 7, sku: 'KB-MECH-K2', name: 'Clavier mécanique Keychron K2', description: 'Switch Brown, rétroéclairage RGB',
    category: { id: 2, name: 'Périphériques' }, supplier: { id: 1, name: 'Tech Cameroun SARL' },
    unit: 'PIECE', purchasePrice: '45000', salePrice: '65000',
    quantityInStock: 148, minimumStock: 50, status: 'ACTIVE', stockStatus: stock(148, 50), stockVersion: 15,
    createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-09-10T09:00:00Z',
  },
  {
    id: 8, sku: 'MS-LOG-MX', name: 'Souris sans fil Logitech MX Master 3', description: 'Ergonomique, DPI ajustable 200-8000',
    category: { id: 2, name: 'Périphériques' }, supplier: { id: 1, name: 'Tech Cameroun SARL' },
    unit: 'PIECE', purchasePrice: '38000', salePrice: '55000',
    quantityInStock: 36, minimumStock: 40, status: 'ACTIVE', stockStatus: stock(36, 40), stockVersion: 22,
    createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-09-18T14:00:00Z',
  },
  {
    id: 9, sku: 'CAM-LOG-C920', name: 'Webcam Logitech C920 Full HD', description: '1080p, autofocus, microphone intégré',
    category: { id: 2, name: 'Périphériques' }, supplier: { id: 1, name: 'Tech Cameroun SARL' },
    unit: 'PIECE', purchasePrice: '42000', salePrice: '60000',
    quantityInStock: 67, minimumStock: 25, status: 'ACTIVE', stockStatus: stock(67, 25), stockVersion: 10,
    createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-08-30T11:00:00Z',
  },
  {
    id: 10, sku: 'HEAD-SONY-WH', name: 'Casque Sony WH-1000XM5', description: 'ANC, 30h autonomie, Bluetooth 5.2',
    category: { id: 2, name: 'Périphériques' }, supplier: { id: 2, name: 'Afrique Informatique' },
    unit: 'PIECE', purchasePrice: '95000', salePrice: '135000',
    quantityInStock: 0, minimumStock: 10, status: 'ACTIVE', stockStatus: stock(0, 10), stockVersion: 7,
    createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-09-22T08:00:00Z',
  },
  {
    id: 11, sku: 'KB-LOGITECH-K120', name: 'Clavier Logitech K120 USB', description: 'Clavier filaire AZERTY basique',
    category: { id: 2, name: 'Périphériques' }, supplier: { id: 4, name: 'Bureau Center Yaoundé' },
    unit: 'PIECE', purchasePrice: '8500', salePrice: '13000',
    quantityInStock: 85, minimumStock: 30, status: 'ACTIVE', stockStatus: stock(85, 30), stockVersion: 6,
    createdAt: '2026-03-15T10:00:00Z', updatedAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 12, sku: 'DK-USB-C-PRO', name: 'Station USB-C Pro 12 ports', description: 'HDMI 4K, Ethernet, USB-A x4, SD',
    category: { id: 2, name: 'Périphériques' }, supplier: { id: 3, name: 'Douala Tech Import' },
    unit: 'PIECE', purchasePrice: '75000', salePrice: '105000',
    quantityInStock: 3, minimumStock: 8, status: 'ACTIVE', stockStatus: stock(3, 8), stockVersion: 9,
    createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-09-20T16:00:00Z',
  },
  // ── Téléphonie (cat 3) ────────────────────────────────────────────────────
  {
    id: 13, sku: 'PH-SAMSUNG-S24', name: 'Samsung Galaxy S24', description: '256 Go, 8 Go RAM, 5G, Noir Phantom',
    category: { id: 3, name: 'Téléphonie' }, supplier: { id: 2, name: 'Afrique Informatique' },
    unit: 'PIECE', purchasePrice: '420000', salePrice: '540000',
    quantityInStock: 18, minimumStock: 8, status: 'ACTIVE', stockStatus: stock(18, 8), stockVersion: 11,
    createdAt: '2026-03-01T11:00:00Z', updatedAt: '2026-09-12T10:00:00Z',
  },
  {
    id: 14, sku: 'PH-IPHONE-15', name: 'iPhone 15 128 Go', description: 'Dynamic Island, USB-C, Noir',
    category: { id: 3, name: 'Téléphonie' }, supplier: { id: 1, name: 'Tech Cameroun SARL' },
    unit: 'PIECE', purchasePrice: '580000', salePrice: '720000',
    quantityInStock: 9, minimumStock: 5, status: 'ACTIVE', stockStatus: stock(9, 5), stockVersion: 14,
    createdAt: '2026-03-15T11:00:00Z', updatedAt: '2026-09-18T11:00:00Z',
  },
  {
    id: 15, sku: 'TAB-SAMSUNG-A9', name: 'Tablette Samsung Galaxy Tab A9', description: '64 Go, 8" LCD, WiFi + 4G',
    category: { id: 3, name: 'Téléphonie' }, supplier: { id: 2, name: 'Afrique Informatique' },
    unit: 'PIECE', purchasePrice: '145000', salePrice: '185000',
    quantityInStock: 5, minimumStock: 5, status: 'ACTIVE', stockStatus: stock(5, 5), stockVersion: 4,
    createdAt: '2026-04-01T11:00:00Z', updatedAt: '2026-08-15T12:00:00Z',
  },
  {
    id: 16, sku: 'ACC-CHARGE-65W', name: 'Chargeur rapide 65W USB-C', description: 'GaN, compatible Samsung/Apple/PC',
    category: { id: 3, name: 'Téléphonie' }, supplier: { id: 3, name: 'Douala Tech Import' },
    unit: 'PIECE', purchasePrice: '12000', salePrice: '18000',
    quantityInStock: 120, minimumStock: 40, status: 'ACTIVE', stockStatus: stock(120, 40), stockVersion: 8,
    createdAt: '2026-04-15T11:00:00Z', updatedAt: '2026-09-05T09:00:00Z',
  },
  {
    id: 17, sku: 'PH-TRANSS-SPARK', name: 'Tecno Spark 20 Pro', description: '256 Go, 8 Go RAM, Double SIM 4G',
    category: { id: 3, name: 'Téléphonie' }, supplier: { id: 5, name: 'MultiMedia Pro' },
    unit: 'PIECE', purchasePrice: '95000', salePrice: '125000',
    quantityInStock: 22, minimumStock: 10, status: 'ACTIVE', stockStatus: stock(22, 10), stockVersion: 6,
    createdAt: '2026-05-01T11:00:00Z', updatedAt: '2026-09-10T10:00:00Z',
  },
  // ── Bureau (cat 4) ────────────────────────────────────────────────────────
  {
    id: 18, sku: 'PRINT-HP-107W', name: 'Imprimante HP DeskJet 2720e', description: 'Wifi, impression recto-verso',
    category: { id: 4, name: 'Bureau' }, supplier: { id: 4, name: 'Bureau Center Yaoundé' },
    unit: 'PIECE', purchasePrice: '42000', salePrice: '58000',
    quantityInStock: 14, minimumStock: 5, status: 'ACTIVE', stockStatus: stock(14, 5), stockVersion: 3,
    createdAt: '2026-03-01T12:00:00Z', updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 19, sku: 'PAPER-A4-80G', name: 'Ramette papier A4 80g', description: 'Paquet de 500 feuilles blanc',
    category: { id: 4, name: 'Bureau' }, supplier: { id: 4, name: 'Bureau Center Yaoundé' },
    unit: 'BOX', purchasePrice: '3500', salePrice: '5000',
    quantityInStock: 8, minimumStock: 20, status: 'ACTIVE', stockStatus: stock(8, 20), stockVersion: 45,
    createdAt: '2026-02-01T12:00:00Z', updatedAt: '2026-09-22T09:00:00Z',
  },
  {
    id: 20, sku: 'CHAIR-ERGO-PRO', name: 'Chaise ergonomique ProOffice', description: 'Accoudoirs réglables, lombaires ajustables',
    category: { id: 4, name: 'Bureau' }, supplier: { id: 4, name: 'Bureau Center Yaoundé' },
    unit: 'PIECE', purchasePrice: '95000', salePrice: '130000',
    quantityInStock: 6, minimumStock: 2, status: 'ACTIVE', stockStatus: stock(6, 2), stockVersion: 2,
    createdAt: '2026-03-15T12:00:00Z', updatedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 21, sku: 'DESK-HEIGHT-ADJ', name: 'Bureau assis-debout électrique', description: 'Plateau 140x70cm, mémoire 3 positions',
    category: { id: 4, name: 'Bureau' }, supplier: { id: 4, name: 'Bureau Center Yaoundé' },
    unit: 'PIECE', purchasePrice: '280000', salePrice: '365000',
    quantityInStock: 3, minimumStock: 1, status: 'ACTIVE', stockStatus: stock(3, 1), stockVersion: 1,
    createdAt: '2026-04-01T12:00:00Z', updatedAt: '2026-04-15T10:00:00Z',
  },
  {
    id: 22, sku: 'PRINT-LASER-M26', name: 'Imprimante laser Canon LBP6030', description: 'Monochrome, 18 ppm, USB',
    category: { id: 4, name: 'Bureau' }, supplier: { id: 4, name: 'Bureau Center Yaoundé' },
    unit: 'PIECE', purchasePrice: '75000', salePrice: '98000',
    quantityInStock: 0, minimumStock: 2, status: 'ARCHIVED', stockStatus: stock(0, 2), stockVersion: 4,
    createdAt: '2026-02-01T12:00:00Z', updatedAt: '2026-08-15T10:00:00Z',
  },
  // ── Électronique (cat 5) ──────────────────────────────────────────────────
  {
    id: 23, sku: 'MON-DELL-27QHD', name: 'Écran Dell 27" QHD IPS', description: '2560x1440, 75 Hz, HDMI DisplayPort USB-C',
    category: { id: 5, name: 'Électronique' }, supplier: { id: 3, name: 'Douala Tech Import' },
    unit: 'PIECE', purchasePrice: '240000', salePrice: '310000',
    quantityInStock: 24, minimumStock: 8, status: 'ACTIVE', stockStatus: stock(24, 8), stockVersion: 7,
    createdAt: '2026-02-15T13:00:00Z', updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 24, sku: 'UPS-APC-650', name: 'Onduleur APC 650 VA', description: '650 VA / 400 W, 4 prises, USB',
    category: { id: 5, name: 'Électronique' }, supplier: { id: 3, name: 'Douala Tech Import' },
    unit: 'PIECE', purchasePrice: '55000', salePrice: '78000',
    quantityInStock: 16, minimumStock: 5, status: 'ACTIVE', stockStatus: stock(16, 5), stockVersion: 5,
    createdAt: '2026-03-01T13:00:00Z', updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 25, sku: 'CABLE-HDMI-2M', name: 'Câble HDMI 2.0 2m', description: 'Certifié 4K@60Hz, plaqué or',
    category: { id: 5, name: 'Électronique' }, supplier: { id: 3, name: 'Douala Tech Import' },
    unit: 'PIECE', purchasePrice: '3500', salePrice: '6000',
    quantityInStock: 200, minimumStock: 50, status: 'ACTIVE', stockStatus: stock(200, 50), stockVersion: 12,
    createdAt: '2026-02-01T13:00:00Z', updatedAt: '2026-09-10T09:00:00Z',
  },
  {
    id: 26, sku: 'MON-LG-24FHD', name: 'Écran LG 24" FHD IPS', description: '1920x1080, 75 Hz, freesync',
    category: { id: 5, name: 'Électronique' }, supplier: { id: 5, name: 'MultiMedia Pro' },
    unit: 'PIECE', purchasePrice: '130000', salePrice: '165000',
    quantityInStock: 11, minimumStock: 5, status: 'ACTIVE', stockStatus: stock(11, 5), stockVersion: 9,
    createdAt: '2026-04-01T13:00:00Z', updatedAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 27, sku: 'SWITCH-TP-8P', name: 'Switch réseau TP-Link 8 ports', description: '8 ports Gigabit non-manageable',
    category: { id: 5, name: 'Électronique' }, supplier: { id: 3, name: 'Douala Tech Import' },
    unit: 'PIECE', purchasePrice: '22000', salePrice: '32000',
    quantityInStock: 7, minimumStock: 3, status: 'ACTIVE', stockStatus: stock(7, 3), stockVersion: 4,
    createdAt: '2026-05-01T13:00:00Z', updatedAt: '2026-08-10T10:00:00Z',
  },
  // ── Consommables (cat 6) ──────────────────────────────────────────────────
  {
    id: 28, sku: 'TONER-HP-85A', name: 'Toner HP CE285A (85A)', description: 'Cartouche noire, 1600 pages',
    category: { id: 6, name: 'Consommables' }, supplier: { id: 4, name: 'Bureau Center Yaoundé' },
    unit: 'PIECE', purchasePrice: '28000', salePrice: '38000',
    quantityInStock: 3, minimumStock: 8, status: 'ACTIVE', stockStatus: stock(3, 8), stockVersion: 18,
    createdAt: '2026-02-01T14:00:00Z', updatedAt: '2026-09-20T11:00:00Z',
  },
  {
    id: 29, sku: 'USB-SANDISK-64', name: 'Clé USB SanDisk 64 Go USB 3.0', description: 'Lecture 100 Mo/s, garantie 5 ans',
    category: { id: 6, name: 'Consommables' }, supplier: { id: 5, name: 'MultiMedia Pro' },
    unit: 'PIECE', purchasePrice: '5000', salePrice: '8500',
    quantityInStock: 150, minimumStock: 30, status: 'ACTIVE', stockStatus: stock(150, 30), stockVersion: 20,
    createdAt: '2026-02-01T14:00:00Z', updatedAt: '2026-09-15T09:00:00Z',
  },
  {
    id: 30, sku: 'INK-CANON-PG545', name: 'Cartouche Canon PG-545 noire', description: 'Pour PIXMA MG2550/MG2555',
    category: { id: 6, name: 'Consommables' }, supplier: { id: 4, name: 'Bureau Center Yaoundé' },
    unit: 'PIECE', purchasePrice: '8500', salePrice: '13000',
    quantityInStock: 0, minimumStock: 5, status: 'ACTIVE', stockStatus: stock(0, 5), stockVersion: 9,
    createdAt: '2026-03-01T14:00:00Z', updatedAt: '2026-09-22T10:00:00Z',
  },
]
