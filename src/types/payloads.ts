export interface LoginPayload {
  email: string;
  token: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  role: string;
}

export interface SetupPayload {
  email: string;
}

export interface VerifySetupPayload {
  email: string;
  token: string;
}

export interface ResetPayload {
  email: string
}

// Properties
export interface CreatePropertyPayload {
  title: string;
  description: string;
  city: string;
  areaName: string;
  location: string;
  propertyType: string;
  area: number;
  areaUnit: string;
  price: string;
  images: string[];
  status: string;
}

export interface UpdatePropertyPayload {
  // endPoint: string;
  title: string;
  description: string;
  city: string;
  areaName: string;
  location: string;
  propertyType: string;
  area: number;
  areaUnit: string;
  price: string;
  images: string[];
  status: string;
}

export interface GetAllPropertiesPayload {
  endPoint: string;
}

export interface GetPropertyByIdPayload {
  endPoint: string;
}

export interface DeletePropertyPayload {
  endPoint: string;
}

export interface CreateAboutPayload {
  aboutUs?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    mission?: string;
    since?: string;
    images?: {
      url?: string;
      alt?: string;
    }[];
    highlights?: {
      label?: string;
      value?: string;
    }[];
  };

  // footer?: {
  //   logoUrl?: string;
  //   brandName?: string;
  //   tagline?: string;
  //   rightsText?: string;
  //   madeInLabel?: string;
  //   ctaLabel?: string;
  //   ctaHref?: string;

  //   linkGroups?: {
  //     title?: string;
  //     links?: {
  //       label?: string;
  //       href?: string;
  //     }[];
  //   }[];

  //   contacts?: {
  //     label?: string;
  //     value?: string;
  //   }[];

  //   socials?: {
  //     platform?: string;
  //     href?: string;
  //   }[];
  // };
}

export interface UpdateAboutPayload {
  aboutUs?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    mission?: string;
    since?: string;
    images?: {
      url?: string;
      alt?: string;
    }[];
    highlights?: {
      label?: string;
      value?: string;
    }[];
    qr?: {
      url: string;
      label?: string;
    }[];
  };

  // footer?: {
  //   logoUrl?: string;
  //   brandName?: string;
  //   tagline?: string;
  //   rightsText?: string;
  //   madeInLabel?: string;
  //   ctaLabel?: string;
  //   ctaHref?: string;

  //   linkGroups?: {
  //     title?: string;
  //     links?: {
  //       label?: string;
  //       href?: string;
  //     }[];
  //   }[];

  //   contacts?: {
  //     label?: string;
  //     value?: string;
  //   }[];

  //   socials?: {
  //     platform?: string;
  //     href?: string;
  //   }[];
  // };
}

export interface DeleteAboutPayload {
  endPoint: string;
}
