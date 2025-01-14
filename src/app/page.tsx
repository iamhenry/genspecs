import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-[960px] mx-auto">
        <div className="bg-white rounded-3xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] border border-gray-200 p-10">
          <h1 className="text-2xl font-bold text-neutral-800 mb-8 font-['Chivo Mono']">
            Generate Project Specs
          </h1>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
