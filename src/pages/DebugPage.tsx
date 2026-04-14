import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DebugPage = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from('profiles').select('email, id, first_name');
      if (data) setProfiles(data);
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Debug Profiles</h1>
      {loading ? <p>Loading...</p> : (
        <ul className="list-disc ml-5">
          {profiles.map(p => (
            <li key={p.id}>{p.email} ({p.first_name})</li>
          ))}
          {profiles.length === 0 && <li>No profiles found.</li>}
        </ul>
      )}
    </div>
  );
};

export default DebugPage;
