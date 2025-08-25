// types/models.ts
export type Role = 'worker' | 'employer';

export interface UserDoc {
  $id: string;
  name: string;
  role: Role;
  phone?: string;
  verified?: boolean;
  rating?: number;        // average rating
  ratingsCount?: number;  // number of ratings
  availability?: string;  // e.g., 'Available', 'Busy', 'On Leave'
}

export interface JobDoc {
  $id: string;
  title: string;
  role?: string;
  location?: string;
  pay?: number;
  description?: string;
  postedBy: string; // userId
  createdAt: string;
  tags?: string[];
  status: 'open' | 'closed';
}

export interface ApplicationDoc {
  $id: string;
  jobId: string;
  workerId: string;
  coverNote?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ReviewDoc {
  $id: string;
  workerId: string;
  employerId: string;
  rating: number; // 1..5
  comment: string;
  verified: boolean;
  createdAt: string;
}
