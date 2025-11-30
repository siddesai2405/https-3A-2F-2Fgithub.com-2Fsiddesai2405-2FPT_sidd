import React, { useState, useEffect } from 'react';
import { Stethoscope, MapPin, Phone, Copy, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getGynecologists, Gynecologist as GynecologistType } from '@/lib/db';

const Gynecologist: React.FC = () => {
  const [gynecologists, setGynecologists] = useState<GynecologistType[]>([]);
  const [filteredGynecologists, setFilteredGynecologists] = useState<GynecologistType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    loadGynecologists();
    requestUserLocation();
  }, []);

  useEffect(() => {
    filterGynecologists();
  }, [gynecologists, searchTerm, userLocation]);

  const loadGynecologists = async () => {
    try {
      const data = await getGynecologists();
      setGynecologists(data);
    } catch (error) {
      console.error('Failed to load gynecologists:', error);
    }
  };

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filterGynecologists = () => {
    let filtered = gynecologists.filter((g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (userLocation && filtered.every(g => g.lat && g.lng)) {
      filtered.sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat!, a.lng!);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat!, b.lng!);
        return distA - distB;
      });
    }

    setFilteredGynecologists(filtered);
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDistanceText = (gyn: GynecologistType): string | null => {
    if (!userLocation || !gyn.lat || !gyn.lng) return null;
    const distance = calculateDistance(userLocation.lat, userLocation.lng, gyn.lat, gyn.lng);
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
  };

  return (
    <div className="min-h-screen bg-background space-y-6 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Nearby Gynecologists</h1>
        <p className="text-muted-foreground">Find healthcare providers near you</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search by name, clinic, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'bg-card border border-border',
            'text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary'
          )}
        />
      </div>

      {/* Info Banner */}
      {gynecologists.length === 0 && (
        <div className="max-w-4xl mx-auto bg-secondary/10 border border-secondary/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-secondary" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">No data yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                No gynecologists have been imported yet. Admins can import a list via settings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gynecologists List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredGynecologists.map((gyn) => {
          const distance = getDistanceText(gyn);
          return (
            <div
              key={gyn.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-lg space-y-4 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">{gyn.name}</h2>
                  <p className="text-sm text-muted-foreground">{gyn.clinic}</p>
                </div>
                {distance && (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{distance}</p>
                    <p className="text-xs text-muted-foreground">away</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="text-primary flex-shrink-0 mt-0.5" size={18} />
                  <div className="flex-1">
                    <p className="text-foreground">{gyn.address}</p>
                    <button
                      onClick={() => copyToClipboard(gyn.address, gyn.id!)}
                      className="text-primary hover:text-primary/80 text-xs mt-1 flex items-center gap-1"
                    >
                      <Copy size={12} />
                      {copiedId === gyn.id ? 'Copied!' : 'Copy address'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="text-primary flex-shrink-0" size={18} />
                  <button
                    onClick={() => copyToClipboard(gyn.phone, gyn.id!)}
                    className="text-foreground hover:text-primary flex items-center gap-1"
                  >
                    {gyn.phone}
                    {copiedId === gyn.id && <span className="text-xs text-primary">(Copied!)</span>}
                  </button>
                </div>
              </div>

              {gyn.specialization && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Specialization: {gyn.specialization}</p>
                </div>
              )}

              {gyn.notes && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">{gyn.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredGynecologists.length === 0 && gynecologists.length > 0 && (
        <div className="max-w-4xl mx-auto text-center py-8">
          <p className="text-muted-foreground">No matching results found</p>
        </div>
      )}

      <div className="h-8"></div>
    </div>
  );
};

export default Gynecologist;
