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
    panel.style.display = 'none'; const target = document.querySelector(`[data-target="${panel.id}"]`); if (target) target.classList.remove('active-tab');
    if (!panel.classList.contains('floating')) { document.body.classList.remove('push-left', 'push-top', 'push-right', 'push-bottom'); }
}
function openPanel(panelId) {
    const panel = document.getElementById(panelId); if (!panel) return;
    panels.forEach(p => { if (p.id !== panelId && !p.classList.contains('floating')) closePanel(p); });
    panel.style.display = 'flex'; const target = document.querySelector(`[data-target="${panelId}"]`); if (target) target.classList.add('active-tab');
    if (!panel.classList.contains('floating')) dockPanel(panel, 'left');
}
function dockPanel(panel, side) {
    panel.classList.remove('docked-left', 'docked-right', 'docked-top', 'docked-bottom', 'floating');
    panel.style.top = ''; panel.style.left = ''; panel.style.right = ''; panel.style.bottom = ''; panel.style.height = ''; panel.style.width = '';
    if (side !== 'float') { panel.classList.add(`docked-${side}`); document.body.classList.remove('push-left', 'push-top', 'push-right', 'push-bottom'); document.body.classList.add(`push-${side}`); }
    else { panel.classList.add('floating'); document.body.classList.remove('push-left', 'push-top', 'push-right', 'push-bottom'); }
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
const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = 0.05; controls.enableZoom = true; controls.autoRotate = true; controls.autoRotateSpeed = 0.05;

function getScreenPosition(object3D, camera, renderer) {
    const vector = new THREE.Vector3(); const canvas = renderer.domElement;
    vector.setFromMatrixPosition(object3D.matrixWorld); vector.project(camera);
    const x = (vector.x * 0.5 + 0.5) * canvas.clientWidth; const y = (vector.y * -0.5 + 0.5) * canvas.clientHeight;
    return { x, y };
}

const geometry = new THREE.IcosahedronGeometry(4, 2); const material = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.15 }); const sphere = new THREE.Mesh(geometry, material); sphere.userData = { isCenter: true }; scene.add(sphere);
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
    { titulo: "Pavilh&atilde;o Param&eacute;trico", tech: "Grasshopper / Rhino", descricao: "Estudos de forma e fabrica&ccedil;&atilde;o digital." }
];

