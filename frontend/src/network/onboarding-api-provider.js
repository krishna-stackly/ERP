// src/network/onboarding-api-provider.js
// Matches core/urls.py, mounted at /api/ (NOT /api/masters/)
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class OnboardingApiProvider {
  async fetchCandidates(params = {}) {
    try {
      const res = await ApiClient.get("/onboarding/", { params });
      if (res.status === 200) return res.data;
      toast.error("Failed to load candidates");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading candidates");
      return [];
    }
  }

  async fetchCandidateById(candidateId) {
    try {
      const res = await ApiClient.get(`/onboarding/${candidateId}/`);
      if (res.status === 200) return res.data;
      toast.error("Failed to load candidate");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to fetch candidate data");
      return null;
    }
  }

  // formData must be a FormData instance (multipart, handles file uploads)
  async saveCandidate(candidateId, formData) {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const res = candidateId
        ? await ApiClient.put(`/onboarding/${candidateId}/`, formData, config)
        : await ApiClient.post("/onboarding/", formData, config);

      if (res.status === 200 || res.status === 201) return res.data;
      toast.error("Failed to save candidate");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to save candidate");
      throw error;
    }
  }

  async deleteCandidate(candidateId) {
    try {
      const res = await ApiClient.delete(`/onboarding/${candidateId}/`);
      if (res.status === 200 || res.status === 204) return true;
      toast.error("Failed to delete candidate");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to delete candidate");
      return false;
    }
  }
}

const onboardingApiProvider = new OnboardingApiProvider();
export default onboardingApiProvider;
