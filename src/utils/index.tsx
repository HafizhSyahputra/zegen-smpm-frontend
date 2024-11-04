import { IBaseResponseService, IErrorResponseService } from "@smpm/models";
import { setErrorValidation } from "@smpm/store/appSlice";
import { message } from "antd";
import { AxiosError } from "axios";
import { Dispatch } from "redux";

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim());
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

export const deleteCookie = (name: string) => {
  const date = new Date();

  // Set it expire in -1 days
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);

  document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
};

export const makeResponseServiceError = (
  dispatch: Dispatch<any>,
  errorKey: string = "default",
  err: AxiosError<IBaseResponseService<IErrorResponseService>>,
  useNotification: boolean = true
) => {
  if (err.response!.data.status.code >= 500) {
    if (useNotification)
      message.error(
        err.response!.data.status.description ||
          "Oops something went wrong, please contact administrator to fix this issue"
      );
  } else {
    if (useNotification)
      message.warning(err.response!.data?.status.description);
  }

  if (
    err.response!.data.status.code == 422 &&
    err.response!.data.result.errors
  ) {
    console.log(err.response!.data.result.errors);
    dispatch(
      setErrorValidation({
        [errorKey]: err.response!.data.result.errors,
      })
    );
  }
};
