import { Profile } from './Profile';

export interface DoctorPersonaRegistration extends Profile {
  Speciality: string;
  BarId?: string;
}