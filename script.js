import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

// --- ELEMENTOS DOM (Selecionando aqui para usar no Scramble) ---
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

// --- SUA NOVA FUNÇÃO: ROLE SCRAMBLE EFFECT ---
const roles = ["URBAN DESIGNER", "ARCHITECTURE STUDENT", "BEGINNER DEVELOPER", "COMPUTATIONAL DESIGNER", "CURIOUS MIND"];
const el = document.getElementById('scramble-text');
const chars = '!<>-_\\/[]{}—=+*^?#________';
let roleIndex = 0; let loopInterval = null;

const setText = (newText) => {
    const oldText = el.innerText;
    const length = Math.max(oldText.length, newText.length);
    let queue = [];
    for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(loopInterval);
    let frame = 0;
    const update = () => {
        let output = '';
        let complete = 0;
        for (let i = 0, n = queue.length; i < n; i++) {
            let { from, to, start, end, char } = queue[i];
            if (frame >= end) {
                complete++;
                output += to;
            } else if (frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = chars[Math.floor(Math.random() * chars.length)];
                    queue[i].char = char;
                }
                output += `<span style="color: #444;">${char}</span>`;
            } else {
                output += from;
            }
        }
        el.innerHTML = output;
        if (complete === queue.length) {
            setTimeout(nextRole, 2000);
        } else {
            loopInterval = requestAnimationFrame(update);
            frame++;
        }
    };
    update();
};

const nextRole = () => {
    // Para o loop se sair da tela de intro
    if (document.body.classList.contains('active') || aboutOverlay.style.display === 'flex') return;
    setText(roles[roleIndex]);
    roleIndex = (roleIndex + 1) % roles.length;
};

// Inicia o loop de roles assim que carrega
nextRole();


// --- DATA ---
const mySkills = [
    { name: "REVIT / BIM", level: 95 }, { name: "DYNAMO / PYTHON", level: 85 },
    { name: "RHINO / GRASSHOPPER", level: 80 }, { name: "NAVISWORKS", level: 75 },
    { name: "ARCHICAD", level: 70 }, { name: "INFRAWORKS / RECAP", level: 75 },
    { name: "SKETCHUP", level: 90 }, { name: "C# / API DEV", level: 65 },
    { name: "THREE.JS / WEBGL", level: 60 }, { name: "HTML / CSS / JS", level: 70 },
    { name: "POWER BI", level: 80 }, { name: "PHOTOSHOP / AI", level: 85 }
];

// --- POPULATE PANELS ---
const skillsList = document.getElementById('skills-list');
mySkills.forEach(skill => {
    const item = document.createElement('div'); item.className = 'skill-item';
    const totalBlocks = 20; const filledBlocks = Math.round((skill.level / 100) * totalBlocks);
    let blocksHTML = ''; for (let i = 0; i < totalBlocks; i++) { blocksHTML += `<div class="bar-block ${i < filledBlocks ? 'filled' : ''}"></div>`; }
    item.innerHTML = `<div class="skill-name"><span>${skill.name}</span><span class="skill-percent">${skill.level}%</span></div><div class="retro-bar">${blocksHTML}</div>`;
    skillsList.appendChild(item);
});

// Populate other panels via JS
document.getElementById('timeline-content').innerHTML = `
        <div class="timeline-item"><div class="time-date">Ago 2024 - Present</div><div class="time-role">Spbim - Estágio Arq</div><div class="time-place">São Paulo - SP</div><div class="time-desc">Implementação BIM, modelagem paramétrica, nuvem de pontos (laser scanner), compatibilização.</div></div>
        <div class="timeline-item"><div class="time-date">Oct 2020 - Apr 2021</div><div class="time-role">Tekno S.A. - Estágio Elétrica</div><div class="time-place">Guaratinguetá - SP</div><div class="time-desc">Análise e desenvolvimento de plantas elétricas, manutenção preventiva e corretiva.</div></div>
        <div class="timeline-item"><div class="time-date">Jan 2022 - Dec 2026</div><div class="time-role">Universidade Anhembi Morumbi</div><div class="time-desc">Arquitetura e Urbanismo (Superior).</div></div>
        <div class="timeline-item"><div class="time-date">Jan 2017 - Dec 2019</div><div class="time-role">Colégio Técnico Industrial - Unesp</div><div class="time-desc">Ensino Médio Técnico.</div></div>
    `;
