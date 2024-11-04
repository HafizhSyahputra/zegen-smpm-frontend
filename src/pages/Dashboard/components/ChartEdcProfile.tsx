import { Pie } from "@ant-design/plots";
const ChartEdcProfile = () => {
  const data = [
    {
      type: "INGENICO",
      value: 3189,
    },
    {
      type: "VERIFONE",
      value: 2080,
    },
    {
      type: "PAX",
      value: 1890,
    },
    {
      type: "ANDROID",
      value: 5080,
    },
  ];

  const config = {
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      text: (d) => `${d.type}\n ${d.value}`,
      position: "spider",
    },
    legend: {
      color: {
        title: false,
        position: "top",
        rowPadding: 5,
      },
    },
  };

  return <Pie {...config} />;
};

export default ChartEdcProfile;
