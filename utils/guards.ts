
// utils/guards.ts
import { Role } from '../types/models';

export const isWorker = (r?: Role) => r === 'worker';
export const isEmployer = (r?: Role) => r === 'employer';
