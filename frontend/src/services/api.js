import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const predictionsAPI = {
  getAll: (params) => API.get("/predictions", { params }),
  getOne: (id) => API.get(`/predictions/${id}`),
  create: (data) => API.post("/predictions", data),
  vote: (id, voteType) => API.post(`/predictions/${id}/vote`, { voteType })
};

export const commentsAPI = {
  getComments: (predictionId) =>
    API.get(`/predictions/${predictionId}/comments`),

  createComment: (predictionId, data) =>
    API.post(`/predictions/${predictionId}/comments`, data)
};

export default API;