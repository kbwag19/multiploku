    // Global variables
    let validationActive = false;
    let cellElements = [];
    let currentDifficulty = 'beginner';
      let selectedCells = [];
      let activeCellInEquation = null; // Track which cell in the equation is the "active" one
      let equations = [];
      let dotsRotated = false;

      const colorMap = {
        1: "#1f2f3d",
        2: "#23384a",
        3: "#274156",
        4: "#2b4b63",
        5: "#305470",
        6: "#355e7d",
        7: "#3a688a",
        8: "#3f7297",
        9: "#457ca3"
      };

    // --- Utility Functions ---
    function getRowCol(cell) {
      const index = [...cell.parentNode.children].indexOf(cell);
      return {
        row: Math.floor(index / 4),
        col: index % 4,
        index: index
      };
    }

    function getCellAt(grid, row, col) {
      return grid.children[row * 4 + col];
    }

    function getValue(cell) {
      const input = cell.querySelector('input');
      if (input) return input.value.trim();
      
      const { row, col } = getRowCol(cell);
      const match = cellElements.find(c => c.row === row && c.col === col);
      return match ? match.value : '';
    }

    function isProductCell(cell) {
      const { row, col } = getRowCol(cell);
      return row > 0 && col > 0;
    }

    function isFactorCell(cell) {
      const { row, col } = getRowCol(cell);
      return (row === 0 && col > 0) || (row > 0 && col === 0);
    }

    function isCellVisible(cell) {
      return !cell.classList.contains('hidden');
    }

    function cellHasCorrectValue(cell) {
      if (isCellVisible(cell)) return true;
      const input = cell.querySelector('input');
      if (!input) return false;
      const { row, col } = getRowCol(cell);
      const obj = cellElements.find(c => c.row === row && c.col === col);
      return obj && input.value.trim() === obj.value;
    }

    function updateEquationVisual(eq) {
      const container = document.getElementById('equation-visual');
      const xLabel = document.getElementById('x-axis-label');
      const yLabel = document.getElementById('y-axis-label');
      if (!container) return;
      container.innerHTML = '';
      if (!eq) {
        container.style.display = 'none';
        if (xLabel) xLabel.textContent = '';
        if (yLabel) yLabel.textContent = '';
        return;
      }

      const rVis = isCellVisible(eq.rowFactor);
      const cVis = isCellVisible(eq.colFactor);
      const rCorrect = cellHasCorrectValue(eq.rowFactor);
      const cCorrect = cellHasCorrectValue(eq.colFactor);

      const leftVal = parseInt(getValue(eq.rowFactor));
      const rightVal = parseInt(getValue(eq.colFactor));

      if (!(rVis || rCorrect) || !(cVis || cCorrect) || isNaN(leftVal) || isNaN(rightVal)) {
        container.style.display = 'flex';
        container.innerHTML = '<div class="solve-msg">?</div>';
        if (xLabel) xLabel.textContent = '';
        if (yLabel) yLabel.textContent = '';
        return;
      }

      const rows = leftVal;
      const cols = rightVal;
      container.style.display = 'grid';
      container.style.gridTemplateRows = `repeat(${rows}, auto)`;
      container.style.gridTemplateColumns = `repeat(${cols}, auto)`;

      if (xLabel && yLabel) {
        if (dotsRotated) {
          xLabel.textContent = rows;
          yLabel.textContent = cols;
        } else {
          xLabel.textContent = cols;
          yLabel.textContent = rows;
        }
      }

      const color = colorMap[leftVal] || '#b3d8da';
      for (let i = 0; i < rows * cols; i++) {
        const span = document.createElement('span');
        span.className = 'object';
        span.style.backgroundColor = color;
        container.appendChild(span);
      }
    }

    function findEquationWithCell(cell) {
      return equations.find(eq => 
        eq.rowFactor === cell || eq.colFactor === cell || eq.product === cell
      );
    }

    function findSharedEquation(cell1, cell2) {
      return equations.find(eq => {
        const cells = [eq.rowFactor, eq.colFactor, eq.product];
        return cells.includes(cell1) && cells.includes(cell2);
      });
    }

    function isEquationActive() {
      return selectedCells.length > 0;
    }

    function getActiveEquation() {
      if (!isEquationActive()) return null;
      // Find the equation that contains all selected cells
      return equations.find(eq => {
        const eqCells = [eq.rowFactor, eq.colFactor, eq.product];
        return selectedCells.every(cell => eqCells.includes(cell));
      });
    }

    function getUnknownPart(eq) {
      if (!eq) return null;
      if (!isCellVisible(eq.product)) return 'product';
      if (!isCellVisible(eq.rowFactor)) return 'rowFactor';
      if (!isCellVisible(eq.colFactor)) return 'colFactor';
      return null;
    }


    function UpdateEquationFields(eq) {
      const left = document.getElementById('eq-left');
      const right = document.getElementById('eq-right');
      const result = document.getElementById('eq-result');

      if (!eq) {
        left.value = '';
        right.value = '';
        result.value = '';
        return;
      }

      left.value = getValue(eq.rowFactor);
      right.value = getValue(eq.colFactor);
      result.value = getValue(eq.product);
    }

    function UpdateEquationInputState() {
      const eq = getActiveEquation();
      const left = document.getElementById('eq-left');
      const right = document.getElementById('eq-right');
      const result = document.getElementById('eq-result');

      const configs = [
        { input: left, cell: eq ? eq.rowFactor : null },
        { input: right, cell: eq ? eq.colFactor : null },
        { input: result, cell: eq ? eq.product : null }
      ];

      configs.forEach(({ input, cell }) => {
        if (!eq || !cell || isCellVisible(cell)) {
          input.readOnly = true;
          input.tabIndex = -1;
          input.classList.remove('editable');
        } else {
          input.readOnly = false;
          input.tabIndex = 0;
          input.classList.add('editable');
        }
      });
    }

    function SyncEquationInputToGrid(part, value) {
      const eq = getActiveEquation();
      if (!eq) return;
      const map = {
        rowFactor: eq.rowFactor,
        colFactor: eq.colFactor,
        product: eq.product
      };
      const cell = map[part];
      if (!cell || isCellVisible(cell)) return;
      const cellInput = cell.querySelector('input');
      if (cellInput) {
        cellInput.value = value;
        validateSingleCell(cell);
      }
      updateEquationVisual(eq);
    }

    // --- Difficulty Management ---
    function setDifficulty(level) {
      currentDifficulty = level;
      const label = document.getElementById('difficulty-label');
      if (label) {
        label.textContent = level.charAt(0).toUpperCase() + level.slice(1);
      }
      const slider = document.getElementById('difficulty-slider');
      if (slider) {
        const map = { beginner: 1, confident: 2, advanced: 3 };
        slider.value = map[level];
      }
    }

    // --- Grid Generation ---
    function getRandomFactors(count) {
      const nums = Array.from({ length: 9 }, (_, i) => i + 1);
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
      return nums.slice(0, count);
    }

    function generateGrid(difficulty = 'beginner') {
      const grid = document.getElementById('game-grid');
      grid.innerHTML = '';
      cellElements = [];

      // Reset any existing selections from a previous grid
      clearAllSelections();

      const settings = {
        beginner: { hideTotal: 4 },
        confident: { hideTotal: 6 },
        advanced: { hideTotal: 9 }
      }[difficulty];

      const topFactors = getRandomFactors(3);
      const leftFactors = getRandomFactors(3);

      // Create grid cells
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.setAttribute('role', 'button');
          cell.tabIndex = 0;
          let value = '';

          if (row === 0 && col === 0) {
            cell.classList.add('null');
            cell.removeAttribute('role');
            cell.tabIndex = -1;
            value = 'X';
          } else if (row === 0) {
            cell.classList.add('factor');
            value = topFactors[col - 1];
            cell.style.background = colorMap[value];
            cell.style.color = '#e8f7ff';
            cell.setAttribute('aria-label', `Top factor ${value}`);
          } else if (col === 0) {
            cell.classList.add('factor');
            value = leftFactors[row - 1];
            cell.style.background = colorMap[value];
            cell.style.color = '#e8f7ff';
            cell.setAttribute('aria-label', `Left factor ${value}`);
          } else {
            value = topFactors[col - 1] * leftFactors[row - 1];
            cell.setAttribute('aria-label', `Product ${value}`);
          }

          cell.textContent = value;
          grid.appendChild(cell);
          cellElements.push({ element: cell, value: value.toString(), row, col });
        }
      }

      // Define equations after grid is created
      defineEquations(grid);

      // Hide cells strategically
      hideCellsStrategically(settings.hideTotal);

      UpdateEquationInputState();
    }

    function defineEquations(grid) {
      equations = [];
      for (let r = 1; r < 4; r++) {
        for (let c = 1; c < 4; c++) {
          const rowFactor = getCellAt(grid, r, 0);
          const colFactor = getCellAt(grid, 0, c);
          const product = getCellAt(grid, r, c);
          equations.push({ row: r, col: c, rowFactor, colFactor, product });
        }
      }
    }

    function hideCellsStrategically(targetHidden) {
      const hiddenSet = new Set();
      const shuffledEquations = [...equations].sort(() => 0.5 - Math.random());
      
      for (let eq of shuffledEquations) {
        if (hiddenSet.size >= targetHidden) break;
        
        const candidates = [eq.rowFactor, eq.colFactor, eq.product];
        const availableCandidates = candidates.filter(cell => {
          const { row, col } = getRowCol(cell);
          const index = row * 4 + col;
          return !hiddenSet.has(index) && !(row === 0 && col === 0);
        });
        
        if (availableCandidates.length > 0) {
          const hideCount = Math.min(
            Math.random() < 0.6 ? 1 : 2, 
            availableCandidates.length,
            targetHidden - hiddenSet.size
          );
          
          const toHide = availableCandidates
            .sort(() => 0.5 - Math.random())
            .slice(0, hideCount);
          
          for (let cell of toHide) {
            const { row, col } = getRowCol(cell);
            const index = row * 4 + col;
            hiddenSet.add(index);
          }
        }
      }

      // Guarantee solvability: each row and column needs at least one visible cell
      const rowVis = Array(4).fill(0);
      const colVis = Array(4).fill(0);
      cellElements.forEach((obj, idx) => {
        const { row, col } = obj;
        if (!hiddenSet.has(idx)) {
          rowVis[row]++;
          colVis[col]++;
        }
      });

      for (let r = 1; r < 4; r++) {
        if (rowVis[r] === 0) {
          for (let c = 0; c < 4; c++) {
            const idx = r * 4 + c;
            if (hiddenSet.has(idx)) {
              hiddenSet.delete(idx);
              rowVis[r]++;
              colVis[c]++;
              break;
            }
          }
        }
      }
      for (let c = 1; c < 4; c++) {
        if (colVis[c] === 0) {
          for (let r = 0; r < 4; r++) {
            const idx = r * 4 + c;
            if (hiddenSet.has(idx)) {
              hiddenSet.delete(idx);
              rowVis[r]++;
              colVis[c]++;
              break;
            }
          }
        }
      }

      // Apply hiding to cells
      hiddenSet.forEach(index => {
        const obj = cellElements[index];
        const cell = obj.element;
        if (cell) {
          cell.classList.add('hidden');
          cell.removeAttribute('role');
          cell.tabIndex = -1;
          cell.innerHTML = '';
          const input = document.createElement('input');
          input.type = 'text';
          input.maxLength = 5;
          input.setAttribute('aria-label', `Enter value for row ${obj.row} column ${obj.col}`);
          cell.appendChild(input);

          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              input.blur();
              validateSingleCell(cell);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
              e.preventDefault();
              input.value = '';
            }
          });

          let typingTimer;
          input.addEventListener('input', () => {
            if (typingTimer) clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
              validateSingleCell(cell);
            }, 1000);
            UpdateEquationFields(getActiveEquation());
            UpdateEquationInputState();
            updateEquationVisual(getActiveEquation());
          });
        }
      });
    }

    // --- Validation ---
    function validateSingleCell(cell) {
      const { row, col } = getRowCol(cell);
      const obj = cellElements.find(c => c.row === row && c.col === col);
      const input = cell.querySelector('input');
      
      if (!input || !obj) return;

      cell.classList.remove('correct', 'incorrect');
      
      if (validationActive && input.value.trim() !== '') {
        if (input.value.trim() === obj.value) {
          if (!cell.dataset.loggedCorrect) {
            console.log(`Cell (${row},${col}) answered correctly`);
            cell.dataset.loggedCorrect = 'true';
          }
          cell.classList.add('correct');
        } else {
          cell.classList.add('incorrect');
        }
      }

      UpdateEquationFields(getActiveEquation());
      UpdateEquationInputState();
      updateEquationVisual(getActiveEquation());
    }

    function toggleValidation() {
      const button = document.getElementById('checkBtn');
      validationActive = !validationActive;
      button.classList.toggle('button-active', validationActive);
      button.textContent = validationActive ? 'Hide Feedback' : 'Check Answers';

      for (const obj of cellElements) {
        const cell = obj.element;
        if (cell.classList.contains('hidden')) {
          validateSingleCell(cell);
        }
      }
    }

    function handleFactorCellClick(cell, isCommandClick = false) {
      if (isCommandClick) {
        handleCommandClickOnFactor(cell);
        return;
      }

      // Check if there's currently an active equation
      const activeEq = getActiveEquation();
      
      if (activeEq) {
        // Check if this factor is part of the currently active equation
        const isPartOfActiveEq = [activeEq.rowFactor, activeEq.colFactor, activeEq.product].includes(cell);
        
        if (isPartOfActiveEq) {
          // YES - factor is in active equation
          if (isCellVisible(cell)) {
            // YES - factor is visible: same highlight logic as clicking visible product
            setActiveCell(cell);
          } else {
            // NO - factor is hidden: same highlight/cursor logic as clicking hidden product
            setActiveCell(cell);
            const input = cell.querySelector('input');
            if (input) {
              input.focus();
              setTimeout(() => {
                if (input.value) {
                  input.setSelectionRange(input.value.length, input.value.length);
                }
              }, 10);
            }
          }
          return;
        } else {
          // NO - factor is not in active equation
          // Idle/deactivate the previously active equation
          clearAllSelections();
          // Do not activate any equation - just highlight the clicked factor
          highlightSingleFactor(cell);
          return;
        }
      } else {
        // NO - no equation is active
        // Activate that factor cell only, waiting for command-click
        highlightSingleFactor(cell);
        return;
      }
    }

    function handleCommandClickOnFactor(clickedCell) {
      // For factors, command-click behavior is similar to regular click
      // but we need to be careful about equation selection
      const eq = findEquationWithCell(clickedCell);
      if (!eq) return;

      if (isEquationActive()) {
        const activeEq = getActiveEquation();
        const isPartOfActiveEq = activeEq && activeEq === eq;
        
        if (isPartOfActiveEq) {
          setActiveCell(clickedCell);
          if (!isCellVisible(clickedCell)) {
            const input = clickedCell.querySelector('input');
            if (input) {
              setTimeout(() => input.focus(), 10);
            }
          }
        } else {
          // Different equation - activate new one
          clearAllSelections();
          activateEquation(eq);
          setActiveCell(clickedCell);
          
          if (!isCellVisible(clickedCell)) {
            const input = clickedCell.querySelector('input');
            if (input) {
              setTimeout(() => input.focus(), 50);
            }
          }
        }
      } else {
        // No equation active - just activate this one
        activateEquation(eq);
        setActiveCell(clickedCell);
        
        if (!isCellVisible(clickedCell)) {
          const input = clickedCell.querySelector('input');
          if (input) {
            setTimeout(() => input.focus(), 50);
          }
        }
      }
    }

    function clearAllSelections() {
      selectedCells.forEach(cell => {
        cell.classList.remove('selected', 'highlight', 'active-cell');
      });
      
      // Also clear any single factor selections
      document.querySelectorAll('.factor-selected').forEach(cell => {
        cell.classList.remove('factor-selected');
      });
      
      selectedCells = [];
      activeCellInEquation = null;
      UpdateEquationFields(null);
      UpdateEquationInputState();
      updateEquationVisual(null);
    }

    function activateEquation(eq) {
      selectedCells = [eq.rowFactor, eq.colFactor, eq.product];

      // Apply highlight to all cells in equation
      selectedCells.forEach(cell => {
        cell.classList.add('highlight');
      });

      UpdateEquationFields(eq);
      UpdateEquationInputState();
      updateEquationVisual(eq);
    }

    function setActiveCell(cell) {
      // Remove active-cell class from all cells
      selectedCells.forEach(c => c.classList.remove('active-cell'));
      
      // Add active-cell class to the new active cell
      cell.classList.add('active-cell');
      activeCellInEquation = cell;
      
      // Update other cells in equation to have less intense highlight
      selectedCells.forEach(c => {
        if (c !== cell) {
          c.classList.remove('active-cell');
          c.classList.add('highlight');
        }
      });
    }

    function highlightSingleFactor(cell) {
      clearAllSelections();
      cell.classList.add('factor-selected');
      activeCellInEquation = cell;

      const { row, col } = getRowCol(cell);
      if (row === 0 && col > 0) {
        document.getElementById('eq-right').value = getValue(cell);
        document.getElementById('eq-left').value = '';
      } else if (row > 0 && col === 0) {
        document.getElementById('eq-left').value = getValue(cell);
        document.getElementById('eq-right').value = '';
      }
      document.getElementById('eq-result').value = '';
      updateEquationVisual(null);
      UpdateEquationInputState();

      if (!isCellVisible(cell)) {
        const input = cell.querySelector('input');
        if (input) {
          setTimeout(() => input.focus(), 10);
        }
      }
    }

    // --- Event Listeners ---
    document.addEventListener('DOMContentLoaded', () => {
      const grid = document.getElementById('game-grid');
      const rotateBtn = document.getElementById('rotate-btn');
      const eqLeft = document.getElementById('eq-left');
      const eqRight = document.getElementById('eq-right');
      const eqResult = document.getElementById('eq-result');
      const slider = document.getElementById('difficulty-slider');

      function bindEqInput(input, part) {
        input.addEventListener('focus', () => {
          const eq = getActiveEquation();
          if (!eq) return;
          const map = {
            rowFactor: eq.rowFactor,
            colFactor: eq.colFactor,
            product: eq.product
          };
          const cell = map[part];
          if (!cell || isCellVisible(cell)) {
            input.blur();
            return;
          }
          setActiveCell(cell);
        });

        input.addEventListener('input', (e) => {
          SyncEquationInputToGrid(part, e.target.value);
        });
      }

      bindEqInput(eqLeft, 'rowFactor');
      bindEqInput(eqRight, 'colFactor');
      bindEqInput(eqResult, 'product');


      if (slider) {
        slider.addEventListener('input', (e) => {
          const map = { 1: 'beginner', 2: 'confident', 3: 'advanced' };
          setDifficulty(map[e.target.value]);
        });
      }

      rotateBtn.addEventListener('click', () => {
        dotsRotated = !dotsRotated;
        const vis = document.getElementById('equation-visual');
        const xLabel = document.getElementById('x-axis-label');
        const yLabel = document.getElementById('y-axis-label');

        vis.classList.add('rotating');
        if (xLabel) xLabel.classList.add('fading');
        if (yLabel) yLabel.classList.add('fading');

        setTimeout(() => {
          updateEquationVisual(getActiveEquation());
          if (xLabel) xLabel.classList.remove('fading');
          if (yLabel) yLabel.classList.remove('fading');
        }, 150);

        requestAnimationFrame(() => {
          vis.classList.toggle('rotated', dotsRotated);
        });
        setTimeout(() => vis.classList.remove('rotating'), 500);
      });
      
      grid.addEventListener('click', (e) => {
        let target = e.target;
        if (target.tagName === 'INPUT') target = target.parentElement;
        const cell = target.closest('.cell');

        if (!cell) return;

        const isCommandClick = e.ctrlKey || e.metaKey;

        if (isProductCell(cell)) {
          handleProductCellClick(cell, isCommandClick);
        } else if (isFactorCell(cell)) {
          handleFactorCellClick(cell, isCommandClick);
        }
      });

      grid.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        const cell = e.target.closest('.cell');
        if (!cell) return;

        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cell.click();
        }
      });

      // Initialize game
      setDifficulty('beginner');
      generateGrid('beginner');
      UpdateEquationInputState();
    });

window.generateGrid = generateGrid;
window.toggleValidation = toggleValidation;
