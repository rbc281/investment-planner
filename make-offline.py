from pathlib import Path
import base64
import re
p=Path('dist');h=(p/'index.html').read_text();css=(p/'style.css').read_text();js=(p/'app.js').read_text()
for name,mime in [('background.jpg','image/jpeg'),('logo.png','image/png'),('planner-icon.svg','image/svg+xml')]:
 data='data:'+mime+';base64,'+base64.b64encode((p/'assets'/name).read_bytes()).decode()
 css=css.replace('assets/'+name,data);h=h.replace('assets/'+name,data)
h=re.sub(r'<link rel="stylesheet" href="style\.css(?:\?[^"]*)?">',lambda _: '<style>'+css+'</style>',h)
h=re.sub(r'<script src="app\.js(?:\?[^"]*)?"></script>',lambda _: '<script>'+js+'</script>',h)
h=re.sub(r'<script src="updates\.js(?:\?[^"]*)?"></script>','',h)
h=h.replace('<a href="investment-planner-offline.html" download id="offline">Download offline</a>','')
h=re.sub(r'<script src="cash-promo\.js(?:\?[^"]*)?"></script>',lambda _: '<script>'+(p/'cash-promo.js').read_text()+'</script>',h)
for name in ['config.js','activity.js','payoff.js']:
 h=h.replace('<script src="'+name+'"></script>','<script>'+(p/name).read_text()+'</script>')
(p/'investment-planner-offline.html').write_text(h)
