import re

grep_output = """67:            min-height: 0;
68:            min-width: 0;
123:        .screen { display: none; width: 100%; flex: 1; flex-direction: column; overflow-y: auto; position: relative; min-height: 0; min-width: 0; }
150:        body.teacher-mode #teacher-sticky-nav .neo-btn, body.parent-mode #parent-sticky-nav .neo-btn { min-height: 48px; padding: 9px 16px; font-size: 0.95rem; flex: 0 0 auto; }
264:        .main-action-buttons .neo-btn { font-size: 1.5rem; min-width: 260px; padding: 18px 40px; border-radius: var(--radius-full); }
325:        .stars-container { display: flex; gap: 6px; position: absolute; top: -18px; z-index: 20; left: 50%; transform: translateX(-50%); background-color: var(--color-white); border: 3px solid var(--color-dark); padding: 5px 12px; border-radius: 16px; box-shadow: 0 4px 0 var(--color-dark); align-items: center; justify-content: center; min-width: 80px; }
334:        .learning-primary { width: min(760px, 100%); margin: 6px auto 10px; min-height: 180px; text-align: center; }
340:            padding: 20px; cursor: pointer; transition: transform 0.2s; min-height: 120px;
344:        .exercise-card { min-height: 150px; }
369:        .trace-letter-tabs .neo-btn { min-width: 78px; }
371:        .match-option, .drag-option { min-height: 60px; border: var(--border-thick); border-radius: var(--radius-md); background: white; box-shadow: var(--shadow-hard-sm); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 900; cursor: pointer; padding: 10px; }
374:        .drop-slot { min-height: 70px; border: 4px dashed var(--color-dark); border-radius: var(--radius-md); background: rgba(255,255,255,.7); display:flex; align-items:center; justify-content:center; font-size: 1.2rem; font-weight: 900; }
785:        @media (min-width: 769px) {
828:            min-height: 86px;
947:            #guru-dashboard-tahap-select, #guru-dashboard-peta-select { flex: 1 1 calc(50% - 3px) !important; width: calc(50% - 3px) !important; max-width: calc(50% - 3px) !important; min-width: 0 !important; font-size: 0.78rem !important; padding: 4px 6px !important; min-height: 32px !important; font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif !important; }
948:            .report-actions .neo-btn { font-size: 0.75rem !important; padding: 4px 6px !important; min-height: 30px !important; }
961:            .main-action-buttons .neo-btn { min-width: 200px; font-size: 1.2rem; padding: 14px 30px; }
983:                min-height: 120px;
1030:.sub-menu-grid .learning-card { min-height: 150px; }
1031:.exercise-card { position: relative; min-height: 190px; padding-bottom: 42px; }
1041:                min-width: auto;
1091:            min-height: 120px;
1122:        min- aspect-ratio: 1;
1150:        min-height: 44px;
1170:        min-height: 54px !important; /* Good touch target */
1209:        min-height: 44px;
1219:        min-height: 48px;
1238:        min-height: 48px !important;
1245:        min-height: 38px !important;
1260:.screen { min-width: 0; padding-left: clamp(12px, 3vw, 30px); padding-right: clamp(12px, 3vw, 30px); }
1263:    min-height: var(--control-height);
1264:    min-width: 0;
1272:.neo-input { min-height: var(--control-height); padding: 10px 12px; margin-bottom: 12px; border-radius: var(--control-radius); font-size: 1rem; }
1277:.report-actions .neo-btn { flex: 0 0 auto; min-width: auto; }
1287:.badge-board-card { min-width: 0; }
1294:.map-top-bar { position: relative; min-height: 60px; }
1304:.fonik-tile { min-height: 74px; font-size: 1.6rem; background: var(--color-purple); color: white;  }
1313:.match-option, .drag-option, .tarikgaris-btn, .kuizaudio-options .neo-btn, .susunkata-block, .option-btn { min-height: 58px; padding: 14px 20px; font-size: 1.1rem; }
1315:.tarikgaris-container { position: relative; width: min(760px, 100%); min-height: 300px; align-items: stretch; }
1322:.trace-letter-btn { min-height: 34px; padding: 5px; font-size: .82rem; }
1337:    body.teacher-mode #teacher-sticky-nav .neo-btn, body.parent-mode #parent-sticky-nav .neo-btn { flex: 0 0 auto; min-width: 0; padding: 4px 8px; font-size: 0.75rem !important; border-width: 1.5px; min-height: 32px !important; }
1341:    .main-action-buttons .neo-btn { min-width: 0; width: 100%; padding: 11px 8px; font-size: 0.95rem; }
1343:    .mode-btn { width: 100% !important; min-height: 48px !important; padding: 9px 8px !important; font-size: 0.9rem !important; }
1346:    .student-nav-bar .nav-item { min-height: 48px; padding: 6px 5px; font-size: 0.68rem; border-radius: 11px; }
1361:    .trace-letter-btn { min-height: 32px; font-size: .75rem; }
1365:    .tarikgaris-btn { min-width: 82px; }
1369:    .fonik-tile { min-height: 58px; font-size: 1.25rem; }
1370:    .match-option, .drag-option, .tarikgaris-btn, .kuizaudio-options .neo-btn, .susunkata-block, .option-btn { min-height: 52px; padding: 11px 14px; font-size: 1rem; }
1372:    .tarikgaris-container { min-height: 260px; }
1383:    .mode-btn { min-height: 50px !important; padding: 10px !important; }
1395:    min-width: unset !important;
1507:#murid-menu-latihan .exercise-card { min-height: 220px; padding: 28px 22px 52px; }
1511:    #murid-menu-latihan .exercise-card { min-height: 166px; padding: 18px 10px 42px; }
1521:    min-height: 60px !important;
1605:        min- aspect-ratio: 1;
1657:        min-height: 50px !important;
1685:        min-height: 50px !important;
1692:        min-height: 54px !important;
1721:        min-height: 48px !important;
1739:        min-height: 48px !important;
1862:    min-height: 65px;
1863:    min-width: 0;
1875:        min-height: 48px;
1888:    min-height: 60px !important;
1923:    min-height: 48px !important;
2088:    min-height: 48px !important;
2096:    min-height: 48px !important;
2106:        min-height: 44px !important;
2112:        min-height: 44px !important;
2145:    min-width: 300px;
2164:    min-height: 250px;
2367:        min-height: 100px;
2443:    min-height: 0;
2567:        min-width: 115px !important;
2666:    min-height: 40px !important;
2668:    min-width: 135px !important;
2749:        min-height: 52px !important;
2759:        min-width: 70px !important;
2826:        min-height: 52px !important;
2863:    min-
2967:        min-height: 52px !important;
3090:    min-width: 0;
3122:    min-width: 170px;
3185:        min-width: 110px;
3234:    min-width: 28px !important;
3236:    min-height: 28px !important;
3330:@media (min-width: 769px) {
3339:@media (min-width: 721px) {"""

with open('src/index.css', 'r') as f:
    lines = f.readlines()

for line in grep_output.split('\n'):
    if not line.strip(): continue
    parts = line.split(':', 1)
    if len(parts) == 2:
        try:
            line_num = int(parts[0])
            # For lines 1122 and 1605 and 2863, we should manually fix it instead of putting back the syntax error
            if line_num in [1122, 1605]:
                lines[line_num-1] = parts[1].replace('min- aspect-ratio', 'aspect-ratio') + '\n'
            elif line_num == 2863:
                lines[line_num-1] = "" # Just empty it since it was incomplete anyway
            else:
                lines[line_num-1] = parts[1] + '\n'
        except ValueError:
            pass

with open('src/index.css', 'w') as f:
    f.writelines(lines)
print("restored")
