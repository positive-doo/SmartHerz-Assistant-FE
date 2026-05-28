import PageLayout from "@/components/PageLayout/PageLayout";
import LeftPane from "@/components/LeftPane/LeftPane";
import RightPane from "@/components/RightPane/RightPane";

export default function Home() {
  return <PageLayout left={<LeftPane />} right={<RightPane />} />;
}