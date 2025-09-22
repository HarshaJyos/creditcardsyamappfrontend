import { Types } from "mongoose";

export interface ICreditCard {
  _id?: Types.ObjectId;
  name: string;
  bankPartnerId: Types.ObjectId;
  description: string;
  annualFee: number;
  rewards: {
    cashback?: number;
    pointsMultiplier?: {
      travel: number;
      dining: number;
      shopping: number;
      groceries: number;
      other: number;
    };
    miles?: boolean;
  };
  apr: number;
  introOffer?: string;
  creditScoreRequired: number;
  imageUrl?: string;
  applyUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBankPartner {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  contactEmail?: string;
  apiEndpoint?: string;
  apiKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomer {
  _id?: Types.ObjectId;
  firebaseUid: string;
  email: string;
  firstName: string;
  lastName: string;
  survey?: ISurvey;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface ISurvey {
  annualIncome: number;
  creditScore: number;
  spendingHabits: {
    travel: number;
    dining: number;
    shopping: number;
    groceries: number;
    other: number;
  };
  preferredRewards: string[];
  currentCards: string[];
}

export interface IApplication {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  cardId: Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  appliedAt: Date;
  updatedAt: Date;
}

export interface INotification {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
