import { getStaffPayroll, type StaffPayrollRow } from "../data";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatCurrency(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }
  return currencyFormatter.format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return dateFormatter.format(date);
}

function statusTone(status: string | null) {
  if (!status) {
    return "status-neutral";
  }
  const normalized = status.toLowerCase();
  if (normalized.includes("paid") || normalized.includes("processed")) {
    return "status-active";
  }
  if (normalized.includes("pending")) {
    return "status-onboarding";
  }
  if (normalized.includes("hold") || normalized.includes("issue")) {
    return "status-leave";
  }
  return "status-neutral";
}

function computeSummaries(rows: StaffPayrollRow[]) {
  let totalGross = 0;
  let totalTips = 0;
  let totalCommission = 0;

  for (const row of rows) {
    totalGross += row.grossPay ?? 0;
    totalTips += row.tips ?? 0;
    totalCommission += row.commission ?? 0;
  }

  return {
    totalGross,
    totalTips,
    totalCommission,
  };
}

export default async function Page() {
  const payroll = await getStaffPayroll();
  const summary = computeSummaries(payroll);

  return (
    <div className="stack gap-large">
      <section className="metrics-grid">
        <article className="metrics-card metrics-total">
          <header className="metrics-label">Gross payroll</header>
          <div className="metrics-value">{formatCurrency(summary.totalGross)}</div>
          <p className="metrics-description">Across the current data set</p>
        </article>
        <article className="metrics-card metrics-active">
          <header className="metrics-label">Tips</header>
          <div className="metrics-value">{formatCurrency(summary.totalTips)}</div>
          <p className="metrics-description">Cash + card gratuity</p>
        </article>
        <article className="metrics-card metrics-onboarding">
          <header className="metrics-label">Commission</header>
          <div className="metrics-value">{formatCurrency(summary.totalCommission)}</div>
          <p className="metrics-description">Service + retail incentives</p>
        </article>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Payroll runs</h2>
            <p className="panel-subtitle">
              {payroll.length ? `${payroll.length} records` : "No payroll data"}
            </p>
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Team member</th>
                <th scope="col">Pay period</th>
                <th scope="col">Hours</th>
                <th scope="col">Service revenue</th>
                <th scope="col">Commission</th>
                <th scope="col">Tips</th>
                <th scope="col">Gross pay</th>
                <th scope="col">Status</th>
                <th scope="col">Processed</th>
              </tr>
            </thead>
            <tbody>
              {payroll.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-empty">
                    Link Supabase payroll data to populate this table.
                  </td>
                </tr>
              ) : (
                payroll.map(row => <PayrollRow key={row.id} row={row} />)
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PayrollRow({ row }: { row: StaffPayrollRow }) {
  return (
    <tr>
      <td>{row.staffName}</td>
      <td>
        {formatDate(row.periodStart)} – {formatDate(row.periodEnd)}
      </td>
      <td>{row.hoursWorked ?? "—"}</td>
      <td>{formatCurrency(row.serviceRevenue)}</td>
      <td>{formatCurrency(row.commission)}</td>
      <td>{formatCurrency(row.tips)}</td>
      <td>{formatCurrency(row.grossPay)}</td>
      <td>
        <span className={`status-pill ${statusTone(row.status)}`}>
          {row.status ? row.status : "Pending"}
        </span>
      </td>
      <td>{formatDate(row.processedAt)}</td>
    </tr>
  );
}
