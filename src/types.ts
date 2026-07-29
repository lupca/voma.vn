export type BusinessType = 'hkd' | 'enterprise';

export interface OrderSimulationItem {
  id: string;
  customerName: string;
  channel: 'Shopee' | 'TikTok Shop' | 'Lazada' | 'POS Retail' | 'Zalo MiniApp';
  productName: string;
  sku: string;
  amount: number;
  taxAmount: number;
  status: 'Received' | 'PIM_Matched' | 'OMS_Routed' | 'WMS_Deducted' | 'Invoice_Issued_TCT';
  invoiceCode?: string;
  timestamp: string;
}

export interface ModuleDetail {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  description: string;
  color: string;
  features: string[];
  metrics: { label: string; value: string }[];
  highlightCode?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  popular?: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  suitableFor: string;
  ctaText: string;
  hkdTiers?: { revenue: string; price: string; note?: string }[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Tax' | 'CRM' | 'WMS' | 'Integration';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  channel: string;
  revenueGain: string;
  taxTimeSaved: string;
}
