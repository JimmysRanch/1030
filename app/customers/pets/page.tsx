"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { clientProfiles } from "./data";

type Client = (typeof clientProfiles)[number];

type ClientWithPets = {
  client: Client;
  displayPets: Client["pets"];
};

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "";
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

const totalClients = clientProfiles.length;
const totalPets = clientProfiles.reduce((count, client) => count + client.pets.length, 0);
const newPetsThisMonth = clientProfiles.reduce(
  (count, client) => count + client.pets.filter(pet => pet.status === "New").length,
  0,
);

const topBreed = (() => {
  const breedFrequency = new Map<string, number>();

  clientProfiles.forEach(client => {
    client.pets.forEach(pet => {
      if (pet.species === "Dog") {
        breedFrequency.set(pet.breed, (breedFrequency.get(pet.breed) ?? 0) + 1);
      }
    });
  });

  let winningBreed: string | null = null;
  let winningCount = 0;

  breedFrequency.forEach((count, breed) => {
    if (count > winningCount) {
      winningBreed = breed;
      winningCount = count;
    }
  });

  return winningBreed ? { breed: winningBreed, count: winningCount } : null;
})();

const summaryMetrics = [
  {
    label: "Total Clients",
    value: totalClients.toString(),
    description: "Active members on your roster",
    className: "metrics-total",
  },
  {
    label: "Total Pets",
    value: totalPets.toString(),
    description: "Across every household",
    className: "metrics-active",
  },
  {
    label: "New Pets This Month",
    value: newPetsThisMonth.toString(),
    description: "Fresh faces in April",
    className: "metrics-onboarding",
  },
  {
    label: "Top Breed",
    value: topBreed?.breed ?? "No data",
    description:
      topBreed && topBreed.count > 0
        ? `${topBreed.count} recent appointments`
        : "Track popular visits at a glance",
    className: "metrics-leave",
  },
];

function ClientFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [petSections, setPetSections] = useState<number[]>([0]);

  useEffect(() => {
    if (open) {
      setPetSections([0]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleAddPet = () => {
    setPetSections(current => [...current, current.length]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-client-heading"
        className="dialog"
        onClick={event => event.stopPropagation()}
      >
        <header className="dialog-header">
          <h2 id="add-client-heading">Add Client</h2>
          <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>
        <form className="client-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h3>Client Information</h3>
            <div className="form-grid">
              <label>
                <span>First Name</span>
                <input placeholder="Enter first name" required />
              </label>
              <label>
                <span>Last Name</span>
                <input placeholder="Enter last name" required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" placeholder="client@example.com" required />
              </label>
              <label>
                <span>Phone Number</span>
                <input type="tel" placeholder="(555) 123-4567" />
              </label>
              <label className="form-span-2">
                <span>Street Address</span>
                <input placeholder="123 Main St" />
              </label>
              <label>
                <span>City</span>
                <input placeholder="City" />
              </label>
              <label>
                <span>State</span>
                <input placeholder="State" />
              </label>
              <label>
                <span>ZIP Code</span>
                <input placeholder="ZIP" />
              </label>
            </div>
          </section>

          {petSections.map(sectionId => (
            <section key={sectionId} className="form-section">
              <h3>Pet Information</h3>
              <div className="form-grid">
                <label>
                  <span>Pet Name</span>
                  <input placeholder="Enter name" required />
                </label>
                <label>
                  <span>Age</span>
                  <input placeholder="Enter age" />
                </label>
                <label>
                  <span>Weight Class</span>
                  <select defaultValue="">
                    <option value="" disabled>
                      Select weight class
                    </option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="giant">Giant</option>
                  </select>
                </label>
                <div className="form-field-group">
                  <span>Gender</span>
                  <div className="toggle-group">
                    <label>
                      <input type="radio" name={`pet-${sectionId}-gender`} value="female" />
                      <span>Female</span>
                    </label>
                    <label>
                      <input type="radio" name={`pet-${sectionId}-gender`} value="male" />
                      <span>Male</span>
                    </label>
                  </div>
                </div>
                <label>
                  <span>Breed</span>
                  <input placeholder="Enter breed" />
                </label>
                <div className="form-field-group">
                  <span>Mixed Breed</span>
                  <div className="toggle-group">
                    <label>
                      <input type="radio" name={`pet-${sectionId}-mixed`} value="yes" />
                      <span>Yes</span>
                    </label>
                    <label>
                      <input type="radio" name={`pet-${sectionId}-mixed`} value="no" defaultChecked />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <label className="form-span-2">
                  <span>Medical, Allergies, and Behavior Information</span>
                  <textarea placeholder="Special instructions, temperament, etc." rows={4} />
                </label>
              </div>
            </section>
          ))}

          <footer className="form-footer">
            <button type="button" className="secondary-button" onClick={handleAddPet}>
              Add Pet
            </button>
            <div className="form-footer-actions">
              <button type="button" className="link-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Add Client
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default function ClientsAndPetsPage() {
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const filteredClients = useMemo<ClientWithPets[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return clientProfiles.map(client => ({
        client,
        displayPets: client.pets,
      }));
    }

    return clientProfiles
      .map<ClientWithPets | null>(client => {
        const matchesClient = client.name.toLowerCase().includes(normalizedQuery);
        const matchingPets = client.pets.filter(pet => pet.name.toLowerCase().includes(normalizedQuery));

        if (!matchesClient && matchingPets.length === 0) {
          return null;
        }

        return {
          client,
          displayPets: matchingPets.length > 0 ? matchingPets : client.pets,
        };
      })
      .filter((entry): entry is ClientWithPets => entry !== null);
  }, [query]);

  return (
    <>
      <ClientFormDialog open={formOpen} onClose={() => setFormOpen(false)} />
      <div className="page-stack gap-large">
        <section className="metrics-grid" aria-label="Client and pet summary metrics">
          {summaryMetrics.map(metric => (
            <article key={metric.label} className={`metrics-card ${metric.className ?? ""}`.trim()}>
              <span className="metrics-label">{metric.label}</span>
              <strong className="metrics-value">{metric.value}</strong>
              <p className="metrics-description">{metric.description}</p>
            </article>
          ))}
        </section>

        <section className="panel client-roster">
          <div className="roster-toolbar" role="search">
            <label className="compact-search client-search">
              <span className="sr-only">Search clients and pets</span>
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search clients or pets"
                aria-label="Search clients and pets"
              />
              {query ? (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              ) : null}
            </label>
            <button type="button" className="primary-button" onClick={() => setFormOpen(true)}>
              Add Client
            </button>
          </div>

          <ul className="client-roster-list" role="list">
            {filteredClients.map(({ client, displayPets }) => (
              <li key={client.id} className="client-roster-item">
                <div className="client-row">
                  <div className="client-row-primary">
                    <span className="avatar client-avatar" aria-hidden="true">
                      {getInitials(client.name)}
                    </span>
                    <div className="client-row-copy">
                      <Link href={`/customers/${client.slug}`} className="client-row-name">
                        {client.name}
                      </Link>
                      <p className="client-row-meta">
                        {client.stats.totalVisits} visits • Member since {client.membershipSince}
                      </p>
                    </div>
                  </div>
                  <div className="client-row-financials">
                    <span className="client-row-value">{client.stats.lifetimeValue}</span>
                    <span className="client-row-sub">Avg {client.stats.averageSpend}</span>
                  </div>
                </div>
                <div className="client-row-pets" aria-label={`Pets for ${client.name}`}>
                  {displayPets.map(pet => (
                    <Link key={pet.id} href={`/customers/${client.slug}#${pet.id}`} className="pet-chip">
                      <span className="pet-chip-name">{pet.name}</span>
                      <span className="pet-chip-meta">{pet.plan}</span>
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          {filteredClients.length === 0 ? (
            <div className="empty-state">
              <p>No clients or pets match “{query}”.</p>
              <button type="button" className="link-button" onClick={() => setQuery("")}>
                Clear search
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
