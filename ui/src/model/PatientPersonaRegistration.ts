import { Profile } from './Profile';

export interface PatientPersonaRegistration extends Profile {
  Condition: string;
  Specialist?: string;
}