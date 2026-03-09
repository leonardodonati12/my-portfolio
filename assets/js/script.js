import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

// --- 1. LÓGICA DE PULAR INTRO (SKIP) ---
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('skip') === 'true') {
    document.body.classList.add('active');
    const style = document.createElement('style');
    style.innerHTML = `
        #intro-overlay, #about-overlay, #phrases-overlay, #system-curtain { display: none !important; opacity: 0 !important; }
        .hero, .interaction-hint, .audio-toggle { opacity: 1 !important; transition-delay: 0s !important; }
    `;
    document.head.appendChild(style);
}

// --- 2. SELEÇÃO DE ELEMENTOS DOM ---
const introOverlay = document.getElementById('intro-overlay');
const aboutOverlay = document.getElementById('about-overlay');
const phrasesOverlay = document.getElementById('phrases-overlay');
const startBtn = document.getElementById('start-btn');
const bioContainer = document.getElementById('bio-text-container');
const aboutHint = document.getElementById('about-hint');
const phrasesContainer = document.getElementById('phrases-container');
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalTech = document.getElementById('modal-tech');
const modalDesc = document.getElementById('modal-desc');
const closeBtn = document.getElementById('close-modal-btn');
const modalLinkBtn = document.getElementById('modal-link-btn');
const heroName = document.getElementById('hero-name');
const nameLine1 = document.getElementById('name-line-1');
const nameLine2 = document.getElementById('name-line-2');
const heroSubtitle = document.getElementById('hero-subtitle');

// Callout Elements
const calloutContainer = document.getElementById('callout-container');
const calloutLabel = document.getElementById('callout-label');
const calloutLine = document.getElementById('callout-line');
let currentlyHoveredSphere = null;

// --- 3. SCRAMBLE TEXT ---
const roles = ["ARCHITECTURE STUDENT", "INNOVATION ASSISTANT", "BEGINNER DEVELOPER", "COMPUTATIONAL DESIGNER", "CURIOUS MIND", "BIM ENTHUSIAST"];
const roleEl = document.getElementById('scramble-text');
const chars = '!<>-_\\/[]{}—=+*^?#________';
let roleIndex = 0;
let loopTimeout = null;

const setText = (newText) => {
    if (!roleEl) return;
    const oldText = roleEl.innerText;
    const length = Math.max(oldText.length, newText.length);
    let queue = [];
    for (let i = 0; i < length; i++) {
        const from = oldText[i] || ''; const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40); const end = start + Math.floor(Math.random() * 40);
        queue.push({ from, to, start, end });
    }
    let frame = 0;
    const update = () => {
        let output = ''; let complete = 0;
        for (let i = 0; i < queue.length; i++) {
            let { from, to, start, end, char } = queue[i];
            if (frame >= end) { complete++; output += to; }
            else if (frame >= start) {
                if (!char || Math.random() < 0.28) { char = chars[Math.floor(Math.random() * chars.length)]; queue[i].char = char; }
                output += `<span style="color: #444;">${char}</span>`;
            } else { output += from; }
        }
        roleEl.innerHTML = output;
        if (complete === queue.length) loopTimeout = setTimeout(nextRole, 2000);
        else { requestAnimationFrame(update); frame++; }
    };
    update();
};
const nextRole = () => {
    if (document.body.classList.contains('active') || (aboutOverlay && aboutOverlay.style.display === 'flex')) return;
    setText(roles[roleIndex]); roleIndex = (roleIndex + 1) % roles.length;
};
if (roleEl) nextRole();

// --- 4. MATRIX REVEAL ---
function matrixReveal(element, text, callback) {
    if (!element) return;
    const mChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
    element.innerText = text.split('').map(c => (c === ' ' || c === '\n') ? c : mChars[Math.floor(Math.random() * mChars.length)]).join('');
    let iterations = 0;
    const interval = setInterval(() => {
        element.innerText = text.split('').map((letter, index) => {
            if (letter === ' ' || letter === '\n') return letter;
            if (index < iterations) return letter;
            return mChars[Math.floor(Math.random() * mChars.length)];
        }).join('');
        if (iterations >= text.length) { clearInterval(interval); if (callback) callback(); }
        iterations += 2;
    }, 15);
}

// --- 5. ENTER SYSTEM ---
const bioText = "I avoid definitions; I feel they limit me. Whenever I attempt to organize space, I end up rewriting the syntax of the place to create a narrative. I seek to make each piece obey an invisible rule and decide to tell a unique story. I persist in the attempt to compile everything that resonates with me...";
if (startBtn) {
    startBtn.addEventListener('click', () => {
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.display = 'none';
            aboutOverlay.style.display = 'flex';
            matrixReveal(bioContainer, bioText, () => { if (aboutHint) aboutHint.style.opacity = '1'; });
        }, 1000);
    });
}

// --- 6. ABOUT -> PHRASES ---
let bioFinished = false;
if (aboutOverlay) {
    aboutOverlay.addEventListener('click', () => {
        if (!bioFinished) { bioFinished = true; bioContainer.innerText = bioText; if (aboutHint) aboutHint.style.opacity = '1'; return; }
        aboutOverlay.style.opacity = '0';
        setTimeout(() => { aboutOverlay.style.display = 'none'; phrasesOverlay.style.display = 'flex'; if (phrasesContainer) phrasesContainer.innerText = ""; runPhrasesLoop(); }, 1000);
    });
}

// --- 7. PHRASES -> MAIN SITE ---
let stopPhrasesLoop = false;
if (phrasesOverlay) {
    phrasesOverlay.addEventListener('click', () => {
        stopPhrasesLoop = true; phrasesOverlay.style.opacity = '0';
        document.body.classList.add('active');
        setTimeout(() => { phrasesOverlay.style.display = 'none'; }, 1000);
    });
}

