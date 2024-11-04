import { Column } from "@ant-design/plots";
const ChartStatusPenarikan = () => {
  const data = [
    {
      "typeEdc": "MTI",
      "value": 35,
      "type": "Inprog",
    },
    {
      "typeEdc": "SSI",
      "value": 50,
      "type": "Inprog",
    },
    {
      "typeEdc": "INGENICO",
      "value": 40,
      "type": "Inprog",
    },
    {
      "typeEdc": "VISIONET",
      "value": 30,
      "type": "Inprog",
    },
    {
      "typeEdc": "PRIMAVISTA",
      "value": 20,
      "type": "Inprog",
    },
    {
      "typeEdc": "MTI",
      "value": 35,
      "type": "Closed",
    },
    {
      "typeEdc": "SSI",
      "value": 50,
      "type": "Closed",
    },
    {
      "typeEdc": "INGENICO",
      "value": 40,
      "type": "Closed",
    },
    {
      "typeEdc": "VISIONET",
      "value": 30,
      "type": "Closed",
    },
    {
      "typeEdc": "PRIMAVISTA",
      "value": 20,
      "type": "Closed",
    },
    {
      "typeEdc": "MTI",
      "value": 35,
      "type": "Failed",
    },
    {
      "typeEdc": "SSI",
      "value": 50,
      "type": "Failed",
    },
    {
      "typeEdc": "INGENICO",
      "value": 40,
      "type": "Failed",
    },
    {
      "typeEdc": "VISIONET",
      "value": 30,
      "type": "Failed",
    },
    {
      "typeEdc": "PRIMAVISTA",
      "value": 20,
      "type": "Failed",
    },
  ];

  const config = {
    data: data,
    xField: "typeEdc",
    yField: "value",
    stack: true,
    colorField: "type",
    label: {
      text: "value",
      textBaseline: "bottom",
      position: "inside",
    },
    interaction: {
      elementHighlightByColor: {
        link: true,
      },
    },
    state: {
      active: { linkFill: "rgba(0,0,0,0.25)", stroke: "black", lineWidth: 0.5 },
      inactive: { opacity: 0.5 },
    },
  };

  return <Column {...config} />;
};

export default ChartStatusPenarikan;
