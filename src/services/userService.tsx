
import axios from "@smpm/services/axios";
import { IUserModel } from "@smpm/models/userModel";
import {
  IBaseResponseService,
  IPaginationRequest,
  IPaginationResponse,
} from "@smpm/models";

// Fungsi untuk mendapatkan daftar pengguna
export const getUser = async (
  params: IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IUserModel>>> => {
  const response = await axios.get("/user", { params });
  return response.data;
};

// Fungsi untuk mendapatkan pengguna berdasarkan ID
export const getUserById = async (
  id: number
): Promise<IBaseResponseService<IUserModel>> => {
  const response = await axios.get(`/user/${id}`);
  return response.data;
};

// Fungsi untuk membuat pengguna baru
export const createUser = async (
  userData: Partial<IUserModel>
): Promise<IBaseResponseService<IUserModel>> => {
  const response = await axios.post("/user", userData);
  return response.data;
};

// Fungsi untuk memperbarui pengguna
export const updateUser = async (
  id: number,
  userData: Partial<IUserModel>
): Promise<IBaseResponseService<IUserModel>> => {
  const response = await axios.patch(`/user/${id}`, userData);
  return response.data;
};

// Fungsi untuk menghapus pengguna
export const deleteUser = async (
  id: number
): Promise<IBaseResponseService<void>> => {
  const response = await axios.delete(`/user/${id}`);
  return response.data; 
};

// Fungsi untuk mencari pengguna
export const searchUser = async (
  searchTerm: string,
  params: IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IUserModel>>> => {
  const response = await axios.get("/users/search", {
    params: { ...params, search: searchTerm },
  });
  return response.data;
};