const phrasesList = ["I wrote the code, but you are the one rendering it.", "Careful where you click: some variables are loose.", "As you observe the project, the algorithm observes you.", "Don't be afraid. It is just logic trying to be art.", "Loading fragments of a thought process...", "This is not a website. It is a render of my consciousness.", "Here, gravity is just a syntax suggestion.", "You are not on the internet. You are inside a loop of my creative process.", "Space under construction. The mind, too.", "Don't touch the screen. The digital concrete is still wet.", "Are you the user, or just another parameter?", "Welcome to the backend of my imagination.", "Compiling chaos into structure. Please wait.", "Entry permitted. Exit not guaranteed.", "Everything here is code. Even the void.", "This is a portfolio. This is not a portfolio.", "You are in my mind now. Good luck.", "This page is thinking about you right now.", "Your visit has been logged. My architecture now knows who you are.", "To navigate here is to compile memories that are not yours.", "There is a system error: it has learned to feel."];
async function runPhrasesLoop() {
    let index = 0;
    while (!stopPhrasesLoop) {
        if (phrasesContainer) await scrambleTo(phrasesContainer, phrasesList[index]);
        if (stopPhrasesLoop) break; await new Promise(r => setTimeout(r, 4000));
        if (stopPhrasesLoop) break; index = (index + 1) % phrasesList.length;
    }
}
function scrambleTo(element, newText) {
    return new Promise(resolve => {
        const oldText = element.innerText; const length = Math.max(oldText.length, newText.length); const queue = []; const chars = '!<>-_\\/[]{}—=+*^?#________';
        for (let i = 0; i < length; i++) { const from = oldText[i] || ''; const to = newText[i] || ''; const start = Math.floor(Math.random() * 40); const end = start + Math.floor(Math.random() * 40); queue.push({ from, to, start, end }); }
        let frame = 0;
        const update = () => {
            let output = ''; let complete = 0;
            for (let i = 0; i < queue.length; i++) {
                let { from, to, start, end, char } = queue[i];
                if (frame >= end) { complete++; output += to; }
                else if (frame >= start) { if (!char || Math.random() < 0.28) { char = chars[Math.floor(Math.random() * chars.length)]; queue[i].char = char; } output += `<span class="glitch-char">${char}</span>`; }
                else { output += from; }
            }
            element.innerHTML = output;
            if (complete === queue.length) resolve();
            else { if (stopPhrasesLoop && element === phrasesContainer) { resolve(); return; } requestAnimationFrame(update); frame++; }
        };
        update();
    });
}

// --- 8. HOVER ON NAME ---
if (heroName) {
    heroName.addEventListener('mouseenter', () => { if (nameLine1) scrambleTo(nameLine1, "LEONARDO"); if (nameLine2) scrambleTo(nameLine2, "DONATI"); });
}
if (heroSubtitle) {
    heroSubtitle.addEventListener('mouseenter', () => { scrambleTo(heroSubtitle, "SCRAMBLED THOUGHTS"); });
    heroSubtitle.addEventListener('mouseleave', () => { scrambleTo(heroSubtitle, "ARCHITECTURE STUDENT"); });
}

// --- 9. SKILLS & PANELS ---
const mySkills = [
    { name: "REVIT / DYNAMO", level: 85 }, { name: "NAVISWORKS", level: 65 }, { name: "ARCHICAD / SKETCHUP", level: 65 },
    { name: "INFRAWORKS", level: 70 }, { name: "CLOUDCOMPARE / RECAP", level: 75 }, { name: "ADOBE TOOLS", level: 70 },
    { name: "POWER BI", level: 70 }, { name: "C# / PYTHON", level: 80 }, { name: "THREE.JS / WEBGL", level: 60 }, { name: "HTML / CSS / JS", level: 75 },
];
const skillsList = document.getElementById('skills-list');

if (skillsList) {
    mySkills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'skill-item';
        const totalBlocks = 20;
        const filledBlocks = Math.round((skill.level / 100) * totalBlocks);
        let blocksHTML = '';

        for (let i = 0; i < totalBlocks; i++) {
            blocksHTML += `<div class="bar-block ${i < filledBlocks ? 'filled' : ''}"></div>`;
        }

        item.innerHTML = `<div class="skill-name"><span>${skill.name}</span></div><div class="retro-bar">${blocksHTML}</div>`;

        skillsList.appendChild(item);
    });
}

