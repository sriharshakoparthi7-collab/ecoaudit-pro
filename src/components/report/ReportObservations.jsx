import { SectionTitle } from '../../pages/ClientReport';

function ObservationBlock({ number, title, children }) {
  return (
    <div className="rounded-xl border-l-4 p-5 bg-white shadow-sm avoid-break" style={{ borderColor: '#1B4040' }}>
      <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#1B4040' }}>
        {number}. {title}
      </h4>
      <div className="text-xs leading-relaxed text-gray-600 space-y-1">
        {children}
      </div>
    </div>
  );
}

function Bullet({ label, value }) {
  if (!value) return null;
  return (
    <p>
      <span className="font-semibold text-gray-700">{label}: </span>
      {value}
    </p>
  );
}

export default function ReportObservations({ lights, solars, forklifts, hotWaters }) {
  const totalLightingKW = lights.reduce((s, l) => s + (l.rated_wattage || 0) * (l.quantity || 1) / 1000, 0);
  const hasLEDOpportunity = lights.some(l => l.light_type && !l.light_type.toLowerCase().includes('led'));
  const hasSolar = solars.some(s => s.system_size_kw);
  const solarExpansion = solars.some(s => s.available_roof_space === 'Yes');
  const schedulingOpportunity = forklifts.some(f => f.scheduling_opportunity === 'Yes');
  const hasUninsulated = hotWaters.some(h => h.pipe_insulation === 'No');
  const hasNoTempValve = hotWaters.some(h => h.tempering_valve === 'No');

  return (
    <section>
      <SectionTitle number="7" title="Consolidated Observations for Energy Improvements" />
      <p className="text-xs text-gray-500 mb-5">
        This section aggregates the auditor's field notes into actionable insights for the client.
      </p>

      <div className="space-y-4">
        <ObservationBlock number="7.1" title="Lighting Upgrades">
          {lights.length === 0 ? (
            <p>No lighting data recorded. A lighting assessment should be conducted on site.</p>
          ) : (
            <>
              <Bullet label="Total lighting load" value={`${totalLightingKW.toFixed(2)} kW across ${lights.length} fixture group(s)`} />
              {hasLEDOpportunity && (
                <p>⚡ Opportunity identified to upgrade non-LED fixtures to high-efficiency LED, which can reduce lighting energy consumption by 50–70%.</p>
              )}
              {lights.filter(l => !l.controls_type || l.controls_type.toLowerCase().includes('manual')).length > 0 && (
                <p>⚡ Manual control circuits identified — consider automated occupancy or daylight sensors to reduce unnecessary runtime.</p>
              )}
            </>
          )}
        </ObservationBlock>

        <ObservationBlock number="7.2" title="Solar PV Optimization">
          {solars.length === 0 ? (
            <p>No Solar PV data recorded. A roof and switchboard suitability assessment is recommended.</p>
          ) : (
            <>
              <Bullet label="Existing installed capacity" value={hasSolar ? `${solars.filter(s => s.system_size_kw).map(s => s.system_size_kw).join(', ')} kW` : 'No existing system'} />
              {solarExpansion && (
                <p>⚡ Available roof space identified — expansion of solar PV capacity is feasible and recommended to offset site energy consumption.</p>
              )}
              {solars.some(s => s.suitable_switchboard === 'Yes') && (
                <p>✅ A suitable switchboard connection point is available for solar PV integration or expansion.</p>
              )}
            </>
          )}
        </ObservationBlock>

        <ObservationBlock number="7.3" title="Load Shifting — Forklift Charging">
          {forklifts.length === 0 ? (
            <p>No forklift charger data recorded.</p>
          ) : (
            <>
              <Bullet label="Chargers on site" value={`${forklifts.length} charger group(s) logged`} />
              <p>
                Opportunity to schedule forklift charging to maximize charging during solar PV production hours:{' '}
                <strong>{schedulingOpportunity ? 'YES — Scheduling opportunity confirmed.' : 'Not yet assessed or not applicable.'}</strong>
              </p>
              {schedulingOpportunity && (
                <p>⚡ Implementing a timed charging schedule aligned with solar generation peak hours (typically 9am–3pm) could significantly reduce grid dependency and demand charges.</p>
              )}
            </>
          )}
        </ObservationBlock>

        <ObservationBlock number="7.4" title="Hot Water Efficiency">
          {hotWaters.length === 0 ? (
            <p>No hot water system data recorded. An assessment of DHW systems is recommended.</p>
          ) : (
            <>
              <Bullet label="Systems assessed" value={`${hotWaters.length} DHW unit(s)`} />
              {hasUninsulated && (
                <p>⚡ Uninsulated pipework identified — adding thermal pipe insulation will reduce standby heat losses and lower energy consumption.</p>
              )}
              {hasNoTempValve && (
                <p>⚠️ Tempering valve absent on one or more units — installation is recommended for both safety compliance and water efficiency.</p>
              )}
              {!hasUninsulated && !hasNoTempValve && hotWaters.length > 0 && (
                <p>✅ Hot water systems appear adequately maintained. Consider exploring heat pump water heater upgrades for significant efficiency gains.</p>
              )}
            </>
          )}
        </ObservationBlock>
      </div>

      <div className="mt-8 rounded-xl p-6 text-center" style={{ background: '#1B4040' }}>
        <p className="text-sm font-bold text-white uppercase tracking-widest mb-1">— End of Report —</p>
        <p className="text-xs" style={{ color: '#7abcac' }}>
          This document is confidential and prepared exclusively for the named client by Sustainability Wise.
        </p>
      </div>
    </section>
  );
}