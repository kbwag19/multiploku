let widgetMode = 'explanatory';
let widgetSteps = [];
let widgetIndex = 0;

function PREPARE_WIDGET_STEPS(eq) {
  if (!eq) {
    widgetSteps = [];
    widgetIndex = 0;
    RENDER_WIDGET_STEP();
    return;
  }

  const leftVal = parseInt(getValue(eq.rowFactor));
  const rightVal = parseInt(getValue(eq.colFactor));
  const productVal = parseInt(getValue(eq.product));
  const unknown = getUnknownPart(eq);
  widgetSteps = [];

  function box(content) {
    return `<span class="eq-box">${content}</span>`;
  }

  function frac(n, d) {
    return `<span class="eq-box fraction"><span class="num">${n}</span><span class="frac-bar"></span><span class="den">${d}</span></span>`;
  }

  if (unknown === 'product') {
    widgetSteps.push({ html: `${box(leftVal)} \u00D7 ${box(rightVal)} = ${box('?')}`, note: 'Multiply the visible factors.' });
    widgetSteps.push({ html: `${box(leftVal)} \u00D7 ${box(rightVal)} = ${box(leftVal * rightVal)}`, note: '' });
  } else if (unknown === 'rowFactor' || unknown === 'colFactor') {
    const known = unknown === 'rowFactor' ? rightVal : leftVal;
    widgetSteps.push({ html: `${box(known)}${box('x')} = ${box(productVal)}`, note: `Divide each side of the equation by ${known}.` });
    widgetSteps.push({ html: `${frac(known, known)} ${box('x')} = ${frac(productVal, known)}`, note: '' });
    widgetSteps.push({ html: `${box('x')} = ${box(productVal / known)}`, note: '' });
  } else {
    widgetSteps.push({ html: `${box(leftVal)} \u00D7 ${box(rightVal)} = ${box(productVal)}`, note: '' });
  }

  widgetIndex = 0;
  RENDER_WIDGET_STEP();
}

function RENDER_WIDGET_STEP() {
  const stepEl = document.getElementById('widget-step');
  const noteEl = document.getElementById('widget-note');
  const backBtn = document.getElementById('widget-back');
  const nextBtn = document.getElementById('widget-next');
  if (!stepEl || !noteEl || !backBtn || !nextBtn) return;

  if (widgetSteps.length === 0) {
    stepEl.textContent = 'Select a cell';
    noteEl.textContent = '';
    backBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const step = widgetSteps[widgetIndex];
  stepEl.innerHTML = step.html || step.eq;
  noteEl.textContent = step.note || '';
  backBtn.disabled = widgetIndex === 0;
  nextBtn.disabled = widgetIndex === widgetSteps.length - 1;
}

function UPDATE_SOLVER_WIDGET(eq) {
  if (widgetMode !== 'explanatory') {
    RENDER_WIDGET_STEP();
    return;
  }
  PREPARE_WIDGET_STEPS(eq);
}

function BIND_WIDGET_CONTROLS() {
  const backBtn = document.getElementById('widget-back');
  const nextBtn = document.getElementById('widget-next');
  const modeRadios = document.getElementsByName('widget-mode');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (widgetIndex > 0) {
        widgetIndex--;
        RENDER_WIDGET_STEP();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (widgetIndex < widgetSteps.length - 1) {
        widgetIndex++;
        RENDER_WIDGET_STEP();
      }
    });
  }

  if (modeRadios && modeRadios.forEach) {
    modeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        widgetMode = e.target.value;
        const eq = typeof getActiveEquation === 'function' ? getActiveEquation() : null;
        UPDATE_SOLVER_WIDGET(eq);
      });
    });
  }
}

document.addEventListener('equation-updated', (e) => {
  UPDATE_SOLVER_WIDGET(e.detail?.equation || null);
});

document.addEventListener('DOMContentLoaded', () => {
  BIND_WIDGET_CONTROLS();
  RENDER_WIDGET_STEP();
});

window.updateSolverWidget = UPDATE_SOLVER_WIDGET;
