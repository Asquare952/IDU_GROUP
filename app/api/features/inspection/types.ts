export type CreateInspection = {
  rental_id: string;
  date: string;
  time: string;
};

export type Inspections = {
  id: string;
  user_id: string;
  rental_id: string;
  date: string;
  time: string;
  is_paid: boolean;
  rental: {
    id: string;
    slug: string;
    title: string;
    location: string;
    price: number;
    priceType: string;
    images: string[];
    status: string;
    User: {
      id: string;
      full_name: string;
      phone_no: string;
      first_name: string;
      last_name: string;
      Profile: {
        image: string;
        verified: boolean;
      };
    };
  };
};

export interface InspectionResponse {
  success: boolean;
  message: string;
  data: Inspections[];
}

export interface SingleInspectionResponse {
  success: boolean;
  message: string;
  data: Inspections;
}

export type UpdateInspection = {
  date: string;
  time: string;
};
