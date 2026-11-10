document.querySelectorAll('[data-service]').forEach(function(a){
 a.addEventListener('click',function(){ var v=a.getAttribute('data-service');
  document.querySelectorAll('input[name="service"]').forEach(function(c){ if(c.value===v) c.checked=true; }); });
});

var box=document.getElementById('numChoice'), pending='';
function openChoice(t){ pending=t||''; box.hidden=false; box.querySelector('.nc-num').focus(); }
function closeChoice(){ box.hidden=true; }
box.querySelectorAll('.nc-num').forEach(function(b){
 b.addEventListener('click',function(){
  window.open('https://wa.me/'+b.getAttribute('data-num')+(pending?'?text='+pending:''),'_blank','noopener');
  closeChoice();
 });
});
box.querySelector('.nc-close').addEventListener('click',closeChoice);
box.addEventListener('click',function(e){ if(e.target===box) closeChoice(); });
document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeChoice(); });
document.addEventListener('click',function(e){
 var a=e.target.closest('a[href^="https://wa.me/"]');
 if(!a||a.hasAttribute('data-fixed')) return;
 e.preventDefault();
 var i=a.href.indexOf('?text=');
 openChoice(i>-1?a.href.slice(i+6):'');
});
document.getElementById('quoteForm').addEventListener('submit',function(e){
 e.preventDefault();
 const choisis=Array.from(document.querySelectorAll('input[name="service"]:checked')).map(function(c){return c.value;});
 const erreur=document.getElementById('serviceError');
 if(!choisis.length){ erreur.hidden=false; erreur.scrollIntoView({behavior:'smooth',block:'center'}); return; }
 erreur.hidden=true;
 const service=choisis.length>1 ? '\n• '+choisis.join('\n• ') : choisis[0];
 const quantity=document.getElementById('quantity').value;
 const name=document.getElementById('name').value;
 const details=document.getElementById('details').value;
 const msg=`Bonjour F489 Imprimerie !%0A%0AJe souhaite demander un devis.%0A%0A*Nom / entreprise :* ${encodeURIComponent(name)}%0A*Service(s) :* ${encodeURIComponent(service)}%0A*Quantité :* ${encodeURIComponent(quantity)}%0A*Détails :* ${encodeURIComponent(details || 'Non précisé')}%0A%0AMerci.`;
 openChoice(msg);
});

/* ===== APPLI : installation sur le téléphone ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); });
}
var invite = null, installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', function(e){
  e.preventDefault(); invite = e; installBtn.hidden = false;
});
installBtn.addEventListener('click', function(){
  if (!invite) return;
  invite.prompt();
  invite.userChoice.then(function(){ invite = null; installBtn.hidden = true; });
});
window.addEventListener('appinstalled', function(){ installBtn.hidden = true; });
