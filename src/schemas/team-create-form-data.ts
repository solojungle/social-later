export interface TeamCreationFormData {
  name: string;
  subscription: {
    currency: string;
    id: string;
    name: string;
    price: number;
    priceFormatted: string;
    priceId: string;
  };
}
