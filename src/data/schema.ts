export interface Branch {
  id: string;
  name: string;
}

export interface Semester {
  id: string;
  number: number;
  branch_id: string;
}

export interface Unit {
  id: string;
  name: string;
  semester_id: string;
  order_no: number;
}

export interface Topic {
  id: string;
  title: string;
  unit_id: string;
  video_links?: string[];
  pdf_path?: string;
  created_at: string;
} 