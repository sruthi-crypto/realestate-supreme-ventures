export interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  twoFactorSecret: string;
  twoFactorEnabled: boolean;
  created_at: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
    token: string;
  };
}

export interface SetupResponse {
  success: boolean;
  message: string;
  data: {
    qrCode?: string;
    otpauth_url?: string;
    secret: string;
    email?: string;
    user?: UserData;
  }
}

export interface VerifySetupResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
    token: string;
  }
}

// Users
export interface GetAllUsersResponse {
  success: boolean;
  data: UserData[];
}

// Property Responses
export interface PropertyData {
  id: string;
  title: string;
  description: string;
  city: string;
  areaName: string;
  location: string;
  propertyType: string;
  area: number;
  areaUnit: string;
  price: number | string;
  images: string[];
  status: string;
  updatedAt?: string;
  createdAt?: string;
  updatedat?: string;
  createdat?: string;
}

export interface CreatePropertyResponse {
  success: boolean;
  data: PropertyData;
}

export interface UpdatePropertyResponse {
  success: boolean;
  data: PropertyData;
}

export interface GetAllPropertiesResponse {
  success: boolean;
  data: PropertyData[];
}

export interface GetPropertyByIdResponse {
  success: boolean;
  message?: string;
  data: PropertyData | PropertyData[];
}

export interface DeletePropertyResponse {
  success: boolean;
}

// Upload Images
export interface UploadImagesResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
    resourceType: string;
    originalName: string;
  }[];
}

// About Responses
export interface GetAboutResponse {
  success: boolean,
  message: string,
  data: {
    id: string,
    key: string,
    aboutUs: {
      since: string,
      title: string,
      images: {
        alt: string,
        url: string
      }[],
      eyebrow: string,
      mission: string,
      highlights: {
        label: string,
        value: string
      }[],
      description: string,
      qr?: {
        url: string;
        label?: string;
      }[];
    },
    footer: { [key: string]: string },
  }[],
}

export interface CreateAboutResponse {
  success: boolean;
}

export interface UpdateAboutResponse {
  success: boolean;
}

export interface DeleteAboutResponse {
  success: boolean;
}
