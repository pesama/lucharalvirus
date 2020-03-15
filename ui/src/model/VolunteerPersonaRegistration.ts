import { Address } from './CommonFields';
import { Profile } from './Profile';

export interface VolunteerPersonaRegistration extends Profile {
  Acknowledgements: { [key: string]: boolean };
  Address: Address;
}