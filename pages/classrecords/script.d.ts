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
	Buttons?: {
		[key: string]: HTMLButtonElement;
	};
	Text?: HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement;
	Inputs?: {
		[key: string]: HTMLInputElement;
	};
	Displays?: {
		[key: string]:
			| HTMLSpanElement
			| HTMLHeadingElement
			| HTMLParagraphElement
			| HTMLTableSectionElement;
	};
	Methods?: Methods_ClassRecordComponents;
}

export interface Methods_ClassRecordComponents {
	computeTotalScore: () => void;
	populateComponents: (components: ClassRecordComponent[]) => void;
	insertComponent: (component: ClassRecordComponent) => void;
	deleteComponent: (component: ClassRecordComponent) => void;
	updateComponent: (component: ClassRecordComponent) => void;
	getComponents: () => ClassRecordComponent[];
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
	activities?: number;
	order_no?: number;
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
