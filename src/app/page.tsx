import PageLayout from "@/components/PageLayout/PageLayout";
import LeftPane from "@/components/LeftPane/LeftPane";
import RightPane from "@/components/RightPane/RightPane";
import { AppUiProvider } from "@/state/AppUiContext";

export default function Home() {
  return (
    <AppUiProvider>
      <PageLayout left={<LeftPane />} right={<RightPane />} />
    </AppUiProvider>
  );
}