export interface Question {
  _id: string;
  competency: string; // Can be an ID or object depending on your API
  level: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
