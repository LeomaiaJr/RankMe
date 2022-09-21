import { api } from "../../../../infra/api";
const instance = api;

export function createClass(data: any) {
  return instance.post("/classes", data);
}

export function deleteClass(id: string) {
  return instance.delete(`/classes/${id}`);
}

export function getClass(id: string) {
  return instance.get(`/classes`, { params: { id } });
}

export function getClassByString(query: string) {
  return instance
    .get(`/classes/by-string`, { params: { text: query } })
    .then((res) => res.data)
    .catch((err) => err);
}

export function addStudents(classId: string, studentId: string) {
  return instance.post("/classes/addStudents", {
    classId,
    students: [studentId],
  });
}

export function getStudents(classId: string) {
  return instance.get("classes/get-students-by", { params: { classId } });
}
