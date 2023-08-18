import type { ModalOptions, ModalInterface } from "flowbite";

export interface DOMLoadResponseData {
  redirect: true;
  user: {
    firstName: string;
    lastName: string;
    imagePath: string;
  };
}

export interface RequestResponse {
  message: string;
  status: number;
  title: string;
  description: string;
  data: DOMLoadResponseData;
}

export interface Transmutation {
  id?: string;
  name: string;
  lowest: number;
  passing: number;
  highest: number;
  is_default?: boolean;
}

export interface Request {
  token: string;
  data: Transmutation | null;
}

export interface DefaultModalInterface {
  Modal: ModalInterface;
  Element: HTMLDivElement;
  Title?: HTMLHeadingElement;
  Button?: HTMLButtonElement;
  Text?: HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement;
  Inputs?: {
    [key: string]: HTMLInputElement;
  };
  Displays?: {
    [key: string]: HTMLSpanElement | HTMLHeadingElement | HTMLParagraphElement;
  };
}

type AJAXMethods = "GET" | "POST" | "PUT" | "DELETE";
