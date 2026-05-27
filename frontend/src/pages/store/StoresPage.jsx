import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import "./StoresPage.css";

const API_BASE_URL = "http://localhost:3000";

function parseTags(value) {
  return String(value || "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

export default function StoresPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") || "";
  const tagsParam = searchParams.get("tags") || "";

  const selectedTags = useMemo(() => parseTags(tagsParam), [tagsParam]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/food-partner`, {
        params: {
          q: q || undefined,
          tags: selectedTags.length ? selectedTags.join(",") : undefined,
        },
      });
      setPartners(res.data.partners || []);
    } catch (e) {
      console.error("Failed to fetch stores:", e);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tagsParam]);

  const allTags = useMemo(() => {
    const set = new Set();
    for (const p of partners) {
      for (const t of p.tags || []) set.add(String(t));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [partners]);

  const onSearchChange = (e) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const value = e.target.value;
      if (value) next.set("q", value);
      else next.delete("q");
      return next;
    });
  };

  const toggleTag = (tag) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const current = new Set(parseTags(next.get("tags")));
      if (current.has(tag)) current.delete(tag);
      else current.add(tag);
      const arr = Array.from(current);
      if (arr.length) next.set("tags", arr.join(","));
      else next.delete("tags");
      return next;
    });
  };

  return (
    <div className="stores">
      <div className="stores__header">
        <h2 className="stores__title">Stores</h2>
        <div className="stores__search">
          <input
            value={q}
            onChange={onSearchChange}
            className="stores__searchInput"
            placeholder="Search restaurants…"
            aria-label="Search stores"
          />
        </div>
      </div>

      <div className="stores__tags">
        {allTags.length === 0 ? (
          <div className="stores__tagsEmpty">No tags yet</div>
        ) : (
          allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag ${selectedTags.includes(tag) ? "tag--active" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))
        )}
      </div>

      {loading ? (
        <div className="stores__state">Loading stores…</div>
      ) : partners.length === 0 ? (
        <div className="stores__state">No stores found.</div>
      ) : (
        <div className="stores__grid">
          {partners.map((p) => (
            <button
              type="button"
              key={p._id}
              className="card"
              onClick={() => navigate(`/store/${p._id}`)}
            >
              <div className="card__cover">
                <div className="card__logo">{(p.businessName || "S").slice(0, 1)}</div>
              </div>
              <div className="card__body">
                <div className="card__name">{p.businessName}</div>
                <div className="card__desc">{p.address}</div>
                <div className="card__tags">
                  {(p.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="card__tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

