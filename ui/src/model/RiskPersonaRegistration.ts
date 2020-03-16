import { RiskProfileAssessment } from './Enumerations';
import { Address } from './CommonFields';
import { Profile } from './Profile';

export interface RiskPersonaRegistration extends Profile {
  Reasons: RiskProfileAssessment[];
  Address: Address;
  Consents: { [key:string]: boolean }
}