import type { Supplier } from '@/shared/domain/models'

export const SUPPLIERS_FIXTURE: Supplier[] = [
  {
    id: 1, name: 'Tech Cameroun SARL',
    contactName: 'Paul Mbarga', email: 'contact@techcameroun.cm', phone: '+237 655 123 456',
    address: 'Rue de la Réunification, Douala, Cameroun',
    createdAt: '2026-01-20T09:00:00Z', updatedAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 2, name: 'Afrique Informatique',
    contactName: 'Marie Nkolo', email: 'marie@afriqueinformatique.cm', phone: '+237 677 234 567',
    address: 'Avenue Charles de Gaulle, Yaoundé, Cameroun',
    createdAt: '2026-01-22T10:00:00Z', updatedAt: '2026-01-22T10:00:00Z',
  },
  {
    id: 3, name: 'Douala Tech Import',
    contactName: 'Jean-Pierre Essama', email: 'jp@doualatech.cm', phone: '+237 690 345 678',
    address: 'Zone Industrielle de Bassa, Douala, Cameroun',
    createdAt: '2026-01-25T11:00:00Z', updatedAt: '2026-01-25T11:00:00Z',
  },
  {
    id: 4, name: 'Bureau Center Yaoundé',
    contactName: null, email: 'commandes@bureaucenter.cm', phone: '+237 222 456 789',
    address: 'Boulevard du 20 Mai, Yaoundé, Cameroun',
    createdAt: '2026-02-01T08:00:00Z', updatedAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 5, name: 'MultiMedia Pro',
    contactName: 'Amara Diallo', email: null, phone: '+237 699 567 890',
    address: 'Quartier Akwa, Douala, Cameroun',
    createdAt: '2026-02-05T09:00:00Z', updatedAt: '2026-02-05T09:00:00Z',
  },
]
