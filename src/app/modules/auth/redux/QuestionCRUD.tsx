import { api } from "../../../../infra/api";

export function createQuestion(question: any) {
  return api.post("/questions", question);
}

export function deleteQuestion(id: string) {
  return api.delete(`/questions/${id}`);
}