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

export interface ContainerInfo {
  type: ContainerType;
  name: string;
  color: string;
  emoji: string;
  description: string;
  belongs: string[];
  doesNotBelong: string[];
  tip: string;
}

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

export type TipType = "daily" | "seasonal";

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface TipResponse extends DailyTip {
  type: TipType;
  season: Season | null;
  aiGenerated: boolean;
}

export interface SeasonalTipsResponse {
  season: Season;
  aiGenerated: boolean;
  tips: TipResponse[];
}

export interface UserCorrection {
  id?: string;
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

export type WasteCatalogCategory =
  | "plasty"
  | "papír"
  | "sklo"
  | "kovy"
  | "nápojové kartony"
  | "další odpady";

export interface WasteCatalogItem {
  id: string;
  name: string;
  letter: string;
  categories: WasteCatalogCategory[];
  description: string;
  tip?: string;
}

export interface WasteCatalogResponse {
  items: WasteCatalogItem[];
  total: number;
  letters: string[];
  categories: WasteCatalogCategory[];
}
