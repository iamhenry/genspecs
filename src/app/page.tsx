import { ContactForm } from "@/components/ContactForm";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-[960px]">
        <div className="bg-white rounded-3xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] border border-gray-200 p-10 w-full">
          {/* <ContactForm /> */}
          <TwoColumnLayout
            leftContent={<div>Left Column Content</div>}
            rightContent={<div>Right Column Content</div>}
          />
        </div>
      </div>
    </div>
  );
}
