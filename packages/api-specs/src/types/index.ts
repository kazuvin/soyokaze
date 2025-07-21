export interface RequestConfig extends RequestInit {
  url: string;
  params?: Record<string, any>;
  data?: any;
}