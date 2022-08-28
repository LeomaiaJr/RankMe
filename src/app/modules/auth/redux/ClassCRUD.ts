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
