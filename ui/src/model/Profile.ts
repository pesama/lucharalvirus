import { AppPersona } from './Enumerations';


export interface Profile {
  ProfileId?: string;
  Persona?: AppPersona;
  Name: string;
  PhoneNumber: string;
}