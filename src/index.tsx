import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  DistributionOptionsStarter,
  DistributionOptionsPro,
  DistributionOptionsLabel,
  DistributionOptionsDittoPlusRLS,
  DistributionOptionsPurchased,
} from "./screens/DistributionOptions";

type Plan = "Starter" | "Pro" | "Label" | "DittoPlusRLS" | "Purchased";

const App = () => {
  const [plan, setPlan] = useState<Plan>("Starter");

  return (
    <div>
      {/* Plan selector tabs */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-[#e5e5e5] z-50 flex justify-center gap-2 p-3">
        {(["Starter", "Pro", "Label", "DittoPlusRLS", "Purchased"] as Plan[]).map((p) => (
          <button
            key={p}
            onClick={() => setPlan(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              plan === p
                ? "bg-[#6c5ce7] text-white"
                : "bg-[#f5f5f5] text-[#0e112c] hover:bg-[#e5e5e5]"
            }`}
          >
            {p === "DittoPlusRLS" ? "Ditto+ RLS" : p}
          </button>
        ))}
      </div>

      {/* Content with top padding for fixed header */}
      <div className="pt-16">
        {plan === "Starter" && <DistributionOptionsStarter />}
        {plan === "Pro" && <DistributionOptionsPro />}
        {plan === "Label" && <DistributionOptionsLabel />}
        {plan === "DittoPlusRLS" && <DistributionOptionsDittoPlusRLS />}
        {plan === "Purchased" && <DistributionOptionsPurchased />}
      </div>
    </div>
  );
};

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
