// STEP F4-F6 - incident requests (every one sends the token)
import { API_URL } from "./config";
import type { Microservice } from "../types";


// GET /api/incidents  (STEP F4)
export const fetchMicroservice = async (token: string | null): Promise<Microservice[]> => {
  const res = await fetch(`${API_URL}/incidents`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.details ? data.details[0].message : data.error);
  }

  return data;
};


// POST /api/incidents  (STEP F5)
export const createMicroservice = async (
  token: string | null,
  microservice: Partial<Microservice>
): Promise<Microservice> => {
  const res = await fetch(`${API_URL}/microservices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(microservice),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.details ? data.details[0].message : data.error);
  }

  return data;
};


// PATCH /api/incidents/:id  (STEP F6)
export const updateMicroservice = async (
  token: string | null,
  id: string,
  changes: Partial<Microservice>
): Promise<Microservice> => {
  const res = await fetch(`${API_URL}/microservices/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(changes),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.details ? data.details[0].message : data.error);
  }

  return data;
};


// DELETE /api/incidents/:id  (STEP F6)
export const deleteMicroservice = async (token: string | null, id: string): Promise<Microservice> => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.details ? data.details[0].message : data.error);
  }

  return data;
};
