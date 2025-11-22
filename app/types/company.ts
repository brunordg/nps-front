export interface CompanyFormData {
  id?: number;
  document: string;
  name: string;
  subscriptionPlan: SubscriptionPlan | null;
  createdAt?: Date;
  updatedAt?: Date;
  subscription_plan_id: string;
}