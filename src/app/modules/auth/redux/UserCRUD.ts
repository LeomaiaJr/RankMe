import { api } from "../../../../infra/api";
const instance = api;

const GET_USER_BY_URL = `/users`;
const GET_TEACHER_CLASSES_URL = `${GET_USER_BY_URL}/teacher-classes`;

export function getUserBy(query: any) {
  return instance.get(GET_USER_BY_URL, {
    params: query,
  });
}

export function getTeacherClasses(id: string) {
  return instance.get(GET_TEACHER_CLASSES_URL, {
    params: { id: id },
  });
}

export function getUserAnalytics(id: string){
  return instance.get(`${GET_USER_BY_URL}/analytics`, {
    params: { id: id },
  });
}