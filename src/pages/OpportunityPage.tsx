import { useEffect, useState } from "react";
import { CustomerLayout } from "../components/Layout";
import {
  Badge,
  Button,
  Card,
} from "../components/ui";
import {
  getEcobankOpportunities,
  EcobankOpportunity,
} from "../services/ecobankService";
import {
  getTrustProfile,
  TrustProfile,
} from "../services/financialProfileService";

function getBandVariant(
  band: string
): "success" | "good" | "fair" | "warning" | "info" | "neutral" {
  switch (band) {
    case "Excellent":
      return "success";
    case "Strong":
      return "good";
    case "Good":
      return "good";
    case "Fair":
      return "fair";
    case "Developing":
      return "warning";
    case "Needs Improvement":
      return "neutral";
    default:
      return "neutral";
  }
}

function getCategoryIcon(category: string): string {
  const value = category.toLowerCase();

  if (value.includes("loan") || value.includes("credit")) {
    return "💳";
  }

  if (value.includes("saving")) {
    return "💰";
  }

  if (value.includes("business")) {
    return "🏪";
  }

  if (value.includes("account")) {
    return "🏦";
  }

  if (value.includes("investment")) {
    return "📈";
  }

  return "✨";
}

export default function OpportunityPage({
  navigate,
}: {
  navigate: (page: string) => void;
}) {
  const [profile, setProfile] = useState<TrustProfile | null>(
    null
  );

  const [opportunities, setOpportunities] = useState<
    EcobankOpportunity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOpportunities() {
      try {
        setLoading(true);
        setError("");

        const [trustProfile, ecobankOpportunities] =
          await Promise.all([
            getTrustProfile(),
            getEcobankOpportunities(),
          ]);

        setProfile(trustProfile);
        setOpportunities(ecobankOpportunities);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Ecobank opportunities."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOpportunities();
  }, []);

  if (loading) {
    return (
      <CustomerLayout current="opportunity" navigate={navigate}>
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-72 bg-slate-200 rounded" />
            <div className="h-4 w-96 bg-slate-200 rounded" />

            <div className="h-36 bg-slate-200 rounded-2xl" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="h-64 bg-slate-200 rounded-2xl" />
              <div className="h-64 bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout current="opportunity" navigate={navigate}>
        <div className="p-6 lg:p-10 max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E8F0F7] flex items-center justify-center mx-auto mb-4 text-2xl">
              🏦
            </div>

            <h1 className="text-xl font-semibold text-[#0D2D52] mb-2">
              Ecobank Opportunities
            </h1>

            <p className="text-sm text-slate-500 mb-6">
              {error}
            </p>

            <Button
              onClick={() => navigate("dashboard")}
            >
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout current="opportunity" navigate={navigate}>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-[#2563A0] mb-2">
            Ecobank Opportunities
          </p>

          <h1 className="text-2xl lg:text-3xl font-bold text-[#0D2D52]">
            Opportunities matched to your profile
          </h1>

          <p className="text-slate-500 mt-2 max-w-2xl">
            Explore financial opportunities that may be relevant
            to your current Trust Profile.
          </p>
        </div>

        {/* Trust Profile Summary */}
        {profile && (
          <Card className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-2">
                  Your current Trust Profile
                </p>

                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-[#0D2D52]">
                    {profile.totalScore}
                  </span>

                  <span className="text-slate-400 mb-1">
                    / 850
                  </span>

                  <Badge
                    variant={getBandVariant(profile.band)}
                    size="md"
                  >
                    {profile.band}
                  </Badge>
                </div>
              </div>

              <div className="max-w-md">
                <p className="text-sm text-slate-600 leading-6">
                  Your Trust Profile helps provide context around
                  your financial behaviour. It does not guarantee
                  approval for any banking product.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Opportunities */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-[#0D2D52]">
              Recommended opportunities
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              These opportunities are presented based on the
              information available in your Trust Profile.
            </p>
          </div>

          {opportunities.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-3xl mb-3">
                🏦
              </div>

              <h3 className="font-semibold text-[#0D2D52] mb-2">
                No opportunities available yet
              </h3>

              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                Continue building your financial profile and check
                back later for relevant opportunities.
              </p>

              <div className="mt-6">
                <Button
                  onClick={() =>
                    navigate("financial-growth")
                  }
                >
                  Improve My Profile
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {opportunities.map((opportunity) => (
                <Card
                  key={opportunity.id}
                  className="p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EAF1F7] flex items-center justify-center text-2xl shrink-0">
                        {getCategoryIcon(
                          opportunity.category
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#2563A0] mb-1">
                          {opportunity.category}
                        </p>

                        <h3 className="text-lg font-semibold text-[#0D2D52]">
                          {opportunity.title}
                        </h3>
                      </div>
                    </div>

                    {opportunity.badge && (
                      <Badge variant="info">
                        {opportunity.badge}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 leading-6 mb-6">
                    {opportunity.description}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        Why it may be relevant
                      </p>

                      <p className="text-sm text-slate-600 leading-6">
                        {opportunity.relevance}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        Eligibility
                      </p>

                      <p className="text-sm text-slate-600 leading-6">
                        {opportunity.eligibility}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                      Final eligibility and approval are determined
                      by Ecobank.
                    </p>

                    <Button
                      onClick={() => {
                        if (opportunity.action) {
                          window.open(
                            opportunity.action,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Responsible Lending Message */}
        <Card className="p-6 lg:p-8 bg-[#F4F8FB]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
              ℹ️
            </div>

            <div>
              <h3 className="font-semibold text-[#0D2D52] mb-2">
                A Trust Profile is not a loan approval
              </h3>

              <p className="text-sm text-slate-600 leading-6">
                TrustID provides an explainable view of financial
                behaviour to help users understand their financial
                credibility. Any product eligibility, credit
                assessment or lending decision remains with
                Ecobank and is subject to its applicable criteria.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </CustomerLayout>
  );
}