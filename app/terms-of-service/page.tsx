import TermsandCondition from "../components/TermsandCondition";

export default function TermsofServiceDesktopTabletPage() {
  return (
    <div className="w-full bg-gray-100">
      {/* header section */}


      {/* terms and conditions section */}
      <div className="flex justify-center">
        <div className="container-xs flex justify-center px-[60px] sm:px-4">
          <div className="w-full pb-12 pt-6 md:pb-5 sm:py-5">
            <TermsandCondition />
          </div>
        </div>
      </div>

    </div>
  );
}
