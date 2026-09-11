import { useEffect, useState } from "react";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
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

import { useAuth } from "./context/AuthContext";

type Screen =
  | "landing"
  | "login"
  | "signup"
  | "onboarding"
  | "consent"
  | "connect"
  | "analysis"
  | "dashboard"
  | "score-explanation"
  | "financial-growth"
  | "score-history"
  | "opportunity"
  | "ecobank-login"
  | "customer-overview"
  | "customer-detail"
  | "supporting-evidence"
  | "recommendation"
  | "decision-support";

interface NavigationParams {
  customerId?: string;
}

const SCREEN_STORAGE_KEY = "trustid_current_screen";
const CUSTOMER_STORAGE_KEY = "trustid_selected_customer";

function getInitialScreen(): Screen {
  const savedScreen = localStorage.getItem(
    SCREEN_STORAGE_KEY
  );

  const validScreens: Screen[] = [
    "landing",
    "login",
    "signup",
    "onboarding",
    "consent",
    "connect",
    "analysis",
    "dashboard",
    "score-explanation",
    "financial-growth",
    "score-history",
    "opportunity",
    "ecobank-login",
    "customer-overview",
    "customer-detail",
    "supporting-evidence",
    "recommendation",
    "decision-support",
  ];

  if (
    savedScreen &&
    validScreens.includes(savedScreen as Screen)
  ) {
    return savedScreen as Screen;
  }

  return "landing";
}

