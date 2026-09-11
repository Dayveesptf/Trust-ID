import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
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

interface NavigationParams {
  customerId?: string;
}

/*
 * ---------------------------------------------------------
 * ROUTE MAP
 * ---------------------------------------------------------
 *
 * The existing TrustID pages still use calls such as:
 *
 * navigate("dashboard")
 * navigate("score-explanation")
 *
 * This adapter converts those old screen names into
 * real browser URLs.
 *
 * That means we can migrate the application gradually
 * without having to rewrite every page at once.
 */

const routeMap: Record<string, string> = {
  landing: "/",
  login: "/login",
  signup: "/signup",

  onboarding: "/onboarding",
  consent: "/consent",
  connect: "/connect",
  analysis: "/analysis",

  dashboard: "/dashboard",
  "score-explanation": "/score",
  "financial-growth": "/growth",
  "score-history": "/history",
  opportunity: "/opportunities",

  "ecobank-login": "/ecobank/login",
  "customer-overview": "/ecobank",
};

function useLegacyNavigation() {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  function navigate(
    screen: string,
    navigationParams?: NavigationParams
  ) {
    let path = routeMap[screen];

    /*
     * Customer-specific Ecobank pages need the customer ID
     * in the URL.
     */
    if (screen === "customer-detail") {
      const customerId =
        navigationParams?.customerId ||
        params.customerId;

      path = customerId
        ? `/ecobank/customers/${customerId}`
        : "/ecobank";
    }

    if (screen === "supporting-evidence") {
      const customerId =
        navigationParams?.customerId ||
        params.customerId;

      path = customerId
        ? `/ecobank/evidence/${customerId}`
        : "/ecobank";
    }

    if (screen === "recommendation") {
      const customerId =
        navigationParams?.customerId ||
        params.customerId;

      path = customerId
        ? `/ecobank/assessment/${customerId}`
        : "/ecobank";
    }

    if (screen === "decision-support") {
      const customerId =
        navigationParams?.customerId ||
        params.customerId;

      path = customerId
        ? `/ecobank/decision/${customerId}`
        : "/ecobank";
    }

    /*
     * Fallback.
     *
     * This protects the app if an old page accidentally
     * calls navigate() with an unknown screen name.
     */
    if (!path) {
      console.warn(
        `TrustID navigation: unknown screen "${screen}"`
      );

      path = "/";
    }

    /*
     * Don't create a new browser history entry if we're
     * already on the requested URL.
     */
    if (location.pathname !== path) {
      routerNavigate(path);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  return navigate;
}

/*
 * ---------------------------------------------------------
 * LOADING SCREEN
 * ---------------------------------------------------------
 */

function LoadingScreen() {
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
 * ACCESS RESTRICTED
 * ---------------------------------------------------------
 */

function AccessRestricted() {
  const navigate = useLegacyNavigation();

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

/*
 * ---------------------------------------------------------
 * CUSTOMER ROUTE
 * ---------------------------------------------------------
 *
 * Used for pages that require a logged-in TrustID user.
 *
 * If the visitor is not authenticated, send them to
 * signup instead of allowing the page to render.
 */

function CustomerRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
}

/*
 * ---------------------------------------------------------
 * FULLY SETUP CUSTOMER ROUTE
 * ---------------------------------------------------------
 *
 * Used for pages available after:
 *
 * 1. Account creation
 * 2. Onboarding
 * 3. Consent
 *
 * This prevents users from jumping directly into the
 * dashboard before completing setup.
 */

function FullySetupCustomerRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /*
   * Ecobank officers should remain inside the Ecobank
   * portal instead of entering the customer dashboard.
   */
  if (
    user?.role === "ECOBANK_OFFICER" ||
    user?.role === "ADMIN"
  ) {
    return <Navigate to="/ecobank" replace />;
  }

  if (!user?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!user?.consent?.granted) {
    return <Navigate to="/consent" replace />;
  }

  return <>{children}</>;
}

/*
 * ---------------------------------------------------------
 * AUTHENTICATED ENTRY ROUTE
 * ---------------------------------------------------------
 *
 * This is used by /login.
 *
 * If the user is already authenticated, we don't show
 * the login form again.
 */

function AuthenticatedEntryRoute() {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  /*
   * Not logged in:
   * Show the normal TrustID login page.
   */
  if (!isAuthenticated) {
    const navigate = useLegacyNavigation();

    return <LoginPage navigate={navigate} />;
  }

  /*
   * Ecobank officer/admin:
   * Go directly to the Ecobank portal.
   */
  if (
    user?.role === "ECOBANK_OFFICER" ||
    user?.role === "ADMIN"
  ) {
    return <Navigate to="/ecobank" replace />;
  }

  /*
   * Customer has not completed onboarding.
   */
  if (!user?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  /*
   * Customer has not granted consent.
   */
  if (!user?.consent?.granted) {
    return <Navigate to="/consent" replace />;
  }

  /*
   * Customer is fully set up.
   */
  return <Navigate to="/dashboard" replace />;
}

/*
 * ---------------------------------------------------------
 * ECOBANK ROUTE
 * ---------------------------------------------------------
 *
 * Only ECOBANK_OFFICER and ADMIN accounts can access
 * these pages.
 */

function EcobankRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  /*
   * Not logged in:
   * Ecobank portal login.
   */
  if (!isAuthenticated) {
    return <Navigate to="/ecobank/login" replace />;
  }

  /*
   * Normal TrustID customer attempting to access
   * Ecobank officer tools.
   */
  if (
    user?.role !== "ECOBANK_OFFICER" &&
    user?.role !== "ADMIN"
  ) {
    return <AccessRestricted />;
  }

  return <>{children}</>;
}

/*
 * ---------------------------------------------------------
 * LEGACY NAVIGATION PAGE WRAPPER
 * ---------------------------------------------------------
 *
 * Existing pages receive:
 *
 * navigate("dashboard")
 *
 * while the actual application uses React Router URLs.
 */

function PageWithNavigation({
  children,
}: {
  children: (
    navigate: (
      screen: string,
      params?: NavigationParams
    ) => void
  ) => React.ReactNode;
}) {
  const navigate = useLegacyNavigation();

  return <>{children(navigate)}</>;
}

/*
 * ---------------------------------------------------------
 * CUSTOMER DETAIL WRAPPER
 * ---------------------------------------------------------
 */

function CustomerDetailRoute() {
  const { customerId } = useParams();

  const navigate = useLegacyNavigation();

  return (
    <CustomerDetailPage
      navigate={navigate}
      customerId={customerId}
    />
  );
}

/*
 * ---------------------------------------------------------
 * SUPPORTING EVIDENCE WRAPPER
 * ---------------------------------------------------------
 */

function SupportingEvidenceRoute() {
  const { customerId } = useParams();

  const navigate = useLegacyNavigation();

  return (
    <SupportingEvidencePage
      navigate={navigate}
      customerId={customerId}
    />
  );
}

/*
 * ---------------------------------------------------------
 * RECOMMENDATION / ASSESSMENT WRAPPER
 * ---------------------------------------------------------
 */

function RecommendationRoute() {
  const { customerId } = useParams();

  const navigate = useLegacyNavigation();

  return (
    <RecommendationPage
      navigate={navigate}
      customerId={customerId}
    />
  );
}

/*
 * ---------------------------------------------------------
 * DECISION SUPPORT WRAPPER
 * ---------------------------------------------------------
 */

function DecisionSupportRoute() {
  const { customerId } = useParams();

  const navigate = useLegacyNavigation();

  return (
    <DecisionSupportPage
      navigate={navigate}
      customerId={customerId}
    />
  );
}

/*
 * ---------------------------------------------------------
 * APP
 * ---------------------------------------------------------
 */

export default function App() {
  return (
    <Routes>
      {/* =================================================
          PUBLIC ROUTES
          ================================================= */}

      <Route
        path="/"
        element={
          <PageWithNavigation>
            {(navigate) => (
              <LandingPage navigate={navigate} />
            )}
          </PageWithNavigation>
        }
      />

      <Route
        path="/signup"
        element={
          <PageWithNavigation>
            {(navigate) => (
              <SignUpPage navigate={navigate} />
            )}
          </PageWithNavigation>
        }
      />

      <Route
        path="/login"
        element={<AuthenticatedEntryRoute />}
      />

      {/* =================================================
          CUSTOMER SETUP
          ================================================= */}

      <Route
        path="/onboarding"
        element={
          <CustomerRoute>
            <PageWithNavigation>
              {(navigate) => (
                <OnboardingPage navigate={navigate} />
              )}
            </PageWithNavigation>
          </CustomerRoute>
        }
      />

      <Route
        path="/consent"
        element={
          <CustomerRoute>
            <PageWithNavigation>
              {(navigate) => (
                <ConsentPage navigate={navigate} />
              )}
            </PageWithNavigation>
          </CustomerRoute>
        }
      />

      <Route
        path="/connect"
        element={
          <CustomerRoute>
            <PageWithNavigation>
              {(navigate) => (
                <ConnectPage navigate={navigate} />
              )}
            </PageWithNavigation>
          </CustomerRoute>
        }
      />

      <Route
        path="/analysis"
        element={
          <CustomerRoute>
            <PageWithNavigation>
              {(navigate) => (
                <AnalysisPage navigate={navigate} />
              )}
            </PageWithNavigation>
          </CustomerRoute>
        }
      />

      {/* =================================================
          CUSTOMER DASHBOARD
          ================================================= */}

      <Route
        path="/dashboard"
        element={
          <FullySetupCustomerRoute>
            <PageWithNavigation>
              {(navigate) => (
                <DashboardPage navigate={navigate} />
              )}
            </PageWithNavigation>
          </FullySetupCustomerRoute>
        }
      />

      <Route
        path="/score"
        element={
          <FullySetupCustomerRoute>
            <PageWithNavigation>
              {(navigate) => (
                <ScoreExplanationPage
                  navigate={navigate}
                />
              )}
            </PageWithNavigation>
          </FullySetupCustomerRoute>
        }
      />

      <Route
        path="/growth"
        element={
          <FullySetupCustomerRoute>
            <PageWithNavigation>
              {(navigate) => (
                <FinancialGrowthPage
                  navigate={navigate}
                />
              )}
            </PageWithNavigation>
          </FullySetupCustomerRoute>
        }
      />

      <Route
        path="/history"
        element={
          <FullySetupCustomerRoute>
            <PageWithNavigation>
              {(navigate) => (
                <ScoreHistoryPage
                  navigate={navigate}
                />
              )}
            </PageWithNavigation>
          </FullySetupCustomerRoute>
        }
      />

      <Route
        path="/opportunities"
        element={
          <FullySetupCustomerRoute>
            <PageWithNavigation>
              {(navigate) => (
                <OpportunityPage
                  navigate={navigate}
                />
              )}
            </PageWithNavigation>
          </FullySetupCustomerRoute>
        }
      />

      {/* =================================================
          ECOBANK LOGIN
          ================================================= */}

      <Route
        path="/ecobank/login"
        element={
          <PageWithNavigation>
            {(navigate) => (
              <EcobankLoginPage
                navigate={navigate}
              />
            )}
          </PageWithNavigation>
        }
      />

      {/* =================================================
          ECOBANK CUSTOMER OVERVIEW
          ================================================= */}

      <Route
        path="/ecobank"
        element={
          <EcobankRoute>
            <PageWithNavigation>
              {(navigate) => (
                <CustomerOverviewPage
                  navigate={navigate}
                />
              )}
            </PageWithNavigation>
          </EcobankRoute>
        }
      />

      {/* =================================================
          ECOBANK CUSTOMER DETAIL
          ================================================= */}

      <Route
        path="/ecobank/customers/:customerId"
        element={
          <EcobankRoute>
            <CustomerDetailRoute />
          </EcobankRoute>
        }
      />

      {/* =================================================
          ECOBANK SUPPORTING EVIDENCE
          ================================================= */}

      <Route
        path="/ecobank/evidence/:customerId"
        element={
          <EcobankRoute>
            <SupportingEvidenceRoute />
          </EcobankRoute>
        }
      />

      {/* =================================================
          ECOBANK ASSESSMENT
          ================================================= */}

      <Route
        path="/ecobank/assessment/:customerId"
        element={
          <EcobankRoute>
            <RecommendationRoute />
          </EcobankRoute>
        }
      />

      {/* =================================================
          ECOBANK DECISION SUPPORT
          ================================================= */}

      <Route
        path="/ecobank/decision/:customerId"
        element={
          <EcobankRoute>
            <DecisionSupportRoute />
          </EcobankRoute>
        }
      />

      {/* =================================================
          UNKNOWN URL
          ================================================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