if (document.getElementById('timeline-content')) {
    document.getElementById('timeline-content').innerHTML = `
        <div class="timeline-item"><div class="time-date">Mar 2025 - Present</div><div class="time-role">Spbim - Architecture Assistant</div><div class="time-place">S&atilde;o Paulo - SP</div><div class="time-desc">Development of interfaces and internal tools that overcometechnological limitations, connecting project stages and eliminating productionbottlenecks through computational intelligence.</div></div>
        <div class="timeline-item"><div class="time-date">Aug 2024 - Mar 2025</div><div class="time-role">Spbim - Architecture Intern</div><div class="time-place">S&atilde;o Paulo - SP</div><div class="time-desc">BIM implementation support, parametric modeling, point cloud (laser scanner), coordination.</div></div>
        <div class="timeline-item"><div class="time-date">Jan 2022 - Dec 2026</div><div class="time-role">Universidade Anhembi Morumbi</div><div class="time-desc">Bachelor of Architecture and Urbanism.</div></div>
        <div class="timeline-item"><div class="time-date">Oct 2020 - Apr 2021</div><div class="time-role">Tekno S.A. - Electrical Intern</div><div class="time-place">Guaratinguet&aacute; - SP</div><div class="time-desc">Analysis and development of electrical plans, preventive and corrective maintenance.</div></div>
        <div class="timeline-item"><div class="time-date">Jan 2017 - Dec 2019</div><div class="time-role">Col&eacute;gio T&eacute;cnico Industrial - Unesp</div><div class="time-desc">Technical High School.</div></div>
    `;
}
if (document.getElementById('extras-content')) {
    document.getElementById('extras-content').innerHTML = `
        <div class="extra-item"><div class="extra-title">Reconhecendo a Mooca</div><div class="extra-detail">Urban/architectural survey, photogrammetry, flow analysis, and heat islands.</div></div>
        <div class="extra-item"><div class="extra-title">Spbim Workshop Monitor</div><div class="extra-detail">Laser Scanner Surveys (May 2025).</div></div>
        <div class="extra-item"><div class="extra-title">OBA Medalist</div><div class="extra-detail">Gold (2015), Bronze (2016), Silver (2019).</div></div>
        <div class="extra-item"><div class="extra-title">Integration Week Monitor</div><div class="extra-detail">Ctig - Unesp (2018, 2019, 2020).</div></div>
        <div class="extra-item"><div class="extra-title">Class and Professor Coordinator</div><div class="extra-detail">SPBIM (2025 - Present)</div></div>
        <div class="extra-item"><div class="extra-title">Languages</div><div class="extra-detail">Portuguese [Native]<br>English [B2 - Intermediate]</div></div>
    `;
}
if (document.getElementById('contact-content')) {
    document.getElementById('contact-content').innerHTML = `
        <div class="contact-item"><div class="contact-label">Phone / WhatsApp</div><div class="contact-val">+55 12 99777 3790</div></div>
        <div class="contact-item"><div class="contact-label">Email</div><div class="contact-val"><a href="mailto:leonardodonati12@gmail.com">leonardodonati12@gmail.com</a></div></div>
        <div class="contact-item"><div class="contact-label">LinkedIn</div><div class="contact-val"><a href="https://linkedin.com/in/leonardodonati12/" target="_blank">in/leonardodonati12</a></div></div>
        <div class="contact-item"><div class="contact-label">GitHub</div><div class="contact-val"><a href="https://github.com/leonardodonati12" target="_blank">@leonardodonati12</a></div></div>
    `;
}

// --- 10. DRAG & DROP & PANELS ---
const folderStack = document.getElementById('folder-stack');
let draggedTab = null;
if (folderStack) {
    document.querySelectorAll('.folder-tab').forEach(tab => {
        tab.addEventListener('dragstart', (e) => { draggedTab = tab; tab.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
        tab.addEventListener('dragend', () => { draggedTab = null; tab.classList.remove('dragging'); });
        tab.addEventListener('click', () => { openPanel(tab.getAttribute('data-target')); });
    });
    folderStack.addEventListener('dragover', (e) => { e.preventDefault(); const afterElement = getDragAfterElement(folderStack, e.clientY); if (afterElement == null) folderStack.appendChild(draggedTab); else folderStack.insertBefore(draggedTab, afterElement); });
}
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.folder-tab:not(.dragging)')];
    return draggableElements.reduce((closest, child) => { const box = child.getBoundingClientRect(); const offset = y - box.top - box.height / 2; if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; else return closest; }, { offset: Number.NEGATIVE_INFINITY }).element;
}

const panels = document.querySelectorAll('.ui-panel'); 
function closePanel(panel) {
    panel.style.display = 'none';
    const target = document.querySelector(`[data-target="${panel.id}"]`);
    if (target) target.classList.remove('active-tab');

    if (!panel.classList.contains('floating')) {
        document.body.classList.remove('push-left', 'push-top', 'push-right', 'push-bottom');
    }

    // Limpa todas as classes de fuga do widget
    const cyberWidget = document.getElementById('cyber-widget');
    if (cyberWidget) cyberWidget.classList.remove('cyber-foge-esquerda', 'cyber-foge-cima', 'cyber-compensa');
}
function openPanel(panelId) {
    const panel = document.getElementById(panelId); if (!panel) return;
    panels.forEach(p => { if (p.id !== panelId && !p.classList.contains('floating')) closePanel(p); });

    panel.style.display = 'flex';
    const target = document.querySelector(`[data-target="${panelId}"]`);
    if (target) target.classList.add('active-tab');

    if (!panel.classList.contains('floating')) {
        dockPanel(panel, 'left');
    }
}
function dockPanel(panel, side) {
    panel.classList.remove('docked-left', 'docked-right', 'docked-top', 'docked-bottom', 'floating');
    panel.style.top = ''; panel.style.left = ''; panel.style.right = ''; panel.style.bottom = ''; panel.style.height = ''; panel.style.width = '';

    const cyberWidget = document.getElementById('cyber-widget');
    if (cyberWidget) cyberWidget.classList.remove('cyber-foge-esquerda', 'cyber-foge-cima', 'cyber-compensa');

    if (side !== 'float') {
        panel.classList.add(`docked-${side}`);
        document.body.classList.remove('push-left', 'push-top', 'push-right', 'push-bottom');
        document.body.classList.add(`push-${side}`);

        // Lógica Exclusiva do Cyber Widget
        if (cyberWidget) {
            if (side === 'right') {
                cyberWidget.classList.add('cyber-foge-esquerda');
            } else if (side === 'bottom') {
                cyberWidget.classList.add('cyber-foge-cima');
            } else if (side === 'left') {
                // Se abrir na esquerda e o body arrastar o widget pra direita, essa classe puxa ele de volta!
                cyberWidget.classList.add('cyber-compensa');
            }
        }
    } else {
        panel.classList.add('floating');
        document.body.classList.remove('push-left', 'push-top', 'push-right', 'push-bottom');
    }
}

let isDragging = false, dragPanel = null, diffX = 0, diffY = 0;
document.querySelectorAll('.panel-header').forEach(h => {
    h.addEventListener('mousedown', (e) => {
        dragPanel = h.parentElement; isDragging = true;
        const rect = dragPanel.getBoundingClientRect(); diffX = e.clientX - rect.left; diffY = e.clientY - rect.top;
        if (!dragPanel.classList.contains('floating')) { dockPanel(dragPanel, 'float'); dragPanel.style.height = 'auto'; dragPanel.style.left = (e.clientX - diffX) + 'px'; dragPanel.style.top = (e.clientY - diffY) + 'px'; }
        h.style.cursor = 'none'; document.body.style.cursor = 'none';
    });
});
window.addEventListener('mousemove', (e) => {
    if (!isDragging || !dragPanel) return;
    dragPanel.style.left = (e.clientX - diffX) + 'px'; dragPanel.style.top = (e.clientY - diffY) + 'px';
    const t = 50; if (e.clientX < t || e.clientX > window.innerWidth - t || e.clientY < t || e.clientY > window.innerHeight - t) dragPanel.style.borderColor = '#00ff88'; else dragPanel.style.borderColor = '#333';
});
window.addEventListener('mouseup', (e) => {
    if (!isDragging) return; isDragging = false;
    if (dragPanel) {
        dragPanel.querySelector('.panel-header').style.cursor = 'none'; dragPanel.style.borderColor = '#333';
        const t = 50; if (e.clientX < t) dockPanel(dragPanel, 'left'); else if (e.clientX > window.innerWidth - t) dockPanel(dragPanel, 'right'); else if (e.clientY < t) dockPanel(dragPanel, 'top'); else if (e.clientY > window.innerHeight - t) dockPanel(dragPanel, 'bottom');
        dragPanel = null;
    }
});
document.querySelectorAll('.close-panel').forEach(btn => btn.addEventListener('click', (e) => closePanel(e.target.closest('.ui-panel'))));

// --- 12. THREE.JS MAIN SCENE ---
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x050505, 0.002);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000); camera.position.set(-10, 5, 10); camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setSize(window.innerWidth, window.innerHeight);
if (document.getElementById('canvas-container')) document.getElementById('canvas-container').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = 0.05; controls.enableZoom = true; controls.autoRotate = true; controls.autoRotateSpeed = 0.25;

