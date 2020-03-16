import { Symptom } from './Enumerations';

/**
 * Identifies a point-in-time sample of a patient's conditions, to evaluate status and actions.
 */
export interface Sample {
  /**
   * List of symptoms the patient is experiencing at the moment.
   */
  Symptoms: Symptom[];

  /**
   * Patient's fever, measured in degrees
   * Each country shall apply their measuring units, and match it in any risk-calculation rules.
   */
  Fever: number;
}