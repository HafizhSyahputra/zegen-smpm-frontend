import { Pie } from "@ant-design/plots";
const ChartKepemilikan = () => {
  const data = [
    {
      type: "SEWA",
      value: 3189,
    },
    {
      type: "MILIK",
      value: 2080,
    }
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

export default ChartKepemilikan;
