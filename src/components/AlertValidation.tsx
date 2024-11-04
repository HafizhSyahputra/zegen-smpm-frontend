import { appGetter, setErrorValidation } from "@smpm/store/appSlice";
import { Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";

const AlertValidation: React.FC<{ errorKey: string }> = ({
  errorKey = "default",
}) => {
  const { errorValidation } = useSelector(appGetter);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(setErrorValidation({}));
  };

  return (
    <div className="flex flex-col space-y-1 my-2">
      {errorValidation[errorKey] &&
        Object.keys(errorValidation[errorKey]).map((errors) =>
          errorValidation[errorKey][errors].map((item: string, i: number) => (
            <Alert
              key={i}
              message={`${item[0].toUpperCase()}${item.slice(1)}`}
              banner
              closable
              onClose={onClose}
            />
          ))
        )}
    </div>
  );
};

export default AlertValidation;
