import { api } from "../../../../infra/api";

export function submitAnswer(answer: any) {
  return api.post("/answers", answer);
}