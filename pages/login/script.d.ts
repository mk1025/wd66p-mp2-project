export interface DOMLoadResponse {
  message: string;
  status: number;
  title: string;
  description: string;
  data: {
    redirect: boolean;
    user: {
      firstName: string;
      lastName: string;
      imagePath: string;
    };
  };
}

export interface LoginResponse {
  message: string;
  status: number;
  title: string;
  description: string;
  data: {
    token?: string;
    redirect?: boolean;
  };
}