function getScreenPosition(object3D, camera, renderer) {
    const vector = new THREE.Vector3(); const canvas = renderer.domElement;
    vector.setFromMatrixPosition(object3D.matrixWorld); vector.project(camera);
    const x = (vector.x * 0.5 + 0.5) * canvas.clientWidth; const y = (vector.y * -0.5 + 0.5) * canvas.clientHeight;
    return { x, y };
}

const geometry = new THREE.IcosahedronGeometry(2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.15 });
const sphere = new THREE.Mesh(geometry, material);
sphere.userData = { isCenter: true };
scene.add(sphere);

const pGeo = new THREE.BufferGeometry(); const pCount = 10000; const pPos = new Float32Array(pCount * 3);
for (let i = 0; i < pCount * 3; i++) { pPos[i] = (Math.random() - 0.5) * 100; }
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); const pMat = new THREE.PointsMaterial({ size: 0.03, color: 0xffffff }); const particles = new THREE.Points(pGeo, pMat); scene.add(particles);

const projectNodes = []; const projectGroup = new THREE.Group(); scene.add(projectGroup);
const vertexShader = `varying vec3 vNormal; varying vec3 vViewVector; void main() { vNormal = normalize(normalMatrix * normal); vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 ); vViewVector = -mvPosition.xyz; gl_Position = projectionMatrix * mvPosition; }`;
const fragmentShader = `uniform vec3 c; uniform float p; uniform float glowIntensity; varying vec3 vNormal; varying vec3 vViewVector; void main() { vec3 normal = normalize( vNormal ); vec3 viewVector = normalize( vViewVector ); float dotProduct = dot( normal, viewVector ); float rim = 1.0 - max( dotProduct, 0.0 ); float finalIntensity = glowIntensity * pow( rim, p ); gl_FragColor = vec4( c, finalIntensity + (dotProduct*0.2) ); }`;

const projetosSimulados = [
    { titulo: "Reconhecendo a Mooca", tech: "Urbanismo / Fotogrametria", descricao: "Levantamento urbano e an&aacute;lise de fluxos." },
    { titulo: "Spbim Workshop", tech: "BIM / Laser Scan", descricao: "Monitoria de levantamento com nuvem de pontos." },
    { titulo: "Plugin Automation", tech: "C# / Revit API", descricao: "Desenvolvimento de automa&ccedil;&atilde;o para arquitetura." },
    { titulo: "Mooca", tech: "Grasshopper / Rhino", descricao: "Estudos de forma e fabrica&ccedil;&atilde;o digital." },
    { titulo: "Project 5", tech: "Grasshopper / Rhino", descricao: "Estudos de forma e fabrica&ccedil;&atilde;o digital." },
    { titulo: "Project 6", tech: "Grasshopper / Rhino", descricao: "Estudos de forma e fabrica&ccedil;&atilde;o digital." },
    { titulo: "Project 7", tech: "Future Tech", descricao: "Nova ideia flutuante." },
    { titulo: "Project 8", tech: "Future Tech", descricao: "Mais uma ideia conectada." },
];

