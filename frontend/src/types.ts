export interface Message {
  id: number;
  message_id: string;
  message_uuid: string;
  received_time_utc: string;
  detector_name: string;
  machine_time_utc: string;
  neutrino_time_utc: string;
  is_test: boolean;
  p_val?: number;
  [key: string]: any;
} 