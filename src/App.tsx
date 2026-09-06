import { useState } from "react";

import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import OnboardingPage from "./pages/OnboardingPage";
import ConsentPage from "./pages/ConsentPage";
import ConnectPage from "./pages/ConnectPage";
import AnalysisPage from "./pages/AnalysisPage";
import DashboardPage from "./pages/DashboardPage";
import ScoreExplanationPage from "./pages/ScoreExplanationPage";
import FinancialGrowthPage from "./pages/FinancialGrowthPage";
import ScoreHistoryPage from "./pages/ScoreHistoryPage";
import OpportunityPage from "./pages/OpportunityPage";
import EcobankLoginPage from "./pages/EcobankLoginPage";
import CustomerOverviewPage from "./pages/CustomerOverviewPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import SupportingEvidencePage from "./pages/SupportingEvidencePage";
import RecommendationPage from "./pages/RecommendationPage";
import DecisionSupportPage from "./pages/DecisionSupportPage";

type Screen =
  | "landing" | "signup" | "onboarding" | "consent" | "connect" | "analysis"
  | "dashboard" | "score-explanation" | "financial-growth" | "score-history" | "opportunity"
  | "ecobank-login" | "customer-overview" | "customer-detail" | "supporting-evidence"
  | "recommendation" | "decision-support";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");

  const navigate = (s: string) => {
    setScreen(s as Screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const props = { navigate };

  return (
    <div className="size-full">
      {screen === "landing" && <LandingPage {...props} />}
      {screen === "signup" && <SignUpPage {...props} />}
      {screen === "onboarding" && <OnboardingPage {...props} />}
      {screen === "consent" && <ConsentPage {...props} />}
      {screen === "connect" && <ConnectPage {...props} />}
      {screen === "analysis" && <AnalysisPage {...props} />}
      {screen === "dashboard" && <DashboardPage {...props} />}
      {screen === "score-explanation" && <ScoreExplanationPage {...props} />}
      {screen === "financial-growth" && <FinancialGrowthPage {...props} />}
      {screen === "score-history" && <ScoreHistoryPage {...props} />}
      {screen === "opportunity" && <OpportunityPage {...props} />}
      {screen === "ecobank-login" && <EcobankLoginPage {...props} />}
      {screen === "customer-overview" && <CustomerOverviewPage {...props} />}
      {screen === "customer-detail" && <CustomerDetailPage {...props} />}
      {screen === "supporting-evidence" && <SupportingEvidencePage {...props} />}
      {screen === "recommendation" && <RecommendationPage {...props} />}
      {screen === "decision-support" && <DecisionSupportPage {...props} />}
    </div>
  );
}