fetch('projetos.json').then(r => r.json()).catch(() => projetosSimulados).then(projetos => {
    const radius = 6.5; const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // A. Cria as bolinhas e guarda a Posição Base delas
    projetos.forEach((proj, i) => {
        const y = 1 - (i / (projetos.length - 1)) * 2; const radiusAtY = Math.sqrt(1 - y * y); const theta = goldenAngle * i; const x = Math.cos(theta) * radiusAtY; const z = Math.sin(theta) * radiusAtY;
        const nodeMat = new THREE.ShaderMaterial({ uniforms: { "c": { type: "c", value: new THREE.Color(0xffffff) }, "p": { type: "f", value: 3.0 }, "glowIntensity": { type: "f", value: 1.5 } }, vertexShader: vertexShader, fragmentShader: fragmentShader, side: THREE.FrontSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
        const nodeGeo = new THREE.SphereGeometry(0.3, 32, 32); const node = new THREE.Mesh(nodeGeo, nodeMat);

        node.position.set(x * radius, y * radius, z * radius);
        node.userData = {
            id: i, data: proj, isNode: true, projectName: proj.titulo,
            basePosition: new THREE.Vector3(x * radius, y * radius, z * radius),
            randomSeed: Math.random() * 100
        };
        projectNodes.push(node); projectGroup.add(node);
    });

    // B. Calcula a Gaiola (Arestas)
    const esferas = projectNodes;
    if (esferas.length >= 2) {
        let possiveisArestas = [];
        for (let i = 0; i < esferas.length; i++) {
            for (let j = i + 1; j < esferas.length; j++) {
                const dist = esferas[i].position.distanceTo(esferas[j].position);
                possiveisArestas.push({ noA: i, noB: j, distancia: dist });
            }
        }
        possiveisArestas.sort((a, b) => a.distancia - b.distancia);

        const conexoesPorBolinha = new Array(esferas.length).fill(0);
        window.activeEdges = [];

        for (const aresta of possiveisArestas) {
            const i = aresta.noA;
            const j = aresta.noB;
            if (conexoesPorBolinha[i] < 4 && conexoesPorBolinha[j] < 4) {
                conexoesPorBolinha[i]++;
                conexoesPorBolinha[j]++;
                window.activeEdges.push({ a: esferas[i], b: esferas[j] });
            }
        }

        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, linewidth: 1 });
        window.moleculeBonds = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
        projectGroup.add(window.moleculeBonds);
    }
});

// --- INTERAÇÃO HÍBRIDA (MOUSE + TOUCH HOLD) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-100, -100);
let hoveredNode = null;
let isTouching = false;

