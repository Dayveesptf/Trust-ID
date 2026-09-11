import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Search,
  Users,
  RefreshCw,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  Avatar,
} from "../components/ui";
import { BankLayout } from "../components/Layout";

import {
  EcobankCustomerListItem,
  getEcobankCustomers,
} from "../services/ecobankService";

interface CustomerOverviewPageProps {
  navigate: (
    screen: string,
    params?: { customerId?: string }
  ) => void;
}

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

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CustomerOverviewPage({
  navigate,
}: CustomerOverviewPageProps) {
  const [customers, setCustomers] = useState<EcobankCustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const data = await getEcobankCustomers();
      setCustomers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customer information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) => {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();

      return (
        fullName.includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  const scoredCustomers = customers.filter(
    (customer) => customer.trustProfile !== null
  );

  const averageScore =
    scoredCustomers.length > 0
      ? Math.round(
          scoredCustomers.reduce(
            (sum, customer) =>
              sum + (customer.trustProfile?.score || 0),
            0
          ) / scoredCustomers.length
        )
      : 0;

  const strongCustomers = scoredCustomers.filter(
    (customer) => (customer.trustProfile?.score || 0) >= 700
  ).length;

  return (
    <BankLayout current="customer-overview" navigate={navigate}>
      <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header */}
      <div className="border-b border-[#E2EAF2] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#2563A0]">
                Ecobank Decision Support
              </p>

              <h1 className="mt-1 text-2xl font-bold text-[#0D2D52]">
                Customer Overview
              </h1>

              <p className="mt-1 text-sm text-[#64748B]">
                Review TrustID customer profiles and financial behaviour.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={loadCustomers}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2F8]">
                <Users size={20} className="text-[#0D2D52]" />
              </div>

              <div>
                <p className="text-sm text-[#64748B]">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-[#0D2D52]">
                  {loading ? "—" : customers.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-[#64748B]">
              Average Trust Score
            </p>

            <p className="mt-1 text-2xl font-bold text-[#0D2D52]">
              {loading ? "—" : `${averageScore} / 850`}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-[#64748B]">
              Strong / Excellent Profiles
            </p>

            <p className="mt-1 text-2xl font-bold text-[#0D2D52]">
              {loading ? "—" : strongCustomers}
            </p>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6 p-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers by name, email or phone..."
              className="w-full rounded-xl border border-[#D7E1EA] bg-white py-3 pl-10 pr-4 text-sm text-[#0D2D52] outline-none transition focus:border-[#2563A0] focus:ring-2 focus:ring-[#2563A0]/10"
            />
          </div>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-6 border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-700">
              Unable to load customers
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <Button
              className="mt-4"
              variant="secondary"
              onClick={loadCustomers}
            >
              Try Again
            </Button>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="p-5">
                <div className="animate-pulse">
                  <div className="h-5 w-48 rounded bg-[#E2EAF2]" />
                  <div className="mt-3 h-4 w-64 rounded bg-[#E2EAF2]" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredCustomers.length === 0 && (
            <Card className="p-10 text-center">
              <Users
                size={36}
                className="mx-auto text-[#94A3B8]"
              />

              <h3 className="mt-4 font-semibold text-[#0D2D52]">
                No customers found
              </h3>

              <p className="mt-1 text-sm text-[#64748B]">
                {search
                  ? "Try a different search term."
                  : "There are currently no TrustID customers to review."}
              </p>
            </Card>
          )}

        {/* Customer table */}
        {!loading &&
          filteredCustomers.length > 0 && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#E2EAF2] bg-[#F8FAFB] text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        Trust Score
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        Profile
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        Joined
                      </th>

                      <th className="px-6 py-4" />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.map((customer) => {
                      const profile = customer.trustProfile;

                      return (
                        <tr
                          key={customer._id}
                          className="border-b border-[#E2EAF2] last:border-0 hover:bg-[#FAFCFD]"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <Avatar
                                initials={getInitials(
                                  customer.firstName,
                                  customer.lastName
                                )}
                              />

                              <div>
                                <p className="font-semibold text-[#0D2D52]">
                                  {customer.firstName}{" "}
                                  {customer.lastName}
                                </p>

                                <p className="text-xs text-[#64748B]">
                                  ID: {customer._id.slice(-8)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <p className="text-sm text-[#334155]">
                              {customer.email}
                            </p>

                            <p className="mt-1 text-xs text-[#64748B]">
                              {customer.phone}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            {profile ? (
                              <p className="font-bold text-[#0D2D52]">
                                {profile.score}
                                <span className="ml-1 text-xs font-normal text-[#94A3B8]">
                                  / 850
                                </span>
                              </p>
                            ) : (
                              <span className="text-sm text-[#94A3B8]">
                                Not available
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            {profile ? (
                              <Badge
                                variant={getBandVariant(profile.band)}
                              >
                                {profile.band}
                              </Badge>
                            ) : (
                              <Badge variant="neutral">
                                Not analysed
                              </Badge>
                            )}
                          </td>

                          <td className="px-6 py-5 text-sm text-[#64748B]">
                            {formatDate(customer.createdAt)}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <Button
                              variant="ghost"
                              onClick={() =>
                                navigate("customer-detail", {
                                  customerId: customer._id,
                                })
                              }
                            >
                              View Profile
                              <ArrowRight size={16} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        {/* Decision notice */}
        <p className="mt-6 text-center text-xs leading-5 text-[#94A3B8]">
          TrustID provides decision-support information based on
          simulated financial behaviour data. Ecobank retains full
          responsibility for lending decisions.
        </p>
      </main>
    </div>
  </BankLayout>
  );
}
