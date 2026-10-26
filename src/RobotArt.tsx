import { motion, useReducedMotion } from 'motion/react';

export default function RobotArt({ animate = true }: { animate?: boolean }) {
  const reduced = useReducedMotion();
  const enabled = animate && !reduced;
  return <svg className="robot-art" viewBox="0 0 480 350" fill="none" aria-hidden="true">
    <defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" opacity=".17" /></pattern></defs>
    <rect x="20" y="10" width="440" height="320" rx="40" fill="url(#dots)" />
    <motion.g animate={enabled ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '366px 73px' }}>
      <path d="m366 40 8 19 19-8-8 19 19 8-19 8 8 19-19-8-8 19-8-19-19 8 8-19-19-8 19-8-8-19 19 8Z" fill="#b6a7f3" />
    </motion.g>
    <ellipse cx="232" cy="284" rx="151" ry="24" fill="#286552" opacity=".09" />
    <path d="M59 191c-16-72 38-142 120-143M374 196c24 29 12 66-20 77" stroke="#91ad90" strokeWidth="1.5" strokeDasharray="5 7" />
    <path d="m173 42 9 6-8 7" stroke="#91ad90" strokeWidth="1.5" strokeLinecap="round" />
    <motion.g animate={enabled ? { y: [0, -7, 0], rotate: [0, -.8, 0] } : { y: 0 }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="m109 218 81-42 145 46-77 48Z" fill="#1a5145" />
      <path d="m109 218 149 45v19l-149-45Z" fill="#34725e" />
      <path d="m258 263 77-41v20l-77 40Z" fill="#123f36" />
      {[{x:123,y:232},{x:218,y:259},{x:290,y:248}].map((p,i)=><g key={i}>
        <ellipse cx={p.x} cy={p.y} rx="20" ry="27" transform={`rotate(-20 ${p.x} ${p.y})`} fill="#263a32" />
        <ellipse cx={p.x-5} cy={p.y} rx="10" ry="17" transform={`rotate(-20 ${p.x-5} ${p.y})`} fill="#6e8a74" />
        <ellipse cx={p.x-5} cy={p.y} rx="4" ry="7" transform={`rotate(-20 ${p.x-5} ${p.y})`} fill="#c8dfb4" />
      </g>)}
      <path d="m170 175 39-17 66 20-38 21Z" fill="#d8e8c4" stroke="#4f735b" strokeWidth="2" />
      <path d="m170 175 67 24v30l-67-23Z" fill="#a5c693" stroke="#4f735b" strokeWidth="2" />
      <path d="m237 199 38-21v29l-38 22Z" fill="#86ae7a" stroke="#4f735b" strokeWidth="2" />
      <path d="m187 186 35 12v15l-35-12Z" fill="#184e43" />
      <path d="m191 192 12 4m-12 1 20 7" stroke="#d8f8a4" strokeWidth="2" strokeLinecap="round" />
      <path d="m260 179 22-36 37 12-26 53" stroke="#4c6b56" strokeWidth="12" strokeLinejoin="round" />
      <path d="m260 179 22-36 37 12-26 53" stroke="#c7d7b2" strokeWidth="6" strokeLinejoin="round" />
      <path d="m282 143-42-51-19 12 38 75" stroke="#386351" strokeWidth="19" strokeLinejoin="round" />
      <path d="m282 143-42-51-19 12 38 75" stroke="#d0deb8" strokeWidth="10" strokeLinejoin="round" />
      <circle cx="282" cy="143" r="13" fill="#e7ae60" stroke="#49694e" strokeWidth="2" /><circle cx="282" cy="143" r="5" fill="#7b5e34" />
      <path d="m224 106-21-34-37 3" stroke="#55795e" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m224 106-21-34-37 3" stroke="#d5e1bd" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m167 74-18-11-17 13m35-1-14 18-19-5" stroke="#1d5948" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m133 78-15-9-15 8 15 11Z" fill="#edba73" /><path d="m103 77 15 11v17l-15-10Z" fill="#cd8d43" /><path d="m118 88 15-10v17l-15 10Z" fill="#dda45e" />
      <path d="m147 207 16-7m-4 12 16-7m77 24 13-7m1-1 13-7m-132-8 3 12m13-17 3 12" stroke="#e0ebce" strokeWidth="3" strokeLinecap="round" />
    </motion.g>
    <g transform="translate(326 267)"><rect width="104" height="29" rx="14.5" fill="#f7f9f0" stroke="#b8cabc" /><circle cx="15" cy="14.5" r="3" fill="#006b57" /><text x="27" y="19" fontSize="10" fontFamily="monospace" fill="#1c5848">ready to build</text></g>
    <g transform="translate(46 120)"><rect width="100" height="29" rx="10" fill="#e7e3f7" /><text x="12" y="19" fontFamily="monospace" fontSize="11" fill="#695694">spin(forward);</text></g>
    <circle cx="389" cy="175" r="6" fill="#e8ad63" /><path d="M70 267v14m-7-7h14" stroke="#7e9a75" strokeWidth="2" strokeLinecap="round" />
  </svg>;
}
