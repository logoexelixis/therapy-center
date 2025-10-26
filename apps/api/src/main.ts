import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient, AppointmentStatus } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// CORS για localhost:3000
app.use(cors({ origin: [/localhost:3000$/, /127\.0\.0\.1:3000$/], credentials: true }));
app.use(express.json());

// Υγεία
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message });
  }
});

// Ημερήσιο πρόγραμμα (όπως πριν)
app.get('/schedule', async (req, res) => {
  const dateStr = (req.query.date as string) || new Date().toISOString().slice(0,10);
  const date = new Date(dateStr);
  const start = new Date(date); start.setHours(8,0,0,0);
  const end = new Date(date); end.setHours(21,0,0,0);

  const therapists = await prisma.therapist.findMany({ include: { user: true } });
  const appts = await prisma.appointment.findMany({
    where: { startDt: { gte: start, lt: end } },
    include: { client: true }
  });

  const times: string[] = [];
  for (let h=8; h<21; h++) for (let m=0; m<60; m+=45) times.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);

  const slots: Record<string, any[]> = {};
  for (const t of therapists) slots[t.id] = times.map(time => ({ time, therapistId: t.id }));

  for (const a of appts) {
    const hh = a.startDt.getHours().toString().padStart(2,'0');
    const mm = a.startDt.getMinutes().toString().padStart(2,'0');
    const key = `${hh}:${mm}`;
    const arr = slots[a.therapistId] || [];
    const idx = arr.findIndex(s => s.time === key);
    if (idx>=0) arr[idx].appointment = { id: a.id, clientName: a.client.fullName, status: a.status, isPaid: a.isPaid };
  }

  res.json({
    therapists: therapists.map(t => ({ id: t.id, name: `${t.user.firstName || ''} ${t.user.lastName || ''}`.trim() || 'Therapist' })),
    slots
  });
});

// Δημιουργία ραντεβού σε κενό slot
app.post('/appointments', async (req, res) => {
  try {
    const { therapistId, date, time, clientName }:{therapistId:string, date:string, time:string, clientName:string} = req.body;
    if (!therapistId || !date || !time || !clientName) return res.status(400).json({ error: 'Missing fields' });

    // start/end (τοπική ώρα)
    const [hh, mm] = time.split(':').map(Number);
    const start = new Date(date);
    start.setHours(hh, mm, 0, 0);
    const end = new Date(start.getTime() + 45 * 60 * 1000);

    // βρες/φτιάξε πελάτη
    let client = await prisma.client.findFirst({ where: { fullName: clientName } });
    if (!client) client = await prisma.client.create({ data: { fullName: clientName } });

    // φτιάξε ραντεβού
    const appt = await prisma.appointment.create({
      data: {
        clientId: client.id,
        therapistId,
        startDt: start,
        endDt: end,
        status: 'SCHEDULED'
      }
    });

    res.json({ ok: true, id: appt.id });
  } catch (e:any) {
    // unique conflict στο ίδιο slot
    if (e?.code === 'P2002') return res.status(409).json({ error: 'Slot already booked' });
    res.status(500).json({ error: e?.message || 'Server error' });
  }
});

// Αλλαγή κατάστασης ραντεβού
app.patch('/appointments/:id/status', async (req, res) => {
  try {
    const id = req.params.id;
    const { status }:{status: AppointmentStatus} = req.body;
    if (!id || !status) return res.status(400).json({ error: 'Missing id/status' });
    if (!['SCHEDULED','PRESENT','CANCELLED_ON_TIME','CANCELLED_LATE','NO_SHOW'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    await prisma.appointment.update({ where: { id }, data: { status } });
    res.json({ ok: true });
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'Server error' });
  }
});

app.listen(4000, () => console.log('API listening on http://localhost:4000'));
