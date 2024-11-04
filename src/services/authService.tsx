import { IBaseResponseService } from "@smpm/models";
import { IFormInputSignIn, ISignInModel } from "@smpm/models/authModel";
import axios from "@smpm/services/axios";

export const signIn = async (
  data: IFormInputSignIn
): Promise<IBaseResponseService<ISignInModel>> => {
  const response = await axios.post("/auth/sign-in", data);
  return response.data;
};

export const signOut = async (): Promise<IBaseResponseService<null>> => {
  const response = await axios.get("/auth/sign-out");
  return response.data;
};