function updateInputPosition(clientX, clientY) {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', (event) => { if (!isTouching) updateInputPosition(event.clientX, event.clientY); });
window.addEventListener('touchstart', (event) => { isTouching = true; if (event.touches.length > 0) updateInputPosition(event.touches[0].clientX, event.touches[0].clientY); }, { passive: false });
window.addEventListener('touchmove', (event) => { if (isTouching && event.touches.length > 0) updateInputPosition(event.touches[0].clientX, event.touches[0].clientY); }, { passive: false });
window.addEventListener('touchend', () => { isTouching = false; mouse.x = -100; mouse.y = -100; });

// EVENTO DE CLIQUE GLOBAL (Blindado para Mobile e Desktop)
window.addEventListener('click', (event) => {
    if (!document.body.classList.contains('active')) return;

    // O SEGREDO DO MOBILE: Pega a posição exata na hora que o clique acontece!
    if (event.clientX !== undefined && event.clientY !== undefined) {
        updateInputPosition(event.clientX, event.clientY);
    }

    // Se o clique foi em qualquer UI (menus, modais, pastas), ignoramos o 3D
    if (event.target.closest('.ui-panel') ||
        event.target.closest('.folder-tab') ||
        event.target.closest('#project-modal') ||
        event.target.closest('.close-modal') ||
        event.target.closest('#cyber-widget') ||
        event.target.closest('.audio-toggle') ||
        event.target.closest('.header-btn') ||
        event.target.closest('#mobile-menu-btn') ||
        event.target.closest('#mobile-dropdown')) return;

    // Dispara o laser virtual pra ver se acertou uma bolinha
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(projectNodes);

    if (intersects.length > 0) {
        // Acertou a bolinha! Abre o projeto!

        // [NOVO] MÚTUA EXCLUSÃO: Esconde a foto secreta imediatamente
        const secretCard = document.getElementById('secret-photo-card');
        const secretSvg = document.getElementById('secret-photo-line');
        if (secretCard) secretCard.style.opacity = '0';
        if (secretSvg) secretSvg.style.opacity = '0';

        openModal(intersects[0].object.userData.data);
    }
});

function openModal(data) {
    // Criamos uma mini-função que injeta os dados e faz a animação de abrir
    const updateContentAndOpen = () => {
        if (modalTitle) modalTitle.innerHTML = data.titulo;
        if (modalTech) modalTech.innerHTML = "// " + data.tech;
        if (modalDesc) modalDesc.innerHTML = data.descricao;

        if (modalLinkBtn) {
            modalLinkBtn.style.display = 'inline-block';
            const textToSearch = (data.titulo + " " + data.tech).toLowerCase();
            const isPlugin = textToSearch.includes('plugin') || textToSearch.includes('c#');

            if (isPlugin) {
                modalLinkBtn.href = "solutions/solutions.html";
                modalLinkBtn.innerHTML = "[ VIEW IN SOLUTIONS ]";
            } else {
                modalLinkBtn.href = "portfolio/portfolio.html";
                modalLinkBtn.innerHTML = "[ VIEW IN GALLERY ]";
            }
        }

        modal.style.display = 'flex';
        setTimeout(() => { modal.classList.add('open'); }, 10);
    };

    // A MÁGICA DA TROCA ACONTECE AQUI:
    if (modal && modal.classList.contains('open')) {
        // Se já está aberto, tira a classe para recolher o cartão
        modal.classList.remove('open');
        // Espera exatos 200ms (tempo da animação do seu CSS) e abre o novo!
        setTimeout(updateContentAndOpen, 200);
    } else {
        // Se estava fechado, só abre direto
        updateContentAndOpen();
    }
}


if (closeBtn) closeBtn.addEventListener('click', () => { if (modal) { modal.classList.remove('open'); setTimeout(() => { modal.style.display = 'none'; }, 500); } });
let lastMiddleClick = 0; window.addEventListener('mousedown', (e) => { if (e.button === 1) { e.preventDefault(); const now = Date.now(); if (now - lastMiddleClick < 500) controls.reset(); lastMiddleClick = now; } });

// ==========================================
// 2. A ANIMAÇÃO ÚNICA E CORRETA
// ==========================================
function animate() {
    requestAnimationFrame(animate); controls.update();

    if (document.body.classList.contains('active')) {
        raycaster.setFromCamera(mouse, camera);
        const intersectsNodes = raycaster.intersectObjects(projectNodes);
        const intersectsCenter = raycaster.intersectObject(sphere);

        if (!hoveredNode) { projectGroup.rotation.y -= 0.001; projectGroup.rotation.z += 0.0005; }

        if (intersectsNodes.length > 0) {
            const object = intersectsNodes[0].object;
            if (calloutContainer && calloutLabel && calloutLine) {
                calloutContainer.classList.add('visible'); calloutLabel.innerHTML = object.userData.projectName || "Projeto";
                const startPoint = getScreenPosition(object, camera, renderer); const endPoint = { x: startPoint.x + 80, y: startPoint.y - 60 };
                calloutLabel.style.left = `${endPoint.x}px`; calloutLabel.style.top = `${endPoint.y - 20}px`;
                const deltaX = endPoint.x - startPoint.x; const deltaY = endPoint.y - startPoint.y; const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY); const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                calloutLine.style.width = `${lineLength}px`; calloutLine.style.left = `${startPoint.x}px`; calloutLine.style.top = `${startPoint.y}px`; calloutLine.style.transform = `rotate(${angle}deg)`;
            }
            if (hoveredNode !== object) { if (hoveredNode) hoveredNode.material.uniforms.c.value.setHex(0xffffff); hoveredNode = object; hoveredNode.material.uniforms.c.value.setHex(0x00ff88); document.body.style.cursor = 'none'; }
        } else {
            if (calloutContainer) calloutContainer.classList.remove('visible');
            if (hoveredNode) { hoveredNode.material.uniforms.c.value.setHex(0xffffff); hoveredNode = null; document.body.style.cursor = 'none'; }
        }

        // --- VIBRAÇÃO CAÓTICA E ATUALIZAÇÃO DAS LINHAS ---
        const time = Date.now() * 0.001;

        projectNodes.forEach(node => {
            const targetScale = (node === hoveredNode) ? 1.5 : 1;
            node.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            if (node.userData.basePosition) {
                const base = node.userData.basePosition;
                const seed = node.userData.randomSeed;

                const freqX = 0.8 + (seed % 0.5);
                const freqY = 1.1 + (seed % 0.6);
                const freqZ = 0.9 + (seed % 0.4);
                const amplitude = 0.6; // Distância do movimento

                node.position.x = base.x + Math.sin(time * freqX + seed) * amplitude;
                node.position.y = base.y + Math.cos(time * freqY + seed) * amplitude;
                node.position.z = base.z + Math.sin(time * freqZ + seed) * amplitude;
            }
        });

        // Atualizar as linhas elásticas
        if (window.activeEdges && window.moleculeBonds) {
            const segments = [];
            const espacamento = 0.5; // Gap da linha até a bolinha

            window.activeEdges.forEach(edge => {
                const posA = edge.a.position;
                const posB = edge.b.position;

                const vetorAB = posB.clone().sub(posA);
                const direcaoAB = vetorAB.clone().normalize();

                const posA_nova = posA.clone().add(direcaoAB.clone().multiplyScalar(espacamento));
                const posB_nova = posB.clone().sub(direcaoAB.clone().multiplyScalar(espacamento));

                segments.push(posA_nova, posB_nova);
            });

            window.moleculeBonds.geometry.setFromPoints(segments);
        }

        if (intersectsCenter.length > 0) { sphere.rotation.y += 0.001; sphere.rotation.x += 0.001; sphere.material.opacity = THREE.MathUtils.lerp(sphere.material.opacity, 0.5, 0.05); } else { sphere.material.opacity = THREE.MathUtils.lerp(sphere.material.opacity, 0.15, 0.05); }
    }

    renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

// --- 13. AUDIO SYSTEM (SEM VISUALIZER) ---
const audioEl = document.getElementById('theme-audio');
const audioBtn = document.getElementById('audio-btn');
let isAudioPlaying = false;
let audioContext;

if (audioBtn) {
    audioBtn.innerHTML = 'SOUND OFF';
    audioBtn.classList.remove('playing');
}

function setupAudioContext() {
    if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    }
}

