# Dashboard

```http
GET /api/v1/dashboard?from=2026-09-01&to=2026-09-23
Accept: application/json
```

La période est inclusive côté calendrier métier Africa/Douala et limitée à 90 jours. Les compteurs d’état actuel ne sont pas filtrés par cette période.

```json
{
  "currency": "XAF",
  "timezone": "Africa/Douala",
  "from": "2026-09-01",
  "to": "2026-09-23",
  "activeProducts": 1284,
  "lowStockProducts": 23,
  "outOfStockProducts": 4,
  "indicativeStockValue": "128450",
  "inboundMovements": 248,
  "outboundMovements": 186,
  "dailyMovements": [],
  "recentMovements": []
}
```
