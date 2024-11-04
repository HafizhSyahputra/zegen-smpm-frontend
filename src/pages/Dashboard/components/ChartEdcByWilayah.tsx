import { Pie } from "@ant-design/plots";
const ChartEdcByWilayah = () => {
  const data = [
    {
      type: "WILAYAH 1",
      value: 3798,
    },
    {
      type: "WILAYAH 2",
      value: 7983,
    },
    {
      type: "WILAYAH 3",
      value: 2122,
    },
    {
      type: "WILAYAH 4",
      value: 1636,
    },
    {
      type: "WILAYAH 5",
      value: 3123,
    },
    {
      type: "WILAYAH 6",
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

export default ChartEdcByWilayah;