function toggleAudio() {
    if (!audioEl) return;
    setupAudioContext();
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();

    if (isAudioPlaying) {
        audioEl.pause();
        audioBtn.innerHTML = 'SOUND OFF';
        audioBtn.classList.remove('playing');
        isAudioPlaying = false;
    } else {
        audioEl.volume = 0.2;
        audioEl.play().then(() => {
            audioBtn.innerHTML = 'SOUND ON';
            audioBtn.classList.add('playing');
            isAudioPlaying = true;
        }).catch(err => console.log("Áudio bloqueado:", err));
    }
}

if (audioBtn) audioBtn.addEventListener('click', toggleAudio);

// --- 14. RESPONSIVO: MENU MOBILE E ZOOM DA CÂMERA ---

// 1. Zoom dinâmico do 3D baseado no tamanho da tela
function adjustCameraZoom() {
    if (window.innerWidth <= 700) {
        camera.position.z = 26; // <--- TELA PEQUENA: Afasta bem mais a câmera
    } else if (window.innerWidth <= 1000) {
        camera.position.z = 18; // <--- TABLET: Zoom intermediário
    } else {
        camera.position.z = 10; // <--- DESKTOP: Câmera normal
    }
}
// Roda ao carregar e ao redimensionar a janela
adjustCameraZoom();
window.addEventListener('resize', adjustCameraZoom);


// 2. Lógica do Menu Dropdown (Sumiço do botão e Click Outside)
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileDropdown = document.getElementById('mobile-dropdown');

// Função auxiliar rápida para fechar o menu e voltar o botão ☰ (AGORA COM ANIMAÇÃO!)
function closeMobileMenu() {
    if (mobileDropdown) {
        // 1. Adiciona a classe que faz o CSS encolher o menu
        mobileDropdown.classList.add('menu-saindo');

        // 2. Espera 250 milissegundos (o tempo do pulo) antes de apagar de vez
        setTimeout(() => {
            mobileDropdown.style.display = 'none';          // Apaga da tela
            mobileDropdown.classList.remove('menu-saindo'); // Limpa a classe pra próxima vez

            if (mobileMenuBtn) {
                mobileMenuBtn.style.display = 'block';      // Devolve o botão ☰
            }
        }, 250);
    }
}

if (mobileMenuBtn && mobileDropdown) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileDropdown.style.display = 'flex'; // Mostra o menu
        mobileMenuBtn.style.display = 'none';  // ESCONDE O BOTÃO ☰
    });

    // Fechar menu clicando em qualquer outro lugar da tela
    window.addEventListener('click', (e) => {
        if (mobileDropdown.style.display === 'flex' && !mobileDropdown.contains(e.target)) {
            closeMobileMenu(); // Agora ele chama a versão com animação suave!
        }
    });
}

// 3. Ligar os botões do Dropdown na IA, Arcade e ÁUDIO
document.getElementById('mob-ai')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileMenu(); // Escolheu a opção, o menu recolhe
    document.getElementById('ai-modal').classList.add('open');
});

document.getElementById('mob-game')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileMenu(); // Escolheu a opção, o menu recolhe
    document.getElementById('arcade-modal').classList.add('open');
});

// FAZENDO O BOTÃO DE SOM FUNCIONAR
document.getElementById('mob-audio')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileMenu(); // Recolhe o menu
    if (typeof toggleAudio === 'function') toggleAudio(); // Chama a sua função original de áudio!

    // Atualiza o texto do botão para o usuário saber o status
    setTimeout(() => {
        e.target.innerHTML = isAudioPlaying ? 'Sound off' : 'Sound on';
    }, 50);
});

document.querySelectorAll('.mob-panel-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileMenu(); // Escolheu o painel, o menu recolhe
        const targetId = link.getAttribute('data-target');
        if (typeof openPanel === 'function') openPanel(targetId);
    });
});

// 4. FECHAR IA, GAME E ABAS (PAINÉIS) CLICANDO FORA DELES
const iosFix = function () { };
document.documentElement.addEventListener('click', iosFix);
document.body.addEventListener('click', iosFix);
const canvasEl = document.querySelector('canvas');
if (canvasEl) canvasEl.addEventListener('click', iosFix);

// 1. GERENTE DE EXCLUSÃO MÚTUA
window.closeAllMobileUI = function (keepOpen) {
    if (window.innerWidth > 1000) return;

    const els = {
        menu: document.getElementById('mobile-dropdown'),
        menuBtn: document.getElementById('mobile-menu-btn'), // <-- RECUPERAMOS SEU BOTÃO AQUI!
        project: document.getElementById('project-modal'),
        photo: document.getElementById('secret-photo-card'),
        ai: document.getElementById('ai-modal'),
        arcade: document.getElementById('arcade-modal')
    };

    // MÁGICA: Fecha o Menu e faz o botão ☰ VOLTAR para a tela!
    if (keepOpen !== 'menu' && els.menu) {
        els.menu.style.display = 'none';
        if (els.menuBtn) els.menuBtn.style.display = 'block';
    }

    if (keepOpen !== 'project' && els.project) els.project.classList.remove('open');
    if (keepOpen !== 'ai' && els.ai) els.ai.classList.remove('open');
    if (keepOpen !== 'arcade' && els.arcade) els.arcade.classList.remove('open');
    if (keepOpen !== 'panel') {
        document.querySelectorAll('.ui-panel').forEach(p => p.style.display = 'none');
    }

    // Mata a foto fantasma
    if (keepOpen !== 'photo' && els.photo) {
        els.photo.style.opacity = '0';
        els.photo.style.pointerEvents = 'none';
    }
};

// 2. ABRIR PAINÉIS (Skills, Extras, etc)
document.querySelectorAll('.mob-panel-link, .folder-tab').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetId = link.getAttribute('data-target');

        if (window.innerWidth <= 1000) closeAllMobileUI('panel');

        if (typeof openPanel === 'function') openPanel(targetId);
        else {
            const panel = document.getElementById(targetId);
            if (panel) panel.style.display = 'flex';
        }
    });
});

