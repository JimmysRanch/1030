import { serviceCatalog } from "../data";

export default function ServicesPage() {
  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Service catalog</h2>
            <p className="panel-subtitle">
              Services power availability, pricing, and duration estimates for every booking.
            </p>
          </div>
        </header>
        <div className="service-grid">
          {serviceCatalog.map(block => (
            <article key={block.category} className="service-card">
              <header>
                <h3>{block.category}</h3>
                <p>{block.description}</p>
              </header>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Service</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {block.services.map(service => (
                    <tr key={service.name}>
                      <td>{service.name}</td>
                      <td>{service.duration}</td>
                      <td>{service.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Booking guidance</h2>
            <p className="panel-subtitle">
              Clients see these notes on the service selection step before confirming their visit.
            </p>
          </div>
        </header>
        <ul className="guidance-list">
          <li>
            <h3>Weight limits</h3>
            <p>Full groom services accommodate dogs up to 95 lbs. Larger pups require a phone consult.</p>
          </li>
          <li>
            <h3>Matting policy</h3>
            <p>
              Severe matting requires a comfort shave with a $22 surcharge to ensure the coat can regrow
              safely.
            </p>
          </li>
          <li>
            <h3>New client intake</h3>
            <p>
              First-time visitors must select the Puppy Intro Bath or Small Breed Groom so we can assess
              coat texture and temperament.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
