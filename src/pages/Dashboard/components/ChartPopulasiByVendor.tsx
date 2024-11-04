import { Pie } from "@ant-design/plots";
const ChartPopulasiByVendor = () => {
  const data = [
    {
      type: "VENDOR 1",
      value: 3189,
    },
    {
      type: "VENDOR 2",
      value: 2080,
    },
    {
      type: "VENDOR 3",
      value: 5083,
    },
    {
      type: "VENDOR 4",
      value: 2092,
    },
    {
      type: "VENDOR 5",
      value: 3123,
    },
    {
      type: "VENDOR 6",
      value: 5424,
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

export default ChartPopulasiByVendor;
