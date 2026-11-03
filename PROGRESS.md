# Investment Planner — current build

Implemented: grouped manager activity at manager.html; price first presented; standard/custom discount apply, edit, remove; Pacific timestamps; search, rep and date filters; 3-second refresh; shortened customer names before persistence; append-only Supabase log with no login; offline retry queue preserving event ID/time; presentation survives refresh; payment factor 1.3% of financed balance rounded up; MSRP/savings display and project/deposit/finance breakdown.

Backend: Supabase project ffqaowvgqdlncilifshc, organization SpokenFrame. Schema in database/schema.sql. Public configuration contains only a publishable key. Anonymous clients can append/read, cannot update/delete. Security advisors passed.

Verified before interruption: calculations, tile cycling, privacy/queue retry tests; cross-tab price, apply, custom edit; removal confirmed in database. Next: finish live deployment and live smoke verification. GitHub previous main 988e4fae9b3d555c829bc6b9e6ecca924addcda9. Sites project appgprj_6ae938f305488191960f6ad52c030714.

Commands: node test.cjs; node activity-test.cjs; python3 make-offline.py.

Known operating limits: dashboard requires internet and refreshes every 3 seconds while visible; action timestamps originate on rep device and server receipt times are retained; no-login access is intentionally public. Offline copy must be reopened with connectivity to sync queued events. No appointment start/duration metrics requested.
