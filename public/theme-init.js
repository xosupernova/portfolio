// Early theme application (no inline script needed for CSP)
/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */
(function(){
  try {
    var m=document.cookie.match(/(?:^|; )theme=([^;]+)/);
    var raw=m?decodeURIComponent(m[1]):null;
    var prefers=window.matchMedia('(prefers-color-scheme: dark)').matches;
    var want=prefers;
    if(raw==='light') want=false; else if(raw==='dark') want=true;
    document.documentElement.classList.toggle('dark', want);
  } catch(e) {}
})();
