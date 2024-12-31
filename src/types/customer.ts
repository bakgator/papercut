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

export type Customer = {
  id: string;
  user_id: string;
  company_name: string;
  email: string | null;
  phone: string | null;
  billing_address: string | null;
  shipping_address: string | null;
  org_number: string | null;
  vat_number: string | null;
  contact_person_name: string | null;
  contact_person_position: string | null;
  contact_person_email: string | null;
  contact_person_phone: string | null;
  created_at: string;
  updated_at: string;
};