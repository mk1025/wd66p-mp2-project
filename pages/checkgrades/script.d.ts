import { ModalInterface } from "flowbite";

export type Request =
	| (string & {
			length: 12;
			[Symbol.iterator]: () => IterableIterator<string>;
	  })
	| (string & {
			length: 13;
			[Symbol.iterator]: () => IterableIterator<string>;
			readonly 5: "-";
	  });

export interface Student {
	firstName: string;
	lastName: string;
	records: Record[];
	section: Section;
	instructor: Instructor;
}

export interface Instructor {
	firstName: string;
	lastName: string;
	imagePath: string;
}

export interface Record {
	name: string;
	transmutation: Transmutation;
	components: RecordComponent[];
}

export interface Section {
	name: string;
	syStart: Date | string;
	syEnd: Date | string;
	color: string;
}

export interface Transmutation {
	lowest: number;
	passing: number;
	highest: number;
}

export interface RecordComponent {
	name: string;
	score: number;
	activities: Activity[];
}

export interface Activity {
	name: string;
	type: string;
	components: ActivityComponents[];
}

export interface ActivityComponents {
	name: string;
	type: string;
	score: number;
	maxScore: number;
	bonus: boolean;
}
