import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});


export async function getIntakeForm() {
  const response = await api.get("/intake-form");
  return response.data;
}


export async function submitIntake(answers) {
  const response = await api.post("/intakes", answers);
  return response.data;
}
