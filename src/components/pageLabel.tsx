import { Flex } from "antd";

interface IPageLabel {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  endSection?: React.ReactNode;
}

const PageLabel: React.FC<IPageLabel> = ({ title, subtitle, endSection }) => {
  return (
    <Flex
      className="bg-white shadow-sm px-6 py-2 flex-col md:flex-row"
      justify="space-between"
      align="center"
    >
      <Flex vertical>
        <>{title}</>
        <>{subtitle}</>
      </Flex>
      <Flex>{endSection}</Flex>
    </Flex>
  );
};

export default PageLabel;
