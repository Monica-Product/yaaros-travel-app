/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DestinationId = 'jaipur' | 'bangalore' | 'hyderabad';

export type TravelCategory =
  | 'Historical Places & Landmarks'
  | 'Must-Visit Attractions'
  | 'Local Food & Cuisine'
  | 'Restaurants & Cafés'
  | 'Cultural Experiences'
  | 'Hidden Gems';

export const TRAVEL_CATEGORIES: TravelCategory[] = [
  'Historical Places & Landmarks',
  'Must-Visit Attractions',
  'Local Food & Cuisine',
  'Restaurants & Cafés',
  'Cultural Experiences',
  'Hidden Gems',
];

export interface TravelRecord {
  id: string;
  name: string;
  destination: string;
  destinationId: DestinationId;
  cityOrLocation: string;
  state: string;
  category: TravelCategory;
  shortDescription: string;
  description: string;
  imageUrl?: string;
  sourceName: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  openingHours?: string;
  visitingHours?: string;
  tagline?: string;
  highlights?: string[];
  location?: string;
  visitorTip?: string;
  historicalSignificance?: string;
  whyVisit?: string;
}

export interface RecommendationItem {
  id?: string;
  name: string;
  destination?: string;
  destinationId?: string;
  cityOrLocation?: string;
  state?: string;
  category: TravelCategory | string;
  tagline: string;
  description: string;
  shortDescription?: string;
  imageUrl?: string;
  highlights: string[];
  visitingHours?: string;
  openingHours?: string;
  location?: string;
  sourceName?: string;
  sourceTitle: string;
  sourcePublisher?: string;
  sourceUrl: string;
  lastVerifiedDate?: string;
  visitorTip?: string;
  firstTimeVisitorTip?: string;
  historicalSignificance?: string;
  whyVisit?: string;
}

export interface CitationItem {
  title: string;
  publisher: string;
  url: string;
  lastVerifiedDate?: string;
  note?: string;
}

export interface CrossDestinationNotice {
  activeDestination: string;
  detectedDestination: string;
  suggestedSwitchId: DestinationId;
  message: string;
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  text: string;
  destinationId?: DestinationId;
  recommendations?: RecommendationItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  destinationId?: DestinationId;
  text: string;
  timestamp: string;
  recommendations?: RecommendationItem[];
  citations?: CitationItem[];
  scopeNotice?: string;
  testScenarioMatched?: string | null;
  crossDestinationNotice?: CrossDestinationNotice;
  status?: 'pending' | 'success' | 'error';
}

export interface DestinationMeta {
  id: DestinationId;
  name: string;
  tagline: string;
  state: string;
  region: string;
  isStateLevel?: boolean;
  subLocations?: string[];
  description: string;
  imageKey: string;
  sampleQuestions: string[];
}

export interface EvaluationScenario {
  id: string;
  title: string;
  targetDestination: DestinationId;
  question: string;
  expectedBehavior: string;
  category: 'grounded_retrieval' | 'cross_destination' | 'unsupported_destination' | 'real_time_limitation' | 'insufficient_info' | 'follow_up_resolution';
}

export interface KnowledgeBaseData {
  destinations: DestinationMeta[];
  records: TravelRecord[];
  scenarios: EvaluationScenario[];
  scope: any;
}
