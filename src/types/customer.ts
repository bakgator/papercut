export type CustomerFormData = {
  companyName: string;
  orgNumber: string;
  vatNumber: string;
  billingAddress: string;
  shippingAddress: string;
  useCustomShipping: boolean;
  email: string;
  phone: string;
  contactPerson: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
};