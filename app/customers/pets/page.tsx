"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
const averageVisits = Math.round(
  clientProfiles.reduce((count, client) => count + client.stats.totalVisits, 0) / Math.max(totalClients, 1),
);
const newClients = clientProfiles.filter(client => client.stats.totalVisits <= 3).length;

const summaryMetrics = [
  {
    label: "Total Clients",
    value: totalClients.toString(),
    description: "Across every membership plan",
    className: "metrics-total",
  },
  {
    label: "Pets on File",
    value: totalPets.toString(),
    description: "Companions we care for",
    className: "metrics-active",
  },
  {
    label: "Avg Visits",
    value: averageVisits.toString(),
    description: "Per client lifetime",
    className: "metrics-onboarding",
  },
  {
    label: "New This Month",
    value: newClients.toString(),
    description: "Fresh faces joining the pack",
    className: "metrics-leave",
  },
];

export default function ClientsAndPetsPage() {
  const [query, setQuery] = useState("");

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

      <section className="panel compact-roster">
        <div className="roster-toolbar" role="search">
          <label className="compact-search">
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
          <button type="button" className="primary-button">
            Add Client
          </button>
        </div>

        <div className="client-compact-list" role="list">
          {filteredClients.map(({ client, displayPets }) => (
            <article key={client.id} role="listitem" className="client-compact-card">
              <div className="client-compact-header">
                <span className="avatar client-avatar" aria-hidden="true">
                  {getInitials(client.name)}
                </span>
                <div className="client-compact-copy">
                  <Link href={`/customers/${client.slug}`} className="client-compact-name">
                    {client.name}
                  </Link>
                  <p className="client-compact-meta">
                    {client.stats.totalVisits} visits • Member since {client.membershipSince}
                  </p>
                </div>
                <div className="client-compact-actions">
                  <span>{client.stats.lifetimeValue}</span>
                  <span className="client-compact-secondary">{client.stats.averageSpend} avg spend</span>
                </div>
              </div>

              <div className="client-compact-pets" aria-label={`Pets for ${client.name}`}>
                {displayPets.map(pet => (
                  <Link key={pet.id} href={`/customers/${client.slug}#${pet.id}`} className="pet-pill">
                    <span className="pet-pill-name">{pet.name}</span>
                    <span className="pet-pill-meta">{pet.plan}</span>
                  </Link>
                ))}
              </div>
            </article>
          ))}

          {filteredClients.length === 0 ? (
            <div className="empty-state">
              <p>No clients or pets match “{query}”.</p>
              <button type="button" className="link-button" onClick={() => setQuery("")}>
                Clear search
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
