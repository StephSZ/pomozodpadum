export type ContainerType =
  | "plastic"
  | "paper"
  | "glass"
  | "mixed"
  | "bio"
  | "metal"
  | "hazardous"
  | "electro"
  | "carton";

export interface WasteItem {
  id: string;
  name: string;
  description: string;
  containers: ContainerType[];
  primaryContainer: ContainerType;
  imageUrl: string;
  composition: string;
  disposalInstructions: string;
  decompositionTime: string;
  funFact: string;
  labelInfo?: string;
  isHazardous: boolean;
  similarWasteIds: string[];
  scannedAt: string;
  userCorrected: boolean;
}

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  emoji: string;
  source?: string;
}

export interface UserCorrection {
  wasteId: string;
  correctedName?: string;
  correctedContainer?: ContainerType;
  note?: string;
  submittedAt: string;
}

export interface AnalyzeRequest {
  image: string;
}

export interface AnalyzeResponse {
  success: boolean;
  waste?: WasteItem;
  error?: string;
}
