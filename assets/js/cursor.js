// cursor.js - Gerenciador Global do Cursor
const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursorDot);

const cursorOutline = document.createElement('div');
cursorOutline.className = 'cursor-outline';
document.body.appendChild(cursorOutline);

window.addEventListener('mousemove', function (e) {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Dot segue instantaneamente
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Outline segue com delay (efeito smooth)
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Efeito de Hover em links e botões
const addHoverEffect = () => {
    const interactables = document.querySelectorAll('a, button, .folder-tab, .panel-header, .close-modal, .skill-tag');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
};

// Executa ao carregar
document.addEventListener('DOMContentLoaded', addHoverEffect);