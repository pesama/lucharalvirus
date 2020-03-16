import { AppPersona } from './Enumerations';


export interface Profile {
  ProfileId?: string;
  UserId?: string;
  Persona: AppPersona;
  CreationDate: string;
}