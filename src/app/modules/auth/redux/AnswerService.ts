import { api } from "../../../../infra/api";

export function submitAnswer(answer: any) {
  return api.post("/answers", answer);
}

export function studentAnsweredCorretly(studentId: any, questionId: any) {
  return api.get("/answers/student-answered-correctly", {
    params: {
      studentId,
      questionId,
    },
  });
}
