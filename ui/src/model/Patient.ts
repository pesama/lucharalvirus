
/**
 * Identifies a user, and provides characteristics and previous conditions that may affect the risk profile
 */
export interface Patient {

  /**
   * Unique ID identifying the user. 
   * This id is the same as generated by the auth system, to guarantee granular permissions.
   */
  PatientUID: string;

  /**
   * Name of the user
   */
  Name: string;

  /**
   * Patient's date of birth.
   * This data is used, among others, to calculate a risk profile
   */
  BirthDate: string;

  /**
   * Patient's email (Optional)
   * Used to contact the patient if neccessary
   */
  Email?: string;

  /**
   * Patient's phone number
   * Used to contact the patient.
   */
  PhoneNumber: string;

  /**
   * Users current location (city)
   */
  City: string;

  /**
   * List of previous - relevant - affections - e.g. respiratory, cardiac. 
   * Used to calculate the risk profile
   */
  PreviousAffections: string[];

  /**
   * Date when the patient registered the first time in the system.
   */
  RegistrationDate: string;
}