"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";

import { clientProfiles } from "./data";

type Client = (typeof clientProfiles)[number];

type ClientWithPets = {
  client: Client;
  displayPets: Client["pets"];
};

function ClientFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [petSections, setPetSections] = useState<number[]>([0]);
  const [referralSource, setReferralSource] = useState<string>("");
  const [referralOther, setReferralOther] = useState<string>("");

  useEffect(() => {
    if (open) {
      setPetSections([0]);
      setReferralSource("");
      setReferralOther("");
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
        aria-labelledby="new-client-heading"
        className="dialog"
        onClick={event => event.stopPropagation()}
      >
        <header className="dialog-header">
          <h2 id="new-client-heading">New Client</h2>
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
            </div>
            <div className="form-grid address-grid">
              <label>
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
            <div className="form-grid">
              <label className="form-span-2 referral-group">
                <span>How did you hear about us?</span>
                <select
                  value={referralSource}
                  onChange={event => {
                    const value = event.target.value;
                    setReferralSource(value);
                    if (value !== "other") {
                      setReferralOther("");
                    }
                  }}
                  required
                >
                  <option value="" disabled hidden>
                    Select a source
                  </option>
                  <option value="facebook">Facebook</option>
                  <option value="google">Google</option>
                  <option value="nextdoor">Nextdoor</option>
                  <option value="friend">A friend</option>
                  <option value="other">Other</option>
                </select>
              </label>
              {referralSource === "other" ? (
                <label className="form-span-2 referral-other">
                  <span>Tell us more</span>
                  <input
                    placeholder="Let us know where you heard about us"
                    value={referralOther}
                    onChange={event => setReferralOther(event.target.value)}
                    required
                  />
                </label>
              ) : null}
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
                <label>
                  <span>Gender</span>
                  <select defaultValue="">
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </label>
                <label>
                  <span>Breed</span>
                  <input placeholder="Enter breed" />
                </label>
                <label>
                  <span>Mixed Breed</span>
                  <select defaultValue="">
                    <option value="" disabled>
                      Select option
                    </option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="form-span-2">
                  <span>Medical, Allergies, and Behavior Information</span>
                  <textarea placeholder="Special instructions, temperament, etc." rows={4} />
                </label>
              </div>
            </section>
          ))}

          <footer className="form-footer">
            <button type="button" className="secondary-button" onClick={handleAddPet}>
              Add Additional Pet
            </button>
            <div className="form-footer-actions">
              <button type="button" className="link-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Create New Client
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
  const router = useRouter();

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
              New Client
            </button>
          </div>

          <ul className="client-roster-list" role="list">
            {filteredClients.map(({ client, displayPets }) => (
              <li
                key={client.id}
                className="client-roster-item"
                role="button"
                tabIndex={0}
                aria-label={`View ${client.name} profile`}
                onClick={() => router.push(`/customers/${client.slug}`)}
                onKeyDown={(event: ReactKeyboardEvent<HTMLLIElement>) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/customers/${client.slug}`);
                  }
                }}
              >
                <div className="client-row">
                  <div className="client-row-primary">
                    <div className="client-row-copy">
                      <span className="client-row-name">{client.name}</span>
                      <p className="client-row-meta">
                        {client.stats.totalVisits} visits • Member since {client.membershipSince}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="client-row-pets" aria-label={`Pets for ${client.name}`}>
                  {displayPets.map(pet => (
                    <Link
                      key={pet.id}
                      href={`/customers/${client.slug}#${pet.id}`}
                      className="pet-chip"
                      onClick={event => event.stopPropagation()}
                    >
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
