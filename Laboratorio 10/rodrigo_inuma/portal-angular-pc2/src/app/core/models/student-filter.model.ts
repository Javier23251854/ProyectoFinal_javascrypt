export interface StudentFilter {
  search: string;
  programa: string;
  estadoAcademico: string;
  sort: 'asc' | 'desc' | '';
}