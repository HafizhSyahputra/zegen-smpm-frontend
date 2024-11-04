import { StepProps, Steps } from "antd";
import React from "react";

export let STYLE_STEP = {
  minWidth: 300,
};

type StepActivityProps = {
  current: number;
  onChange: (current: number) => void;
  items: StepProps[];
};

const StepActivity: React.FC<StepActivityProps> = ({
  current,
  onChange,
  items,
}) => {
  return (
    <div className={"overflow-x-auto"}>
      <Steps
        type="navigation"
        status={"process"}
        size="small"
        current={current}
        responsive={false}
        direction={"horizontal"}
        onChange={onChange}
        items={items}
      />
    </div>
  );
};

export default StepActivity;