// 3. CAPTURADOR DE COORDENADAS PRO 3D
window.addEventListener('pointerdown', (e) => {
    if (typeof mouse !== 'undefined' && e.clientX !== undefined) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
});

// 4. O CÉREBRO DA OPERAÇÃO 
// (O 'true' no final obriga isso a rodar ANTES de qualquer script antigo que você tenha!)
document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('active')) return;
    const t = event.target;
    if (!t) return;

    // --- HACK DO MENU: Intercepta o botão e sobrepõe códigos antigos! ---
    if (t.closest('#mobile-menu-btn')) {
        event.stopPropagation(); // Trava os scripts antigos pra não dar conflito
        const dropdown = document.getElementById('mobile-dropdown');
        const btn = document.getElementById('mobile-menu-btn');
        if (dropdown && btn) {
            dropdown.style.display = 'flex'; // Abre o menu
            btn.style.display = 'none';      // Esconde o botão ☰ temporariamente
            closeAllMobileUI('menu');        // Manda fechar a descrição do projeto, foto, etc!
        }
        return;
    }

    // --- LÓGICA DA FOTO SECRETA ---
    const isHeroText = t.closest('#name-line-1') || t.closest('#name-line-2');
    const secretCard = document.getElementById('secret-photo-card');

    if (isHeroText) {
        if (typeof closeAllMobileUI === 'function') closeAllMobileUI('photo');
        if (secretCard) {
            secretCard.style.opacity = '1';
            secretCard.style.pointerEvents = 'auto';
        }
        clearTimeout(window.photoTimerMobile);
        window.photoTimerMobile = setTimeout(() => {
            if (secretCard) {
                secretCard.style.opacity = '0';
                secretCard.style.pointerEvents = 'none';
            }
        }, 5000);
        return;
    }

    // --- MODO MOBILE: REGRAS DE FECHAR TUDO ---
    if (window.innerWidth <= 1000) {
        let clickedUI = 'none';
        if (t.closest('#mobile-dropdown')) clickedUI = 'menu';
        else if (t.closest('.mob-panel-link') || t.closest('.ui-panel')) clickedUI = 'panel';
        else if (t.closest('#mob-ai') || t.closest('#ai-modal')) clickedUI = 'ai';
        else if (t.closest('#mob-game') || t.closest('#arcade-modal')) clickedUI = 'arcade';
        else if (t.closest('#project-modal')) clickedUI = 'project';
        else if (t.closest('#secret-photo-card')) clickedUI = 'photo';

        closeAllMobileUI(clickedUI);
    }

    // --- RECUPERANDO OS PAINÉIS DO DESKTOP ---
    if (window.innerWidth > 1000) {
        const isPanelTrigger = t.closest('.mob-panel-link') || t.closest('.folder-tab');
        if (!isPanelTrigger) {
            document.querySelectorAll('.ui-panel').forEach(p => {
                if (p.style.display === 'flex' && !p.contains(t)) {
                    if (typeof closePanel === 'function') closePanel(p);
                    else p.style.display = 'none';
                }
            });
        }
        if (!isHeroText && secretCard && secretCard.style.opacity === '1' && !t.closest('#secret-photo-card')) {
            secretCard.style.opacity = '0';
            secretCard.style.pointerEvents = 'none';
        }
    }

    // --- PROTEÇÃO DO 3D ---
    if (t.closest('.ui-panel') || t.closest('.folder-tab') ||
        t.closest('#project-modal') || t.closest('.close-modal') ||
        t.closest('#cyber-widget') || t.closest('.audio-toggle') ||
        t.closest('.header-btn') || t.closest('#mobile-dropdown') ||
        t.closest('#hero-name')) return;

    // --- LASER 3D (Abre Projetos e fecha foto/menu) ---
    if (typeof raycaster !== 'undefined' && typeof camera !== 'undefined' && typeof projectNodes !== 'undefined') {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(projectNodes);

        if (intersects.length > 0) {
            if (window.innerWidth <= 1000) closeAllMobileUI('project');
            if (typeof openModal === 'function') openModal(intersects[0].object.userData.data);
        } else {
            const modal = document.getElementById('project-modal');
            if (modal && modal.classList.contains('open')) modal.classList.remove('open');
        }
    }
}, true);

// ==========================================
// 🎵 BOTÃO DE ÁUDIO MOBILE (ON / OFF)
// ==========================================
const mobAudioBtn = document.getElementById('mob-audio');
const themeAudio = document.getElementById('theme-audio');

if (mobAudioBtn && themeAudio) {
    mobAudioBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que o clique feche o menu acidentalmente

        if (themeAudio.paused) {
            themeAudio.play();
            mobAudioBtn.innerText = 'Sound off'; // Muda o texto
            mobAudioBtn.style.color = '#00ff88'; // Fica verde para indicar que tá tocando

            // Tenta sincronizar com o botão do PC também (se existir)
            const pcAudioBtn = document.getElementById('audio-btn');
            if (pcAudioBtn) pcAudioBtn.innerText = 'SOUND OFF';
        } else {
            themeAudio.pause();
            mobAudioBtn.innerText = 'Sound on'; // Muda o texto de volta
            mobAudioBtn.style.color = '#eee';   // Fica branco/cinza

            // Tenta sincronizar com o botão do PC
            const pcAudioBtn = document.getElementById('audio-btn');
            if (pcAudioBtn) pcAudioBtn.innerText = 'SOUND ON';
        }
    });
}