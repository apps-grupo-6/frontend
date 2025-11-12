export const upcomingClasses = [
  {
    id: 101,
    name: "Funcional HIT",
    scheduled_at: new Date(Date.now() + 3600 * 1000).toISOString(),
    instructor: { name: "Carla Gómez" },
    status: "programada",
  },
  {
    id: 102,
    name: "Yoga Vinyasa",
    scheduled_at: new Date(Date.now() + 7200 * 1000).toISOString(),
    instructor: { name: "Leandro Pérez" },
    status: "programada",
  },
  {
    id: 103,
    name: "Spinning",
    scheduled_at: new Date(Date.now() + 10800 * 1000).toISOString(),
    instructor: { name: "María López" },
    status: "confirmada",
  },
];

export const historyClasses = [
  {
    id: 11,
    name: "Pilates Suelo",
    scheduled_at: new Date(Date.now() - 86400 * 1000 * 1).toISOString(),
    instructor: { name: "Sofía Martínez" },
    status: "finalizada",
  },
  {
    id: 12,
    name: "Cross Training",
    scheduled_at: new Date(Date.now() - 86400 * 1000 * 3).toISOString(),
    instructor: { name: "Diego Ramírez" },
    status: "finalizada",
  },
  {
    id: 13,
    name: "Stretching",
    scheduled_at: new Date(Date.now() - 86400 * 1000 * 7).toISOString(),
    instructor: { name: "Camila Torres" },
    status: "finalizada",
  },
];
