import { useState } from "react";
import { Link } from "react-router-dom";
import { useHub } from "../hooks/useHub";
import { requirementCategories } from "../services/hubStore";
import {
  paymentFee,
  paymentRequired,
  dashboardCounts,
} from "../services/customerSelectors";
import { simulatePayment } from "../services/customerActions";
import { formatNZD } from "../utils/formatNZD";
import EstimatedFees from "../components/EstimatedFees";
import {
  PageHeading,
  Panel,
  Empty,
  DateText,
  Status,
} from "../components/HubUI";
export default function PaymentsFees() {
  const { data, update } = useHub();
  const [confirm, setConfirm] = useState(null);
  const categories = requirementCategories(data);
  const counts = dashboardCounts(data);
  return (
    <>
      <PageHeading title="Payments & Fees">
        Review shared fee estimates and prototype payment records. No real
        invoice is issued and no money is collected.
      </PageHeading>
      <Panel title="Outstanding total" className="mb-5">
        <strong className="text-2xl text-primary">
          {formatNZD(counts.outstanding)}
        </strong>
        <p className="mt-2 text-sm text-slate-600">
          Known payment-required amounts only.{" "}
          {counts.unassessed > 0
            ? `${counts.unassessed} fee(s) still need assessment and are excluded.`
            : "No fees awaiting assessment."}
        </p>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-2">
        {["Payment required", "Paid", "Pending assessment", "Refunded"].map(
          (status) => {
            const items = data.payments.filter((item) =>
              status === "Payment required"
                ? paymentRequired(item)
                : item.status === status,
            );
            return (
              <Panel
                key={status}
                title={
                  status === "Payment required"
                    ? "Outstanding fees"
                    : status === "Paid"
                      ? "Paid fees"
                      : status
                }
              >
                {items.length ? (
                  items.map((item) => {
                    const fee = paymentFee(item);
                    return (
                      <div key={item.id} className="mb-4 rounded-lg border p-4">
                        <h3 className="font-bold">{fee.label}</h3>
                        <p className="my-2 text-xl font-extrabold text-primary">
                          {fee.display}
                        </p>
                        <Status>{status}</Status>
                        <p className="mt-2 text-xs text-slate-500">
                          {item.id} • Prototype payment{" "}
                          {item.paidAt && (
                            <>
                              {" "}
                              • <DateText value={item.paidAt} />
                            </>
                          )}
                        </p>
                        {item.applicationId && (
                          <Link
                            to={`/my-applications/${item.applicationId}`}
                            className="mt-2 block text-sm text-primary"
                          >
                            View application {item.applicationId} →
                          </Link>
                        )}
                        {paymentRequired(item) && fee.amount !== null && (
                          <button
                            onClick={() => setConfirm(item.id)}
                            className="mt-3 text-sm font-bold text-primary"
                          >
                            Simulate payment →
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <Empty>No {status.toLowerCase()} payment records.</Empty>
                )}
              </Panel>
            );
          },
        )}
      </div>
      {confirm && (
        <Panel title="Simulate payment?" className="mt-5">
          <p className="text-sm text-slate-600">
            This changes the local prototype record to Paid. It does not charge
            a card or pay council.
          </p>
          <div className="mt-4 flex gap-4">
            <button
              className="rounded-lg bg-primary px-4 py-2 text-white"
              onClick={() => {
                if (update((state) => simulatePayment(state, confirm)))
                  setConfirm(null);
              }}
            >
              Confirm simulation
            </button>
            <button onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </Panel>
      )}
      <h2 className="mt-7 text-xl font-bold">Estimated upcoming charges</h2>
      <EstimatedFees
        food={categories.includes("food")}
        alcohol={categories.includes("alcohol")}
        outdoor={categories.includes("outdoor")}
        specialLicence={data.requirements?.specialLicence}
      />
    </>
  );
}
