import { billing } from "../data";

function usagePercent(used: number, limit: number) {
  if (limit === 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export default function BillingPage() {
  const storagePercent = usagePercent(billing.usage.storage.used, billing.usage.storage.limit);
  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Plan</h2>
            <p className="panel-subtitle">Studio Plus keeps high-volume grooming studios on schedule.</p>
          </div>
          <span className="status-pill status-active">Renews {billing.plan.renewalDate}</span>
        </header>
        <div className="plan-grid">
          <div>
            <span className="settings-label">Current plan</span>
            <span className="settings-value">{billing.plan.name}</span>
            <span className="settings-note">{billing.plan.price}</span>
          </div>
          <div>
            <span className="settings-label">Seats</span>
            <span className="settings-value">{billing.plan.seats}</span>
          </div>
        </div>
        <ul className="plan-features">
          {billing.plan.features.map(feature => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Payment method</h2>
            <p className="panel-subtitle">Charged on the first of each month at 9:00 AM PT.</p>
          </div>
        </header>
        <div className="payment-method">
          <div>
            <span className="settings-label">Card on file</span>
            <span className="settings-value">{billing.paymentMethod.brand} •••• {billing.paymentMethod.last4}</span>
          </div>
          <div>
            <span className="settings-label">Expires</span>
            <span className="settings-value">{billing.paymentMethod.exp}</span>
          </div>
          <div>
            <span className="settings-label">Billing email</span>
            <span className="settings-value">{billing.paymentMethod.billingEmail}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Usage</h2>
            <p className="panel-subtitle">Monitor usage so the team knows when to purchase add-ons.</p>
          </div>
        </header>
        <div className="usage-grid">
          <div>
            <span className="settings-label">Appointments</span>
            <div className="usage-meter">
              <div className="usage-bar" style={{ width: `${usagePercent(billing.usage.appointments.used, billing.usage.appointments.limit)}%` }} />
            </div>
            <span className="settings-note">
              {billing.usage.appointments.used} of {billing.usage.appointments.limit} {billing.usage.appointments.label}
            </span>
          </div>
          <div>
            <span className="settings-label">SMS credits</span>
            <div className="usage-meter">
              <div className="usage-bar" style={{ width: `${usagePercent(billing.usage.smsCredits.used, billing.usage.smsCredits.limit)}%` }} />
            </div>
            <span className="settings-note">
              {billing.usage.smsCredits.used} of {billing.usage.smsCredits.limit} {billing.usage.smsCredits.label}
            </span>
          </div>
          <div>
            <span className="settings-label">Media storage</span>
            <div className="usage-meter">
              <div className="usage-bar" style={{ width: `${storagePercent}%` }} />
            </div>
            <span className="settings-note">
              {`${billing.usage.storage.used} ${billing.usage.storage.unit} of ${billing.usage.storage.limit} ${billing.usage.storage.unit}`}
            </span>
          </div>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Invoices</h2>
            <p className="panel-subtitle">Downloadable receipts for bookkeeping and accountants.</p>
          </div>
        </header>
        <div className="settings-table settings-table-four">
          <div className="settings-table-head">
            <span>Invoice</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {billing.invoices.map(invoice => (
            <div key={invoice.id} className="settings-table-row">
              <div>
                <span className="settings-value">{invoice.id}</span>
              </div>
              <div>
                <span className="settings-value">{invoice.date}</span>
              </div>
              <div>
                <span className="settings-value">{invoice.amount}</span>
              </div>
              <div>
                <span className="status-pill status-active">{invoice.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
