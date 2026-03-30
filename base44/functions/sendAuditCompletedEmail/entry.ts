import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const bodyData = await req.json();
    // Support entity automation payload (event.entity_id) and direct call (audit_id)
    const audit_id = bodyData.audit_id || (bodyData.event && bodyData.event.entity_id) || (bodyData.data && bodyData.data.id);

    if (!audit_id) {
      return Response.json({ error: 'Missing audit_id' }, { status: 400 });
    }

    const audits = await base44.asServiceRole.entities.Audit.filter({ id: audit_id });
    const audit = audits[0];
    if (!audit) {
      return Response.json({ error: 'Audit not found' }, { status: 404 });
    }

    const [zones, hvacs, lights, solars, forklifts, hotWaters, mains, additionals] = await Promise.all([
      base44.asServiceRole.entities.Zone.filter({ audit_id }),
      base44.asServiceRole.entities.HVACUnit.filter({ audit_id }),
      base44.asServiceRole.entities.LightingSystem.filter({ audit_id }),
      base44.asServiceRole.entities.SolarPV.filter({ audit_id }),
      base44.asServiceRole.entities.ForkliftCharger.filter({ audit_id }),
      base44.asServiceRole.entities.HotWaterSystem.filter({ audit_id }),
      base44.asServiceRole.entities.MainSwitchboard.filter({ audit_id }),
      base44.asServiceRole.entities.AdditionalSwitchboard.filter({ audit_id }),
    ]);

    const auditDate = audit.audit_date
      ? new Date(audit.audit_date).toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' })
      : 'N/A';

    const emailBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background: #1B4040; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #fff; margin: 0; font-size: 20px;">Energy Audit Completed</h1>
    <p style="color: #a0d4c4; margin: 6px 0 0; font-size: 14px;">Sustainability Wise — Audit Management</p>
  </div>
  <div style="background: #f7f8f8; padding: 24px 32px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1B4040; font-size: 16px; margin-top: 0;">${audit.site_name}</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
      <tr><td style="padding: 6px 0; color: #666; width: 160px;">Site Address</td><td style="padding: 6px 0; font-weight: 500;">${audit.site_address || '—'}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Inspector</td><td style="padding: 6px 0; font-weight: 500;">${audit.inspector_name || '—'}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Audit Date</td><td style="padding: 6px 0; font-weight: 500;">${auditDate}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Status</td><td style="padding: 6px 0;"><span style="background: #1B4040; color: #fff; padding: 2px 10px; border-radius: 12px; font-size: 12px;">Completed</span></td></tr>
    </table>
    <h3 style="color: #1B4040; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Equipment Summary</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="padding: 5px 0; color: #666;">Zones</td><td style="padding: 5px 0; font-weight: 500;">${zones.length}</td></tr>
      <tr><td style="padding: 5px 0; color: #666;">HVAC Units</td><td style="padding: 5px 0; font-weight: 500;">${hvacs.length}</td></tr>
      <tr><td style="padding: 5px 0; color: #666;">Lighting Systems</td><td style="padding: 5px 0; font-weight: 500;">${lights.length}</td></tr>
      <tr><td style="padding: 5px 0; color: #666;">Solar PV Records</td><td style="padding: 5px 0; font-weight: 500;">${solars.length}</td></tr>
      <tr><td style="padding: 5px 0; color: #666;">Forklift Chargers</td><td style="padding: 5px 0; font-weight: 500;">${forklifts.length}</td></tr>
      <tr><td style="padding: 5px 0; color: #666;">Hot Water Systems</td><td style="padding: 5px 0; font-weight: 500;">${hotWaters.length}</td></tr>
      <tr><td style="padding: 5px 0; color: #666;">Main Switchboards</td><td style="padding: 5px 0; font-weight: 500;">${mains.length}</td></tr>
      <tr><td style="padding: 5px 0; color: #666;">Additional Switchboards</td><td style="padding: 5px 0; font-weight: 500;">${additionals.length}</td></tr>
    </table>
    <p style="margin-top: 24px; font-size: 13px; color: #888;">This is an automated notification from the Sustainability Wise audit platform.</p>
  </div>
</div>`.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'service@sustainabilitywise.com.au',
      from_name: 'Sustainability Wise Audits',
      subject: `Audit Completed: ${audit.site_name} — ${auditDate}`,
      body: emailBody,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});