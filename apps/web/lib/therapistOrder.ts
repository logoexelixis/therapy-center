export const desiredOrder = [
  'Τσάλη Χριστίνα',
  'Χοτζάρ Οζτζάν',
  'Μπατζάκ Χαρούν',
  'Παπαδοπούλου Ηλιάνα',
  'Γεωργιάδου Χριστίνα',
  'Κοτζά Ναζλή',
  'Μουμίν Φατμέ',
  'Ποιμενίδου Μαρία',
];

// δέχεται λίστα θεραπευτών { id, full_name } και επιστρέφει ταξινομημένη
export function sortTherapists<T extends { full_name: string }>(list: T[]): T[] {
  const pos = new Map(desiredOrder.map((name, i) => [name, i]));
  return [...list].sort((a, b) => {
    const ai = pos.has(a.full_name) ? pos.get(a.full_name)! : 999;
    const bi = pos.has(b.full_name) ? pos.get(b.full_name)! : 999;
    if (ai !== bi) return ai - bi;
    return a.full_name.localeCompare(b.full_name);
  });
}
