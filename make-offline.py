from pathlib import Path
import base64
p=Path('dist');h=(p/'index.html').read_text();css=(p/'style.css').read_text();js=(p/'app.js').read_text()
for name,mime in [('background.jpg','image/jpeg'),('logo.png','image/png'),('planner-icon.svg','image/svg+xml')]:
 data='data:'+mime+';base64,'+base64.b64encode((p/'assets'/name).read_bytes()).decode()
 css=css.replace('assets/'+name,data);h=h.replace('assets/'+name,data)
h=h.replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>').replace('<script src="app.js"></script>','<script>'+js+'</script>').replace('<a href="investment-planner-offline.html" download id="offline">Download offline</a>','')
for name in ['config.js','activity.js','payoff.js']:
 h=h.replace('<script src="'+name+'"></script>','<script>'+(p/name).read_text()+'</script>')
(p/'investment-planner-offline.html').write_text(h)
