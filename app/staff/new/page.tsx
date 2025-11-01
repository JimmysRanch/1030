import Link from "next/link";

const positions = [
  "Groomer",
  "Bather",
  "Front desk",
  "Trainer",
  "Manager",
];

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const statuses = ["Active", "Inactive", "On leave", "Training"];

export default function NewStaffPage() {
  return (
    <div className="stack gap-large">
      <section className="panel form-panel">
        <header className="form-header">
          <div>
            <h1 className="form-title">Add New Staff Member</h1>
            <p className="form-subtitle">Enter the details for this new team member.</p>
          </div>
          <Link href="/staff" className="button button-ghost">
            Back to list
          </Link>
        </header>
        <form className="form-body">
          <section className="form-section">
            <header className="form-section-header">
              <h2>Basic information</h2>
              <p>Capture the essentials so this team member can be scheduled and contacted.</p>
            </header>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="firstName">First name</label>
                <input id="firstName" name="firstName" type="text" placeholder="Jordan" />
              </div>
              <div className="form-field">
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" name="lastName" type="text" placeholder="Dean" />
              </div>
              <div className="form-field">
                <label htmlFor="position">Position</label>
                <select id="position" name="position" defaultValue="">
                  <option value="" disabled>
                    Select a position
                  </option>
                  {positions.map(position => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue="Active">
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="jordan@example.com" />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" placeholder="(512) 555-0199" />
              </div>
              <div className="form-field">
                <label htmlFor="address">Street address</label>
                <input id="address" name="address" type="text" placeholder="123 Market Street" />
              </div>
              <div className="form-field">
                <label htmlFor="city">City</label>
                <input id="city" name="city" type="text" placeholder="Austin" />
              </div>
              <div className="form-field">
                <label htmlFor="state">State</label>
                <select id="state" name="state" defaultValue="Texas">
                  {states.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="zip">Zip code</label>
                <input id="zip" name="zip" type="text" placeholder="73301" />
              </div>
            </div>
            <div className="form-field form-field-full">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Add context about certifications, specialties, or scheduling preferences."
              />
            </div>
          </section>

          <div className="toggle">
            <div className="toggle-copy">
              <span className="toggle-label">Booking availability</span>
              <span className="toggle-description">Allow this staff member to be booked for appointments.</span>
            </div>
            <label className="toggle-switch">
              <input id="booking" name="booking" type="checkbox" defaultChecked />
              <span className="toggle-slider" aria-hidden="true" />
            </label>
          </div>

          <section className="form-section">
            <header className="form-section-header">
              <h2>Compensation</h2>
              <p>Configure how this staff member earns and receives payouts.</p>
            </header>
            <div className="form-stack">
              <div className="form-row">
                <div className="form-row-main">
                  <div className="form-row-copy">
                    <h3>Commission on personal grooms</h3>
                    <p>Pay this team member when their personal clientele returns.</p>
                  </div>
                  <div className="form-row-actions">
                    <label className="toggle-switch">
                      <input id="personalCommission" name="personalCommission" type="checkbox" defaultChecked />
                      <span className="toggle-slider" aria-hidden="true" />
                    </label>
                    <div className="form-field form-field-inline">
                      <label htmlFor="personalRate">Rate</label>
                      <input id="personalRate" name="personalRate" type="number" min="0" max="100" step="1" placeholder="35" />
                      <span className="form-field-suffix">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-row-main">
                  <div className="form-row-copy">
                    <h3>Hourly pay</h3>
                    <p>Compensate for time spent on-site or assisting other groomers.</p>
                  </div>
                  <div className="form-row-actions">
                    <label className="toggle-switch">
                      <input id="hourlyPay" name="hourlyPay" type="checkbox" defaultChecked />
                      <span className="toggle-slider" aria-hidden="true" />
                    </label>
                    <div className="form-field form-field-inline">
                      <label htmlFor="hourlyRate">Rate</label>
                      <input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="22.50"
                      />
                      <span className="form-field-suffix">/hr</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-row-main">
                  <div className="form-row-copy">
                    <h3>Salary</h3>
                    <p>Provide a fixed monthly amount for leadership roles or managers.</p>
                  </div>
                  <div className="form-row-actions">
                    <label className="toggle-switch">
                      <input id="salary" name="salary" type="checkbox" />
                      <span className="toggle-slider" aria-hidden="true" />
                    </label>
                    <div className="form-field form-field-inline">
                      <label htmlFor="salaryAmount">Amount</label>
                      <input id="salaryAmount" name="salaryAmount" type="number" min="0" step="100" placeholder="4000" />
                      <span className="form-field-suffix">/mo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-row-main">
                  <div className="form-row-copy">
                    <h3>Weekly guarantee vs. commission</h3>
                    <p>The higher value wins: guarantee the commission or whichever amount is higher.</p>
                  </div>
                  <div className="form-row-actions">
                    <label className="toggle-switch">
                      <input id="weeklyGuarantee" name="weeklyGuarantee" type="checkbox" />
                      <span className="toggle-slider" aria-hidden="true" />
                    </label>
                    <div className="form-field form-field-inline">
                      <label htmlFor="weeklyGuaranteeAmount">Guarantee</label>
                      <input
                        id="weeklyGuaranteeAmount"
                        name="weeklyGuaranteeAmount"
                        type="number"
                        min="0"
                        step="10"
                        placeholder="900"
                      />
                      <span className="form-field-suffix">/wk</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-row-main">
                  <div className="form-row-copy">
                    <h3>Team overrides</h3>
                    <p>Earn additional commission when the team hits location goals.</p>
                  </div>
                  <div className="form-row-actions">
                    <label className="toggle-switch">
                      <input id="teamOverrides" name="teamOverrides" type="checkbox" />
                      <span className="toggle-slider" aria-hidden="true" />
                    </label>
                    <div className="form-field form-field-inline">
                      <label htmlFor="teamOverrideRate">Rate</label>
                      <input
                        id="teamOverrideRate"
                        name="teamOverrideRate"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        placeholder="5"
                      />
                      <span className="form-field-suffix">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="form-section">
            <header className="form-section-header">
              <h2>Pay summary</h2>
              <p>Review a quick snapshot of how this team member will be paid.</p>
            </header>
            <div className="summary-grid">
              <article className="summary-card">
                <h3>Commission</h3>
                <p>Personal clientele commission is set to 35% with team overrides disabled.</p>
              </article>
              <article className="summary-card">
                <h3>Hourly</h3>
                <p>Hourly rate is set to $22.50 for eligible shifts and tasks.</p>
              </article>
              <article className="summary-card">
                <h3>Guarantee</h3>
                <p>Weekly guarantee is currently turned off. Enable it to add a safety net.</p>
              </article>
            </div>
          </section>

          <footer className="form-footer">
            <Link href="/staff" className="button button-ghost">
              Cancel
            </Link>
            <button type="submit" className="button button-primary">
              Add staff member
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