document.getElementById('extras-content').innerHTML = `
        <div class="extra-item"><div class="extra-title">Reconhecendo a Mooca</div><div class="extra-detail">Levantamento urbano/arquitetônico, fotogrametria, análise de fluxos e ilhas de calor.</div></div>
        <div class="extra-item"><div class="extra-title">Monitoria Workshop Spbim</div><div class="extra-detail">Levantamentos com Laser Scanner (Maio 2025).</div></div>
        <div class="extra-item"><div class="extra-title">Medalhista OBA</div><div class="extra-detail">Ouro (2015), Bronze (2016), Prata (2019).</div></div>
        <div class="extra-item"><div class="extra-title">Monitoria Semana Integração</div><div class="extra-detail">Ctig - Unesp (2018, 2019, 2020).</div></div>
        <div class="extra-item"><div class="extra-title">Languages</div><div class="extra-detail">Portuguese (Native)<br>English (B1 - Intermediate)</div></div>
    `;
document.getElementById('contact-content').innerHTML = `
        <div class="contact-item"><div class="contact-label">Phone / WhatsApp</div><div class="contact-val">+55 12 99777 3790</div></div>
        <div class="contact-item"><div class="contact-label">Email</div><div class="contact-val"><a href="mailto:leonardodonati12@gmail.com">leonardodonati12@gmail.com</a></div></div>
        <div class="contact-item"><div class="contact-label">LinkedIn</div><div class="contact-val"><a href="https://linkedin.com/in/leonardodonati12/" target="_blank">in/leonardodonati12</a></div></div>
        <div class="contact-item"><div class="contact-label">GitHub</div><div class="contact-val"><a href="https://github.com/leonardodonati12" target="_blank">@leonardodonati12</a></div></div>
    `;

// --- TAB REORDERING LOGIC ---
const folderStack = document.getElementById('folder-stack');
let draggedTab = null;

