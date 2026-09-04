const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const regex = /@keyframes pulseSlowScale \{[\s\S]*?\.shiny-reveal::after \{[\s\S]*?z-index: 10;\n\}/;

const replacement = `@keyframes pulseSlowScale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shinySweep {
  0% {
    left: -100%;
  }
  20% {
    left: 200%;
  }
  100% {
    left: 200%;
  }
}

.shiny-reveal {
  position: relative;
  overflow: hidden;
}

.shiny-reveal::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-20deg);
  animation: shinySweep 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 10;
}`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/index.css', code);