fetch('projetos.json').then(r => r.json()).catch(() => projetosSimulados).then(projetos => {
    const radius = 6.5; const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    projetos.forEach((proj, i) => {
        const y = 1 - (i / (projetos.length - 1)) * 2; const radiusAtY = Math.sqrt(1 - y * y); const theta = goldenAngle * i; const x = Math.cos(theta) * radiusAtY; const z = Math.sin(theta) * radiusAtY;
        const nodeMat = new THREE.ShaderMaterial({ uniforms: { "c": { type: "c", value: new THREE.Color(0xffffff) }, "p": { type: "f", value: 3.0 }, "glowIntensity": { type: "f", value: 1.5 } }, vertexShader: vertexShader, fragmentShader: fragmentShader, side: THREE.FrontSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
        const nodeGeo = new THREE.SphereGeometry(0.3, 32, 32); const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(x * radius, y * radius, z * radius); node.userData = { id: i, data: proj, isNode: true, projectName: proj.titulo };
        projectNodes.push(node); projectGroup.add(node);
    });
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

// 1. MOUSE
window.addEventListener('mousemove', (event) => {
    if (!isTouching) {
        updateInputPosition(event.clientX, event.clientY);
    }
});

// 2. TOUCH START
window.addEventListener('touchstart', (event) => {
    isTouching = true;
    if (event.touches.length > 0) {
        updateInputPosition(event.touches[0].clientX, event.touches[0].clientY);
    }
}, { passive: false });

// 3. TOUCH MOVE
window.addEventListener('touchmove', (event) => {
    if (isTouching && event.touches.length > 0) {
        updateInputPosition(event.touches[0].clientX, event.touches[0].clientY);
    }
}, { passive: false });

// 4. TOUCH END
window.addEventListener('touchend', () => {
    isTouching = false;
    mouse.x = -100;
    mouse.y = -100;
});

// Clique Global (Modal)
window.addEventListener('click', (event) => {
    if (!document.body.classList.contains('active')) return;
    if (event.target.closest('.ui-panel') || event.target.closest('.folder-tab') || event.target.closest('#project-modal') || event.target.closest('.close-modal')) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(projectNodes);
    if (intersects.length > 0) {
        const object = intersects[0].object;
        openModal(object.userData.data);
    }
});

function openModal(data) { if (modalTitle) modalTitle.innerHTML = data.titulo; if (modalTech) modalTech.innerHTML = "// " + data.tech; if (modalDesc) modalDesc.innerHTML = data.descricao; if (modal) { modal.style.display = 'flex'; setTimeout(() => { modal.classList.add('open'); }, 10); } }
if (closeBtn) closeBtn.addEventListener('click', () => { if (modal) { modal.classList.remove('open'); setTimeout(() => { modal.style.display = 'none'; }, 500); } });
let lastMiddleClick = 0; window.addEventListener('mousedown', (e) => { if (e.button === 1) { e.preventDefault(); const now = Date.now(); if (now - lastMiddleClick < 500) controls.reset(); lastMiddleClick = now; } });

function animate() {
    requestAnimationFrame(animate); controls.update();
    if (document.body.classList.contains('active')) {
        raycaster.setFromCamera(mouse, camera); const intersectsNodes = raycaster.intersectObjects(projectNodes); const intersectsCenter = raycaster.intersectObject(sphere);
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
        projectNodes.forEach(node => { const targetScale = (node === hoveredNode) ? 1.5 : 1; node.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1); });
        if (intersectsCenter.length > 0) { sphere.rotation.y += 0.001; sphere.rotation.x += 0.001; sphere.material.opacity = THREE.MathUtils.lerp(sphere.material.opacity, 0.5, 0.05); } else { sphere.material.opacity = THREE.MathUtils.lerp(sphere.material.opacity, 0.15, 0.05); }
    }
    renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); if (canvas) canvas.width = window.innerWidth; });

// --- 13. AUDIO SYSTEM (SEM VISUALIZER) ---
const audioEl = document.getElementById('theme-audio');
const audioBtn = document.getElementById('audio-btn');

let isAudioPlaying = false;
let audioContext;

function setupAudioContext() {
    // Mantemos o Context apenas para lidar com políticas de Autoplay do navegador
    if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    }
}

function toggleAudio() {
    if (!audioEl) return;
    setupAudioContext();

    // Garante que o contexto de áudio esteja rodando
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();

    if (isAudioPlaying) {
        audioEl.pause();
        audioBtn.innerHTML = 'SOUND OFF';
        audioBtn.classList.remove('playing');
        isAudioPlaying = false;
    } else {
        audioEl.play().then(() => {
            audioBtn.innerHTML = 'SOUND ON';
            audioBtn.classList.add('playing');
            isAudioPlaying = true;
        }).catch(err => console.log("Áudio bloqueado:", err));
    }
}

if (audioBtn) audioBtn.addEventListener('click', toggleAudio);

if (startBtn) {
    startBtn.addEventListener('click', () => {
        setupAudioContext();
        if (audioEl && !isAudioPlaying) {
            audioEl.volume = 0;
            audioEl.play().then(() => {
                isAudioPlaying = true;
                audioBtn.innerHTML = 'SOUND ON';
                audioBtn.classList.add('playing');
                // Fade in suave
                let vol = 0;
                const fade = setInterval(() => {
                    if (vol < 0.2) { vol += 0.01; audioEl.volume = vol; } else { clearInterval(fade); }
                }, 100);
            }).catch(e => console.log("Autoplay aguardando interação."));
        }
    });
}