document.querySelectorAll('.folder-tab').forEach(tab => {
    tab.addEventListener('dragstart', (e) => {
        draggedTab = tab;
        tab.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    tab.addEventListener('dragend', () => {
        draggedTab = null;
        tab.classList.remove('dragging');
    });

    tab.addEventListener('click', (e) => {
        openPanel(tab.getAttribute('data-target'));
    });
});

folderStack.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(folderStack, e.clientY);
    if (afterElement == null) {
        folderStack.appendChild(draggedTab);
    } else {
        folderStack.insertBefore(draggedTab, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.folder-tab:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// --- WINDOW MANAGER LOGIC ---
const panels = document.querySelectorAll('.ui-panel');
const body = document.body;
let activePanel = null;

function closePanel(panel) {
    panel.style.display = 'none';
    document.querySelector(`[data-target="${panel.id}"]`)?.classList.remove('active-tab');
    if (!panel.classList.contains('floating')) {
        body.classList.remove('push-left', 'push-top', 'push-right', 'push-bottom'); // Limpa tudo
    }
}

function openPanel(panelId) {
    const panel = document.getElementById(panelId);
    panels.forEach(p => { if (p.id !== panelId && !p.classList.contains('floating')) closePanel(p); });

    panel.style.display = 'flex';
    document.querySelector(`[data-target="${panelId}"]`)?.classList.add('active-tab');

    if (!panel.classList.contains('floating')) dockPanel(panel, 'left');
}

function dockPanel(panel, side) {
    panel.classList.remove('docked-left', 'docked-right', 'docked-top', 'docked-bottom', 'floating');
    panel.style.top = ''; panel.style.left = ''; panel.style.right = ''; panel.style.bottom = ''; panel.style.height = ''; panel.style.width = '';

    if (side !== 'float') {
        panel.classList.add(`docked-${side}`);
        body.classList.remove('push-left', 'push-top', 'push-right', 'push-bottom');
        // Adiciona classe de push correspondente
        body.classList.add(`push-${side}`);
    } else {
        panel.classList.add('floating');
        body.classList.remove('push-left', 'push-top', 'push-right', 'push-bottom');
    }
}

// --- DRAG PANELS ---
let isDragging = false, startX, startY, dragPanel = null, diffX = 0, diffY = 0;
document.querySelectorAll('.panel-header').forEach(h => {
    h.addEventListener('mousedown', (e) => {
        dragPanel = h.parentElement; isDragging = true;
        const rect = dragPanel.getBoundingClientRect(); diffX = e.clientX - rect.left; diffY = e.clientY - rect.top;
        if (!dragPanel.classList.contains('floating')) {
            dockPanel(dragPanel, 'float'); dragPanel.style.height = 'auto';
            dragPanel.style.left = (e.clientX - diffX) + 'px'; dragPanel.style.top = (e.clientY - diffY) + 'px';
        }
        h.style.cursor = 'grabbing';
    });
});
window.addEventListener('mousemove', (e) => {
    if (!isDragging || !dragPanel) return;
    dragPanel.style.left = (e.clientX - diffX) + 'px'; dragPanel.style.top = (e.clientY - diffY) + 'px';
    const t = 50;
    if (e.clientX < t) dragPanel.style.borderColor = '#00ff88';
    else if (e.clientX > window.innerWidth - t) dragPanel.style.borderColor = '#00ff88';
    else if (e.clientY < t) dragPanel.style.borderColor = '#00ff88';
    else if (e.clientY > window.innerHeight - t) dragPanel.style.borderColor = '#00ff88';
    else dragPanel.style.borderColor = '#333';
});
window.addEventListener('mouseup', (e) => {
    if (!isDragging) return; isDragging = false;
    if (dragPanel) {
        dragPanel.querySelector('.panel-header').style.cursor = 'grab'; dragPanel.style.borderColor = '#333';
        const t = 50;
        if (e.clientX < t) dockPanel(dragPanel, 'left');
        else if (e.clientX > window.innerWidth - t) dockPanel(dragPanel, 'right');
        else if (e.clientY < t) dockPanel(dragPanel, 'top');
        else if (e.clientY > window.innerHeight - t) dockPanel(dragPanel, 'bottom');
        dragPanel = null;
    }
});
document.querySelectorAll('.close-panel').forEach(btn => btn.addEventListener('click', (e) => closePanel(e.target.closest('.ui-panel'))));

// --- RESTO DO CÓDIGO ---
const bioText = "I avoid definitions; I feel they limit me.\n\nWhenever I attempt to organize space, I end up rewriting the syntax of the place to create a narrative.\n\nI seek to make each piece obey an invisible rule and decide to tell a unique story.\n\nI persist in the attempt to compile everything that resonates with me...";
const phrasesList = ["I wrote the code, but you are the one rendering it.", "Careful where you click: some variables are loose.", "As you observe the project, the algorithm observes you.", "Don't be afraid. It is just logic trying to be art.", "Loading fragments of a thought process...", "This is not a website. It is a render of my consciousness.", "Here, gravity is just a syntax suggestion.", "You are not on the internet. You are inside a loop of my creative process.", "Space under construction. The mind, too.", "Don't touch the screen. The digital concrete is still wet.", "Are you the user, or just another parameter?", "Welcome to the backend of my imagination.", "Compiling chaos into structure. Please wait.", "Entry permitted. Exit not guaranteed.", "Everything here is code. Even the void.", "This is a portfolio. This is not a portfolio.", "You are in my mind now. Good luck.", "This page is thinking about you right now.", "Your visit has been logged. My architecture now knows who you are.", "To navigate here is to compile memories that are not yours.", "There is a system error: it has learned to feel."];

heroName.addEventListener('mouseenter', () => { scrambleTo(nameLine1, "LEONARDO"); scrambleTo(nameLine2, "DONATI"); });
heroSubtitle.addEventListener('mouseenter', () => { scrambleTo(heroSubtitle, "SCRAMBLED THOUGHTS"); });
heroSubtitle.addEventListener('mouseleave', () => { scrambleTo(heroSubtitle, "ARCHITECTURE STUDENT"); });

startBtn.addEventListener('click', () => {
    introOverlay.style.opacity = '0';
    setTimeout(() => {
        introOverlay.style.display = 'none';
        aboutOverlay.style.display = 'flex';
        runGhostTypewriter(bioText, bioContainer, () => { aboutHint.style.opacity = '1'; });
    }, 1000);
});

let bioFinished = false;
aboutOverlay.addEventListener('click', () => {
    if (!bioFinished) {
        bioFinished = true;
        const spans = bioContainer.querySelectorAll('span');
        spans.forEach(s => { s.className = ''; s.innerText = s.dataset.char; s.style.opacity = '1'; });
        aboutHint.style.opacity = '1';
        return;
    }
    aboutOverlay.style.opacity = '0';
    setTimeout(() => {
        aboutOverlay.style.display = 'none';
        phrasesOverlay.style.display = 'flex';
        phrasesContainer.innerText = "";
        runPhrasesLoop();
    }, 1000);
});

let stopPhrasesLoop = false;
phrasesOverlay.addEventListener('click', () => {
    stopPhrasesLoop = true;
    phrasesOverlay.style.opacity = '0';
    document.body.classList.add('active');
    setTimeout(() => { phrasesOverlay.style.display = 'none'; }, 1000);
});

async function runPhrasesLoop() {
    let index = 0;
    while (!stopPhrasesLoop) {
        await scrambleTo(phrasesContainer, phrasesList[index]);
        if (stopPhrasesLoop) break;
        await new Promise(r => setTimeout(r, 4000));
        if (stopPhrasesLoop) break;
        index = (index + 1) % phrasesList.length;
    }
}

function scrambleTo(element, newText) {
    return new Promise(resolve => {
        const oldText = element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const queue = [];
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            queue.push({ from, to, start, end });
        }
        let frame = 0;
        const update = () => {
            let output = '';
            let complete = 0;
            for (let i = 0; i < queue.length; i++) {
                let { from, to, start, end, char } = queue[i];
                if (frame >= end) {
                    complete++;
                    output += to;
                } else if (frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = chars[Math.floor(Math.random() * chars.length)];
                        queue[i].char = char;
                    }
                    output += `<span class="glitch-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            element.innerHTML = output;
            if (complete === queue.length) {
                resolve();
            } else {
                if (stopPhrasesLoop && element === phrasesContainer) { resolve(); return; }
                requestAnimationFrame(update);
                frame++;
            }
        };
        update();
    });
}

async function runGhostTypewriter(text, element, callback) {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    element.innerHTML = '';
    const spans = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '\n') {
            element.appendChild(document.createElement('br'));
            spans.push({ isBreak: true });
        } else {
            const span = document.createElement('span');
            span.innerText = char;
            span.dataset.char = char;
            span.className = 'char-hidden';
            element.appendChild(span);
            spans.push({ dom: span, isBreak: false });
        }
    }
    for (let i = 0; i < spans.length; i++) {
        if (bioFinished) break;
        const item = spans[i];
        if (item.isBreak) { await new Promise(r => setTimeout(r, 30)); continue; }
        const span = item.dom;
        if (span.innerText === ' ') {
            span.className = '';
            span.innerHTML = '&nbsp;';
            span.style.opacity = '1';
            await new Promise(r => setTimeout(r, 5));
            continue;
        }
        span.className = 'glitch-char';
        span.style.opacity = '1';
        for (let j = 0; j < 3; j++) {
            span.innerText = chars[Math.floor(Math.random() * chars.length)];
            await new Promise(r => setTimeout(r, 10));
        }
        span.innerText = span.dataset.char;
        span.className = '';
    }
    bioFinished = true;
    if (callback) callback();
}

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
window.addEventListener('mousemove', function (e) {
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
});
const addHoverEffect = (element) => {
    element.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
    });
    element.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
};
addHoverEffect(startBtn);
addHoverEffect(aboutOverlay);
addHoverEffect(phrasesOverlay);
addHoverEffect(closeBtn);
addHoverEffect(heroName);
addHoverEffect(heroSubtitle);
document.querySelectorAll('.panel-header').forEach(h => addHoverEffect(h));
document.querySelectorAll('.folder-tab').forEach(i => addHoverEffect(i));
document.getElementById('portfolio-btn').addEventListener('mouseenter', () => {
    cursorOutline.style.width = '60px';
    cursorOutline.style.height = '60px';
    cursorOutline.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
});
document.getElementById('portfolio-btn').addEventListener('mouseleave', () => {
    cursorOutline.style.width = '40px';
    cursorOutline.style.height = '40px';
    cursorOutline.style.backgroundColor = 'transparent';
});

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.002);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-10, 5, 10);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.autoRotate = false;
const geometry = new THREE.IcosahedronGeometry(4, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.15 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
const pGeo = new THREE.BufferGeometry();
const pCount = 2000;
const pPos = new Float32Array(pCount * 3);
for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 30;
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({ size: 0.03, color: 0xffffff });
const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const projectNodes = [];
fetch('projetos.json').then(r => r.json()).then(projetos => {
    const projectGroup = new THREE.Group();
    scene.add(projectGroup);
    const radius = 6.5;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    projetos.forEach((proj, i) => {
        const y = 1 - (i / (projetos.length - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        const nodeGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(x * radius, y * radius, z * radius);
        node.userData = { id: i, data: proj };
        projectNodes.push(node);
        projectGroup.add(node);
    });
}).catch(e => console.error(e));
window.addEventListener('click', (event) => {
    if (!document.body.classList.contains('active')) return;
    if (event.target.closest('.ui-panel') || event.target.closest('.folder-tab') || event.target.closest('#project-modal') || event.target.closest('.close-modal')) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(projectNodes);
    if (intersects.length > 0) {
        const clickedNode = intersects[0].object;
        const projectData = clickedNode.userData.data;
        openModal(projectData);
    }
});
function openModal(data) {
    modalTitle.innerText = data.titulo;
    modalTech.innerText = "// " + data.tech;
    modalDesc.innerText = data.descricao;
    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.add('open'); }, 10);
}
closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
    setTimeout(() => { modal.style.display = 'none'; }, 500);
});
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});