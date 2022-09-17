export interface ClassData {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  students: any[];
  topics: Topic[];
  teacher: Teacher;
}

export interface Teacher {
  id: string;
  name: string;
  nick?: any;
  email: string;
  password: string;
  phone: string;
  type: string;
  register_id: string;
  course?: any;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  name: string;
  available_to_answer: boolean;
  results_available: boolean;
  created_at: string;
  updated_at: string;
}
