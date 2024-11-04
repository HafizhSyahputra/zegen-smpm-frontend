
import {
  IBaseResponseService,
  IPaginationRequest,
  IPaginationResponse,
} from "@smpm/models";
import axios from "@smpm/services/axios";
import { IRoleModel } from "@smpm/models/roleModel";

export const getRole = async (
  param: IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IRoleModel>>> => {
  const response = await axios.get("/role", {
    params: param,
  });
  return response.data;
};

export const updateRole = async (
  id: number,
  roleData: Partial<IRoleModel>
): Promise<IBaseResponseService<IRoleModel>> => {
  const response = await axios.patch(`/role/${id}`, roleData);
  // console.log('Update role response:', response);  
  return response.data;
};

export const createRole = async (
  roleData: Partial<IRoleModel>
): Promise<IBaseResponseService<IRoleModel>> => {
  const response = await axios.post("/role", roleData);
  return response.data;
};

export const deleteRole = async (
  id: number
): Promise<IBaseResponseService<void>> => {
  const response = await axios.delete(`/role/${id}`);
  return response.data;
};
