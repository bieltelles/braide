"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { MapPin, Plus, Loader2, Trash2, Pencil, Building2, Tag, Flag, Phone, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationItem {
  id: string;
  name: string;
  address: string;
  cityId: string;
  city: { id: string; name: string } | null;
  latitude: number;
  longitude: number;
  type: string;
  phone: string | null;
  openHours: string | null;
  isActive: boolean;
}

interface CityOption {
  id: string;
  name: string;
}

const typeLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  comite: { label: "Comitê", icon: Building2, color: "bg-primary/10 text-primary" },
  adesivo: { label: "Ponto de Adesivo", icon: Tag, color: "bg-accent/10 text-accent-dark" },
  bandeira: { label: "Ponto de Bandeira", icon: Flag, color: "bg-success/10 text-success" },
};

const emptyForm = { name: "", address: "", cityId: "", type: "", phone: "", openHours: "" };

export default function AdminPontosDeApoio() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [cities, setCities] = useState<CityOption[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citySearch, setCitySearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchLocations = useCallback(() => {
    fetch("/api/locations?admin=true")
      .then((r) => r.json())
      .then((data) => { if (data.locations) setLocations(data.locations); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchLocations(); }, [fetchLocations]);

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then((data) => { if (data.cities?.length) setCities(data.cities); })
      .catch(() => {})
      .finally(() => setCitiesLoading(false));
  }, []);

  const filteredCities = citySearch
    ? cities.filter((c) => c.name.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 15)
    : cities.slice(0, 15);

  const selectedCityName = cities.find((c) => c.id === form.cityId)?.name || "";

  const resetForm = () => {
    setForm(emptyForm);
    setCitySearch("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const startEdit = (loc: LocationItem) => {
    setForm({
      name: loc.name,
      address: loc.address,
      cityId: loc.cityId,
      type: loc.type,
      phone: loc.phone || "",
      openHours: loc.openHours || "",
    });
    setCitySearch(loc.city?.name || "");
    setEditingId(loc.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.address || !form.type || !form.cityId) return;
    setSaving(true);
    setError("");

    const body = {
      name: form.name,
      address: form.address,
      cityId: form.cityId,
      cityName: selectedCityName,
      type: form.type,
      phone: form.phone || undefined,
      openHours: form.openHours || undefined,
    };

    try {
      const isEdit = !!editingId;
      const url = isEdit ? `/api/locations/${editingId}` : "/api/locations";
      const method = isEdit ? "PATCH" : "POST";

      let res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok && res.status === 500 && !isEdit) {
        // Try setting up DB first
        setError("Configurando banco de dados...");
        await fetch("/api/setup", { method: "POST" });
        res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setLocations((prev) => prev.map((l) => (l.id === editingId ? data.location : l)));
        } else {
          setLocations((prev) => [data.location, ...prev]);
        }
        resetForm();
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || `Erro ao salvar (${res.status})`);
      }
    } catch {
      setError("Erro de conexão");
    }
    setSaving(false);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, isActive: !isActive } : l)));
    try {
      await fetch(`/api/locations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    try {
      await fetch(`/api/locations/${id}`, { method: "DELETE" });
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Pontos de Apoio</h1>
          <p className="text-muted-foreground">Gerencie comitês, pontos de adesivo e bandeiras.</p>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
          <Button onClick={() => { if (showForm) { resetForm(); } else { setShowForm(true); } }} size="sm">
            <Plus className="w-4 h-4" />
            Novo Ponto
          </Button>
        </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-border/50 p-6 mb-6"
        >
          <h3 className="font-bold text-foreground mb-4">{editingId ? "Editar Ponto de Apoio" : "Novo Ponto de Apoio"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Comitê Central São Luís"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Selecione o tipo...</option>
                {Object.entries(typeLabels).map(([v, { label }]) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-1">
                Município
                {selectedCityName && <span className="text-primary font-normal ml-1">— {selectedCityName}</span>}
                {citiesLoading && <span className="text-muted-foreground font-normal ml-1 text-xs">(carregando...)</span>}
                {!citiesLoading && cities.length > 0 && <span className="text-muted-foreground font-normal ml-1 text-xs">({cities.length} municípios)</span>}
              </label>
              {cities.length > 0 ? (
                <>
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => { setCitySearch(e.target.value); setForm({ ...form, cityId: "" }); }}
                    placeholder="Digite para buscar município..."
                    className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {citySearch && !form.cityId && filteredCities.length > 0 && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-border/50 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredCities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => { setForm({ ...form, cityId: city.id }); setCitySearch(city.name); }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {citySearch && !form.cityId && filteredCities.length === 0 && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-border/50 rounded-lg shadow-lg p-3 text-xs text-muted-foreground">
                      Nenhum município encontrado para &quot;{citySearch}&quot;
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 text-sm text-muted-foreground">
                  {citiesLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Carregando municípios...</>
                  ) : (
                    <>Erro ao carregar municípios. Tente recarregar a página.</>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Endereço</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Ex: Av. dos Holandeses, 1000 - Calhau"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Telefone (opcional)</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Ex: (98) 3XXX-0001"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Horário de funcionamento (opcional)</label>
              <input
                type="text"
                value={form.openHours}
                onChange={(e) => setForm({ ...form, openHours: e.target.value })}
                placeholder="Ex: Seg-Sáb 8h-18h"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={resetForm}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={saving || !form.name || !form.address || !form.type || !form.cityId}>
              {saving && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
              {editingId ? "Atualizar Ponto" : "Salvar Ponto"}
            </Button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {locations.map((loc, i) => {
          const typeInfo = typeLabels[loc.type] || typeLabels.comite;
          const TypeIcon = typeInfo.icon;
          return (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-xl border border-border/50 p-5 ${!loc.isActive ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg ${typeInfo.color} flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      {!loc.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">Inativo</span>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{loc.name}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {loc.address} — {loc.city?.name || "—"}
                      </span>
                      {loc.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {loc.phone}
                        </span>
                      )}
                      {loc.openHours && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {loc.openHours}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(loc)} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer" title="Editar">
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </button>
                  <button onClick={() => handleToggleActive(loc.id, loc.isActive)} className="p-1.5 rounded-lg hover:bg-green-50 transition-colors cursor-pointer" title={loc.isActive ? "Desativar" : "Ativar"}>
                    {loc.isActive ? <X className="w-4 h-4 text-amber-500" /> : <Check className="w-4 h-4 text-success" />}
                  </button>
                  <button onClick={() => handleDelete(loc.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer" title="Excluir">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {locations.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Nenhum ponto de apoio cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
