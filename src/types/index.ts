export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export type ItemStatus = 'LOST' | 'FOUND' | 'RESOLVED';

export interface Item {
  id: number;
  name: string;
  description: string;
  dateLostOrFound: string; // ISO date string
  location: string;
  status: ItemStatus;
  contactInfo?: string;
  reporter?: User;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Request {
  id: number;
  item: Item;
  requester: User;
  requestDate: string; // ISO date string
  status: RequestStatus;
  proofDetails: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