export default function App() {
  const {
    user,
    isAuthenticated,
    loading,
    logout,
  } = useAuth();

  const [screen, setScreen] =
    useState<Screen>(getInitialScreen);

  const [customerId, setCustomerId] = useState<
    string | undefined
  >(() => {
    return (
      localStorage.getItem(CUSTOMER_STORAGE_KEY) ||
      undefined
    );
  });

  /*
   * ---------------------------------------------------------
   * PERSIST CURRENT SCREEN
   * ---------------------------------------------------------
   */

  useEffect(() => {
    localStorage.setItem(
      SCREEN_STORAGE_KEY,
      screen
    );
  }, [screen]);

  /*
   * ---------------------------------------------------------
   * PERSIST SELECTED CUSTOMER
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (customerId) {
      localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        customerId
      );
    } else {
      localStorage.removeItem(
        CUSTOMER_STORAGE_KEY
      );
    }
  }, [customerId]);

  /*
   * ---------------------------------------------------------
   * NAVIGATION
   * ---------------------------------------------------------
   */

  function navigate(
    nextScreen: string,
    params?: NavigationParams
  ) {
    setScreen(nextScreen as Screen);

    if (params?.customerId) {
      setCustomerId(params.customerId);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
   * ---------------------------------------------------------
   * LOGOUT
   * ---------------------------------------------------------
   */

  function handleLogout() {
    logout();

    setCustomerId(undefined);
    setScreen("landing");

    localStorage.removeItem(
      SCREEN_STORAGE_KEY
    );

    localStorage.removeItem(
      CUSTOMER_STORAGE_KEY
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-[#E2EAF2] border-t-[#0D2D52] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Loading TrustID...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * ECOBANK ROLE
   * ---------------------------------------------------------
   */

  const isEcobankOfficer =
    user?.role === "ECOBANK_OFFICER" ||
    user?.role === "ADMIN";

  /*
   * ---------------------------------------------------------
   * CUSTOMER PROTECTED SCREENS
   * ---------------------------------------------------------
   */

  const protectedCustomerScreens: Screen[] = [
    "onboarding",
    "consent",
    "connect",
    "analysis",
    "dashboard",
    "score-explanation",
    "financial-growth",
    "score-history",
    "opportunity",
  ];

  /*
   * Customer-only screens require authentication.
   */

  if (
    protectedCustomerScreens.includes(screen) &&
    !isAuthenticated
  ) {
    return (
      <SignUpPage navigate={navigate} />
    );
  }

  /*
   * ---------------------------------------------------------
   * ECOBANK PROTECTED SCREENS
   * ---------------------------------------------------------
   */

  const ecobankScreens: Screen[] = [
    "customer-overview",
    "customer-detail",
    "supporting-evidence",
    "recommendation",
    "decision-support",
  ];

  if (ecobankScreens.includes(screen)) {
    /*
     * Not authenticated:
     * Show Ecobank login.
     */

    if (!isAuthenticated) {
      return (
        <EcobankLoginPage
          navigate={navigate}
        />
      );
    }

    /*
     * Authenticated as a normal customer:
     * Block access to the Ecobank portal.
     */

    if (!isEcobankOfficer) {
      return (
        <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center px-6">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
              <span className="text-2xl text-red-500">
                !
              </span>
            </div>

            <h1 className="text-xl font-semibold text-[#0D2D52]">
              Access Restricted
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              This area is restricted to authorised Ecobank
              officers and administrators.
            </p>

            <button
              type="button"
              onClick={() => navigate("dashboard")}
              className="mt-6 w-full rounded-xl bg-[#0D2D52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#123B68] transition"
            >
              Back to TrustID
            </button>
          </div>
        </div>
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * AUTHENTICATED USER LANDING BEHAVIOUR
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * We intentionally DO NOT include "landing" here.
   *
   * This allows an authenticated user to click Home
   * from the sidebar and actually see the landing page.
   *
   * Only "signup" is redirected when already authenticated.
   */

  if (
    screen === "signup" &&
    isAuthenticated &&
    user
  ) {
    /*
     * Ecobank officer/admin
     */

    if (isEcobankOfficer) {
      return (
        <CustomerOverviewPage
          navigate={navigate}
        />
      );
    }

    /*
     * Customer has not completed onboarding.
     */

    if (!user.onboardingCompleted) {
      return (
        <OnboardingPage
          navigate={navigate}
        />
      );
    }

    /*
     * Customer has not granted consent.
     */

    if (!user.consent?.granted) {
      return (
        <ConsentPage
          navigate={navigate}
        />
      );
    }

    /*
     * Customer is fully set up.
     */

    return (
      <DashboardPage
        navigate={navigate}
      />
    );
  }

  /*
   * ---------------------------------------------------------
   * PAGE RENDERING
   * ---------------------------------------------------------
   */

  return (
    <div className="size-full">
      {screen === "landing" && (
        <LandingPage
          navigate={navigate}
        />
      )}

      {screen === "login" && (
        <LoginPage
          navigate={navigate}
        />
      )}

      {screen === "signup" && (
        <SignUpPage
          navigate={navigate}
        />
      )}

      {screen === "onboarding" && (
        <OnboardingPage
          navigate={navigate}
        />
      )}

      {screen === "consent" && (
        <ConsentPage
          navigate={navigate}
        />
      )}

      {screen === "connect" && (
        <ConnectPage
          navigate={navigate}
        />
      )}

      {screen === "analysis" && (
        <AnalysisPage
          navigate={navigate}
        />
      )}

      {screen === "dashboard" && (
        <DashboardPage
          navigate={navigate}
        />
      )}

      {screen === "score-explanation" && (
        <ScoreExplanationPage
          navigate={navigate}
        />
      )}

      {screen === "financial-growth" && (
        <FinancialGrowthPage
          navigate={navigate}
        />
      )}

      {screen === "score-history" && (
        <ScoreHistoryPage
          navigate={navigate}
        />
      )}

      {screen === "opportunity" && (
        <OpportunityPage
          navigate={navigate}
        />
      )}

      {screen === "ecobank-login" && (
        <EcobankLoginPage
          navigate={navigate}
        />
      )}

      {screen === "customer-overview" && (
        <CustomerOverviewPage
          navigate={navigate}
        />
      )}

      {screen === "customer-detail" && (
        <CustomerDetailPage
          navigate={navigate}
          customerId={customerId}
        />
      )}

      {screen === "supporting-evidence" && (
        <SupportingEvidencePage
          navigate={navigate}
          customerId={customerId}
        />
      )}

      {screen === "recommendation" && (
        <RecommendationPage
          navigate={navigate}
          customerId={customerId}
        />
      )}

      {screen === "decision-support" && (
        <DecisionSupportPage
          navigate={navigate}
          customerId={customerId}
        />
      )}
    </div>
  );
}
