(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- name letters land one by one ----- */
  function spell(el, text, start, grad){
    text.split('').forEach(function(c,i){
      var s=document.createElement('span'); s.className='ch'; s.textContent=c===' '?'\u00A0':c;
      s.style.animationDelay=(start+i*0.05)+'s';
      if(grad){var f=i/(text.length-1),A=[255,184,107],B=[255,122,184],C=[180,130,255],a=f<.5?A:B,b=f<.5?B:C,g=f<.5?f*2:(f-.5)*2;
        s.style.color='rgb('+a.map(function(v,k){return Math.round(v+(b[k]-v)*g)}).join(',')+')'}
      el.appendChild(s);
    });
  }
  spell(document.getElementById('n1'),'Zarish',.15);
  spell(document.getElementById('n2'),'Batool',.55,true);

  /* ----- typed roles ----- */
  var roles=['AI/ML Engineer','AI Developer','RAG and LLM builder','Data science student'];
  var t=document.getElementById('typed'), ri=0, ci=0, del=false;
  function tick(){
    var w=roles[ri];
    if(reduce){t.textContent=w;return}
    t.textContent=w.slice(0,ci);
    if(!del&&ci<w.length){ci++;setTimeout(tick,75)}
    else if(!del){del=true;setTimeout(tick,1500)}
    else if(ci>0){ci--;setTimeout(tick,38)}
    else{del=false;ri=(ri+1)%roles.length;setTimeout(tick,300)}
  }
  setTimeout(tick,1300);

  /* ----- star field ----- */
  var cv=document.getElementById('sky'), cx=cv.getContext('2d'), W,H,dpr=Math.min(window.devicePixelRatio||1,2);
  var layers=[{n:120,s:.15,r:.7},{n:70,s:.35,r:1.1},{n:35,s:.7,r:1.7}], stars=[], shoots=[];
  var mx=0,my=0,tx=0,ty=0,warp=1,scrollY0=0;
  function size(){
    W=cv.width=innerWidth*dpr;H=cv.height=innerHeight*dpr;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';
    stars=[];
    layers.forEach(function(L,li){
      var n=Math.round(L.n*Math.min(1,innerWidth/1200+.4));
      for(var i=0;i<n;i++)stars.push({x:Math.random()*W,y:Math.random()*H,l:li,p:Math.random()*6.28,hue:Math.random()<.4?40:(Math.random()<.5?285:330)});
    });
  }
  size(); addEventListener('resize',size);
  addEventListener('pointermove',function(e){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)},{passive:true});
  addEventListener('scroll',function(){scrollY0=scrollY},{passive:true});
  function spawnShoot(){
    shoots.push({x:Math.random()*W*.9,y:Math.random()*H*.4,vx:(9+Math.random()*7)*dpr,vy:(4+Math.random()*4)*dpr,life:1});
  }

  /* ----- milky way band ----- */
  var gcv=document.createElement('canvas'), gx=gcv.getContext('2d'), GK=.4, bandStars=[], gS=0, gcols=['#fff4e0','#ffd0e6','#d8c8ff'];
  function gauss(){return (Math.random()+Math.random()+Math.random()+Math.random()-2)/.58}
  function blob(x,y,r,rgb,a){
    var g=gx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'rgba('+rgb+','+a+')');g.addColorStop(1,'rgba('+rgb+',0)');
    gx.fillStyle=g;gx.fillRect(x-r,y-r,r*2,r*2);
  }
  function buildGalaxy(){
    gS=Math.hypot(W,H);
    var n=Math.ceil(gS*GK);gcv.width=n;gcv.height=n;gx.clearRect(0,0,n,n);
    var c=n/2, B=Math.min(W,H), tone=H>W?.6:1, sv=B*GK*.16, cols=['255,205,160','255,140,190','170,120,255','255,238,215'], i,u,v,core;
    gx.globalCompositeOperation='lighter';
    for(i=0;i<300;i++){
      u=(Math.random()-.5)*n*.95;core=Math.exp(-Math.pow(u/(n*.32),2));
      v=gauss()*sv*(.55+.6*core);
      blob(c+u,c+v,B*GK*(.06+Math.random()*.12)*(.6+core*.7),cols[(Math.random()*3)|0],(.03+Math.random()*.06)*(.4+core)*tone);
    }
    for(i=0;i<90;i++){
      u=(Math.random()-.5)*n*.8;core=Math.exp(-Math.pow(u/(n*.28),2));
      blob(c+u,c+gauss()*sv*.22,B*GK*(.03+Math.random()*.05),cols[3],(.04+.08*core)*tone);
    }
    gx.globalCompositeOperation='destination-out';
    for(i=0;i<36;i++){
      u=(Math.random()-.5)*n*.8;
      blob(c+u,c+(Math.random()-.5)*sv*.7,B*GK*(.025+Math.random()*.05),'0,0,0',.3+Math.random()*.3);
    }
    gx.globalCompositeOperation='source-over';
    bandStars=[];
    var N=Math.round(1100*Math.min(1,W/dpr/1300+.35));
    for(i=0;i<N;i++){
      u=(Math.random()-.5)*gS;core=Math.exp(-Math.pow(u/(gS*.32),2));
      bandStars.push({u:u,v:gauss()*Math.min(W,H)*.085*(.55+.6*core),r:(.35+Math.random()*.9)*dpr,a:.25+Math.random()*.6,p:Math.random()*6.28,w:(Math.random()*3)|0});
    }
  }
  buildGalaxy(); addEventListener('resize',buildGalaxy);
  function drawGalaxy(ts){
    var phi=-.5+Math.sin(ts*.00002)*.05, cs=Math.cos(phi), sn=Math.sin(phi);
    var ox=W/2+mx*-34*dpr, oy=H/2+my*-24*dpr-scrollY0*.04*dpr;
    cx.save();cx.globalAlpha=.9+.1*Math.sin(ts*.0006);
    cx.translate(ox,oy);cx.rotate(phi);cx.scale(1/GK,1/GK);
    cx.drawImage(gcv,-gcv.width/2,-gcv.height/2);cx.restore();
    for(var i=0;i<bandStars.length;i++){
      var b=bandStars[i], x=ox+b.u*cs-b.v*sn, y=oy+b.u*sn+b.v*cs;
      if(x<0||y<0||x>W||y>H)continue;
      cx.globalAlpha=b.a*(.6+.4*Math.sin(ts*.0015+b.p));cx.fillStyle=gcols[b.w];cx.fillRect(x,y,b.r,b.r);
    }
    cx.globalAlpha=1;
  }
  /* ----- 4D hyperspace points + links ----- */
  var hp=[];
  function buildHyper(){
    hp=[];var N=Math.round(150*Math.min(1,W/dpr/1300+.4));
    for(var i=0;i<N;i++){var p=[Math.random()*2-1,Math.random()*2-1,Math.random()*2-1,Math.random()*2-1],l=Math.hypot(p[0],p[1],p[2],p[3])||1,r=.35+Math.random()*.65;
      hp.push([p[0]/l*r,p[1]/l*r,p[2]/l*r,p[3]/l*r])}
  }
  buildHyper();addEventListener('resize',buildHyper);
  function r4(p,i,j,a){var c=Math.cos(a),s=Math.sin(a),x=p[i],y=p[j];p[i]=x*c-y*s;p[j]=x*s+y*c}
  function draw4D(ts){
    var t=ts*.001,pts=[],L=Math.min(W,H)*.14,L2=L*L,i,j;
    for(i=0;i<hp.length;i++){
      var p=hp[i].slice();
      r4(p,0,3,t*.07+scrollY0*.0006);r4(p,2,3,t*.05);r4(p,1,3,t*.04+my*.3);r4(p,0,2,t*.03+mx*.4);
      var k=1/(2.4-p[3]),f=1/(2.2-p[2]*k);
      pts.push({x:W/2+p[0]*k*f*W*3,y:H/2+p[1]*k*f*H*3,k:k,f:f,w:p[3]});
    }
    cx.lineWidth=.7*dpr;
    for(i=0;i<pts.length;i++){var a=pts[i];
      if(a.x<-50||a.y<-50||a.x>W+50||a.y>H+50)continue;
      for(j=i+1;j<pts.length;j++){var b=pts[j],dx=a.x-b.x,dy=a.y-b.y,dd=dx*dx+dy*dy;
        if(dd<L2){cx.globalAlpha=(1-Math.sqrt(dd)/L)*.22;cx.strokeStyle='#d9c8ff';cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
    }
    for(i=0;i<pts.length;i++){var s=pts[i];
      if(s.x<0||s.y<0||s.x>W||s.y>H)continue;
      cx.globalAlpha=Math.min(1,.3+s.k*.8);cx.fillStyle=s.w>0?'#ffd6a0':'#cdb8ff';
      cx.beginPath();cx.arc(s.x,s.y,(.5+s.f*1.6)*dpr,0,6.283);cx.fill();
    }
    cx.globalAlpha=1;
  }
  var last=0,shootT=0;
  function frame(ts){
    var dt=Math.min(40,ts-last||16);last=ts;
    mx+=(tx-mx)*.05;my+=(ty-my)*.05;
    warp+=(1-warp)*.06;
    cx.clearRect(0,0,W,H);
    drawGalaxy(ts);
    draw4D(ts);
    for(var i=0;i<stars.length;i++){
      var s=stars[i],L=layers[s.l];
      s.y-=L.s*dt*.02*dpr*warp; if(s.y<0){s.y=H;s.x=Math.random()*W}
      var px=s.x+mx*-60*(s.l+1)*dpr, py=s.y+my*-40*(s.l+1)*dpr - scrollY0*L.s*.25*dpr;
      py=((py%H)+H)%H;
      var tw=.55+.45*Math.sin(ts*.002+s.p);
      cx.globalAlpha=tw;cx.fillStyle='hsl('+s.hue+',90%,'+(80+s.l*6)+'%)';
      if(warp>1.6){cx.fillRect(px,py,L.r*dpr,L.r*dpr*(1+warp*3))}
      else{cx.beginPath();cx.arc(px,py,L.r*dpr,0,6.283);cx.fill()}
    }
    cx.globalAlpha=1;
    shootT-=dt; if(shootT<=0&&!reduce){spawnShoot();shootT=2500+Math.random()*4500}
    for(var j=shoots.length-1;j>=0;j--){
      var sh=shoots[j];sh.x+=sh.vx;sh.y+=sh.vy;sh.life-=.018;
      var g=cx.createLinearGradient(sh.x,sh.y,sh.x-sh.vx*9,sh.y-sh.vy*9);
      g.addColorStop(0,'rgba(255,255,255,'+Math.max(sh.life,0)+')');g.addColorStop(1,'rgba(143,91,255,0)');
      cx.strokeStyle=g;cx.lineWidth=2*dpr;cx.beginPath();cx.moveTo(sh.x,sh.y);cx.lineTo(sh.x-sh.vx*9,sh.y-sh.vy*9);cx.stroke();
      if(sh.life<=0)shoots.splice(j,1);
    }
    if(!reduce)requestAnimationFrame(frame);
  }
  if(reduce){frame(0)}else{requestAnimationFrame(frame)}

  /* ----- warp jump when using the nav ----- */
  document.querySelectorAll('nav a, .cta a').forEach(function(a){
    a.addEventListener('click',function(){warp=9});
  });

  /* ----- active nav link ----- */
  var links=[].slice.call(document.querySelectorAll('nav a'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'))});
  var spy=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})} });
  },{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(function(s){if(s)spy.observe(s)});

  /* ----- scroll reveals ----- */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){
      var sib=[].slice.call(e.target.parentNode.children).indexOf(e.target);
      e.target.style.transitionDelay=(Math.min(sib,5)*70)+'ms';
      e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.15});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  /* ----- portrait tilt follows the pointer ----- */
  var pic=document.getElementById('pic'), por=document.getElementById('portrait');
  por.addEventListener('pointermove',function(e){
    var r=por.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    pic.style.transform='rotateY('+(x*18)+'deg) rotateX('+(-y*18)+'deg)';
  });
  por.addEventListener('pointerleave',function(){pic.style.transform=''});

  /* ----- project cards: 3D tilt + glow ----- */
  document.querySelectorAll('.tilt').forEach(function(c){
    c.addEventListener('pointermove',function(e){
      var r=c.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
      c.style.transform='perspective(800px) rotateY('+((x-.5)*10)+'deg) rotateX('+((.5-y)*10)+'deg) translateY(-4px)';
      c.style.setProperty('--mx',(x*100)+'%');c.style.setProperty('--my',(y*100)+'%');
    });
    c.addEventListener('pointerleave',function(){c.style.transform=''});
  });
  /* ----- tesseract (4D cube) orbiting the portrait ----- */
  var tc=document.getElementById('tess'), tcx=tc.getContext('2d'), tOn=true, tv=[], te=[];
  for(var q=0;q<16;q++)tv.push([q&1?1:-1,q&2?1:-1,q&4?1:-1,q&8?1:-1]);
  for(var qa=0;qa<16;qa++)for(var qb=0;qb<4;qb++){var qc=qa^(1<<qb);if(qc>qa)te.push([qa,qc])}
  function tsize(){var d=Math.min(devicePixelRatio||1,2),r=tc.getBoundingClientRect();tc.width=Math.max(1,r.width*d);tc.height=Math.max(1,r.height*d)}
  tsize();addEventListener('resize',tsize);
  new IntersectionObserver(function(es){tOn=es[0].isIntersecting}).observe(por);
  function rot4(p,i,j,a){var c=Math.cos(a),s=Math.sin(a),x=p[i],y=p[j];p[i]=x*c-y*s;p[j]=x*s+y*c}
  function drawTess(ts){
    var w=tc.width,h=tc.height,d=Math.min(devicePixelRatio||1,2),t=ts*.001;
    tcx.clearRect(0,0,w,h);
    var pr=tv.map(function(v){var p=v.slice();
      rot4(p,0,3,t*.55+scrollY0*.0015);rot4(p,1,3,t*.38);rot4(p,2,3,t*.3);rot4(p,0,2,t*.25+mx*1.2);rot4(p,1,2,t*.12+my);
      var k=1/(2.6-p[3]),f=1/(2.4-p[2]*k);
      return {x:w/2+p[0]*k*f*w*.72,y:h/2+p[1]*k*f*h*.72,k:k,f:f,w:p[3]}});
    tcx.globalCompositeOperation='lighter';tcx.lineCap='round';
    te.forEach(function(e){
      var A=pr[e[0]],B=pr[e[1]],hot=((A.w+B.w)/2+1)/2;
      tcx.strokeStyle='rgba('+Math.round(143+hot*112)+','+Math.round(91+hot*93)+','+Math.round(255-hot*148)+','+Math.min(.9,.3+.45*(A.k+B.k))+')';
      tcx.lineWidth=(.8+(A.f+B.f))*d;tcx.beginPath();tcx.moveTo(A.x,A.y);tcx.lineTo(B.x,B.y);tcx.stroke();
    });
    pr.forEach(function(p){
      var r=(1.5+p.f*3)*d,g=tcx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*3);
      g.addColorStop(0,'rgba(255,230,200,.95)');g.addColorStop(.35,'rgba(255,122,184,.5)');g.addColorStop(1,'rgba(255,122,184,0)');
      tcx.fillStyle=g;tcx.fillRect(p.x-r*3,p.y-r*3,r*6,r*6);
    });
  }
  function tloop(ts){if(tOn)drawTess(ts);if(!reduce)requestAnimationFrame(tloop)}
  requestAnimationFrame(tloop);

  /* ----- certificate zoom ----- */
  var lb=document.getElementById('lb');
  ['certbtn','certthumb','certbtn2'].forEach(function(id){document.getElementById(id).addEventListener('click',function(){lb.classList.add('open')})});
  lb.addEventListener('click',function(){lb.classList.remove('open')});
  addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('open')});

  /* ----- copy email ----- */
  var cp=document.getElementById('copy'), addr='saifali557890@gmail.com';
  cp.addEventListener('click',function(){
    function done(){cp.textContent='Copied';setTimeout(function(){cp.textContent='Copy email'},1800)}
    function fallback(){var ta=document.createElement('textarea');ta.value=addr;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done()}catch(e){cp.textContent=addr}document.body.removeChild(ta)}
    try{navigator.clipboard.writeText(addr).then(done,fallback)}catch(e){fallback()}
  });

  /* ----- live demo buttons: ripple + "Opening..." feedback ----- */
  document.querySelectorAll('.demo').forEach(function(a){
    a.addEventListener('click',function(e){
      var r=a.getBoundingClientRect(),s=document.createElement('span'),lab=a.querySelector('.lbl');
      s.className='ripple';s.style.left=(e.clientX?e.clientX-r.left:r.width/2)+'px';s.style.top=(e.clientY?e.clientY-r.top:r.height/2)+'px';
      a.appendChild(s);setTimeout(function(){s.remove()},700);
      lab.textContent='Opening...';a.classList.add('go');
      setTimeout(function(){lab.textContent='Live demo';a.classList.remove('go')},1600);
    });
  });
})();
