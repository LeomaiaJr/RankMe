import { api } from "../../../../infra/api";

export function createTopic(data: any) {
  return api.post("/topics", data);
}

export function deleteTopic(id: string) {
  return api.delete(`/topics/${id}`);
}

export function getTopic(id: string) {
  return api.get(`/topics/`,  { params: { id } });
}

export function closeTopic(id: string) {
  return api.get(`/topics/close-topic`,  { params: { id } });
}

export function openTopic(id: string) {
  return api.get(`/topics/open-topic`,  { params: { id } });
}

export function makeResultsAvailable(id: string) {
  return api.get(`/topics/results-available`,  { params: { id } });
}