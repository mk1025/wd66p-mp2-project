import type { ModalOptions, ModalInterface } from "flowbite";

export interface RequestResponse {
  status: number;
  message: string;
  title: string;
  description: string;
  data: ClassRecord[];
}

export interface DOMLoadResponseData {
  redirect: boolean;
  user: {
    firstName: string;
    lastName: string;
    imagePath: string;
  };
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

export interface ClassRecord {
  id: string;
  name: string;
  section: Section;
  components: ClassRecordComponent[];
  transmutation: Transmutation;
}

export interface Section {
  id: string;
  name: string;
  syStart: Date | string;
  syEnd: Date | string;
  color: string;
}

export interface ClassRecordComponent {
  activities: number;
  name: string;
  score: number;
  id: string;
}

export interface Transmutation {
  id?: string;
  name: string;
  lowest: number;
  passing: number;
  highest: number;
  is_default?: boolean;
}
