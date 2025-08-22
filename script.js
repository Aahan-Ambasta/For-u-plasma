// Scene elements
const scenes = [
  document.getElementById('scene1'),
  document.getElementById('scene2'),
  document.getElementById('scene3')
];
let current = 0;

// Koala follows pointer (throttled)
const koala = document.getElementById('koala');
let ktimer = null;
window.addEventListener('mousemove', e => {
  if (ktimer) return;
  ktimer = setTimeout(() => {
    koala.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    ktimer = null;
  }, 16);
});

// Utility: show next scene
function showScene(i) {
  scenes[current].classList.remove('active');
  scenes[i].classList.add('active');
  current = i;
  if (i === 2) {
    startConfetti();
    startEmojis();
  }
}

// Scene 1: Drag‐to‐reveal
;(function(){
  const moon = document.getElementById('moon');
  const msg1 = document.getElementById('msg1');
  let dragging = false, startX=0;

  moon.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    let dx = e.clientX - startX;
    moon.style.transform = `translateX(${dx}px) scale(1.1)`;
  });
  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    moon.style.transform = '';
    msg1.style.opacity = 1;
    msg1.style.transform = 'translateY(0)';
    setTimeout(() => showScene(1), 600);
  });
})();

// Scene 2: Hold‐to‐reveal
;(function(){
  const leopard = document.getElementById('leopard');
  const msg2    = document.getElementById('msg2');
  let timer;

  leopard.addEventListener('mousedown', () => {
    timer = setTimeout(() => {
      msg2.style.opacity = 1;
      msg2.style.transform = 'translateY(0)';
      setTimeout(() => showScene(2), 800);
    }, 800);
  });
  document.addEventListener('mouseup', () => {
    clearTimeout(timer);
  });
})();

// Scene 3: Confetti Finale
function startConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  let W, H, confs = [];
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i=0; i<80; i++){
    confs.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: 2+Math.random()*4,
      d: Math.random()*60,
      color: ['#0ff','#f06','#ff0'][i%3],
      tilt: Math.random()*10
    });
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    confs.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r, p.r/2, p.tilt, 0,2*Math.PI);
      ctx.fill();
      p.y += Math.cos(p.d)+1+p.r/2;
      p.x += Math.sin(0.01);
      if (p.y>H) p.y = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();

  setTimeout(() => {
    document.getElementById('finalMsg').style.opacity = 1;
  }, 500);
}

// Flying emojis generator
function startEmojis() {
  const container = document.getElementById('emoji-container');
  const emojis = ['🎉','💖','✨','🥳','🌟','🌈','🦋','🐨','🌙','🦄'];
  for (let i = 0; i < 15; i++) {
    const span = document.createElement('span');
    span.className = 'emoji-fly';
    span.textContent = emojis[i % emojis.length];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.animationDelay = (Math.random() * 3) + 's';
    span.style.fontSize = (1 + Math.random()*1.5) + 'rem';
    container.appendChild(span);
  }
}

// kick it off
scenes[0].classList.add('active');
