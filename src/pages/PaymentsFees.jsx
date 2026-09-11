import { useState } from "react";
import { useHub } from "../hooks/useHub";
import { FEE_DATA } from "../data/licensingFees";
import { requirementCategories } from "../services/hubStore";
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
  return (
    <>
      <PageHeading title="Payments & Fees">
        Review shared fee estimates and prototype payment records. No real
        invoice is issued and no money is collected.
      </PageHeading>
      <div className="grid gap-5 lg:grid-cols-2">
        {["Outstanding", "Paid"].map((status) => (
          <Panel
            key={status}
            title={status === "Paid" ? "Paid fees" : "Outstanding fees"}
          >
            {data.payments
              .filter((item) => item.status === status)
              .map((item) => {
                const [category, key] = item.feeKey.split(".");
                const fee = FEE_DATA[category]?.[key];
                return (
                  <div key={item.id} className="mb-4 rounded-lg border p-4">
                    <h3 className="font-bold">
                      {fee?.label || "Fee unavailable"}
                    </h3>
                    <p className="my-2 text-xl font-extrabold text-primary">
                      {fee?.display || "Confirm current schedule"}
                    </p>
                    <Status>{status}</Status>
                    <p className="mt-2 text-xs text-slate-500">
                      {item.applicationId} • Prototype payment
                      {status === "Paid" && (
                        <>
                          {" "}
                          • <DateText value={item.paidAt} />
                        </>
                      )}
                    </p>
                    {status === "Outstanding" && (
                      <button
                        onClick={() => setConfirm(item.id)}
                        className="mt-3 text-sm font-bold text-primary"
                      >
                        Simulate payment →
                      </button>
                    )}
                  </div>
                );
              })}
            {!data.payments.some((item) => item.status === status) && (
              <Empty>No {status.toLowerCase()} payment records.</Empty>
            )}
          </Panel>
        ))}
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
                if (
                  update((state) => ({
                    ...state,
                    payments: state.payments.map((item) =>
                      item.id === confirm
                        ? {
                            ...item,
                            status: "Paid",
                            paidAt: new Date().toISOString(),
                          }
                        : item,
                    ),
                  }))
                )
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
