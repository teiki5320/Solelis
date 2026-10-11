export interface IcsEvent {
  uid: string;
  title: string;
  description: string;
  date: Date;
  /** Nombre d'heures avant la date pour déclencher le rappel. */
  alarmHoursBefore?: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toIcsDate(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

/** Nombre d'octets UTF-8 d'un caractère (point de code). */
function octetsUtf8(c: string): number {
  const cp = c.codePointAt(0) ?? 0;
  if (cp < 0x80) return 1;
  if (cp < 0x800) return 2;
  if (cp < 0x10000) return 3;
  return 4;
}

/**
 * Pliage des lignes (RFC 5545 §3.1) : au plus 75 octets par ligne, saut de
 * ligne CRLF suivi d'une espace pour la suite. On ne coupe jamais au milieu
 * d'un caractère accentué (plusieurs octets en UTF-8).
 */
export function plierLigne(ligne: string): string {
  const morceaux: string[] = [];
  let courant = '';
  let octets = 0;
  for (const c of ligne) {
    const n = octetsUtf8(c);
    // Ligne de suite : l'espace initiale compte dans les 75 octets.
    const limite = morceaux.length === 0 ? 75 : 74;
    if (octets + n > limite) {
      morceaux.push(courant);
      courant = '';
      octets = 0;
    }
    courant += c;
    octets += n;
  }
  morceaux.push(courant);
  return morceaux.join('\r\n ');
}

export function buildIcs(events: IcsEvent[]): string {
  const lines: string[] = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Solelis//Rappels juridiques//FR');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');

  for (const e of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${e.uid}@solelis.com`);
    lines.push(`DTSTAMP:${toIcsDate(new Date())}`);
    lines.push(`DTSTART:${toIcsDate(e.date)}`);
    const dtEnd = new Date(e.date.getTime() + 60 * 60 * 1000);
    lines.push(`DTEND:${toIcsDate(dtEnd)}`);
    lines.push(`SUMMARY:${escapeText(e.title)}`);
    lines.push(`DESCRIPTION:${escapeText(e.description)}`);
    if (e.alarmHoursBefore && e.alarmHoursBefore > 0) {
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${escapeText(e.title)}`);
      lines.push(`TRIGGER:-PT${e.alarmHoursBefore}H`);
      lines.push('END:VALARM');
    }
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.map(plierLigne).join('\r\n');
}

export function downloadIcs(events: IcsEvent[], filename = 'solelis-rappels.ics') {
  const content = buildIcs(events);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
