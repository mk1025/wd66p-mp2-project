export interface InterfaceActivity {
  id: string;
  name: string;
  type: string;
  color: string;
  components: [
    {
      id: string;
      name: string;
      type: string;
      score: number | string;
      bonus: boolean;
    },
  ];
}

export interface InterfaceStudent {
  id: string;
  gender: string;
  last_name: string;
  first_name: string;
  activities: [
    {
      id: string;
      components: [
        {
          id: string;
          score: number;
        },
      ];
    },
  ];
}

export interface InterfaceRecord {
  id: string;
  name: string;
  section_id: string;
  section_name: string;
  syStart: string;
  syEnd: string;
  color: string;
  transmutation: {
    id: string;
    name: string;
    lowest: number;
    passing: number;
    highest: number;
  };
  components: [
    {
      id: string;
      name: string;
      order_no: number;
      score: number | string;
      activities: [
        {
          id: string;
          name: string;
          type: string;
          color: string;
          components: [
            {
              id: string;
              name: string;
              type: string;
              score: number | string;
              bonus: boolean;
            },
          ];
        },
      ];
    },
  ];
  students: [
    {
      id: string;
      gender: string;
      last_name: string;
      first_name: string;
      activities: [
        {
          id: string;
          components: [
            {
              id: string;
              score: number;
            },
          ];
        },
      ];
    },
  ];
}
