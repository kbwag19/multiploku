    function handleProductCellClick(cell, isCommandClick = false) {
      if (isCommandClick) {
        handleCommandClickOnProduct(cell);
        return;
      }

      const eq = equations.find(eq => eq.product === cell);
      if (!eq) return;

      // Check if this equation is already active
      const activeEq = getActiveEquation();
      const isSameEquation = activeEq && activeEq.product === eq.product;

      if (isSameEquation) {
        // Same equation clicked - handle input focus
        setActiveCell(cell);
        if (!isCellVisible(cell)) {
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
      } else {
        // New equation - clear previous and activate new
        clearAllSelections();
        activateEquation(eq);
        setActiveCell(cell);
        
        if (!isCellVisible(cell)) {
          const input = cell.querySelector('input');
          if (input) {
            setTimeout(() => input.focus(), 50);
          }
        }
      }
    }

    function handleCommandClickOnProduct(clickedCell) {
      // Check if an equation is active
      if (isEquationActive()) {
        const activeEq = getActiveEquation();
        
        // Check if clickedCell is part of the active equation
        const isPartOfActiveEq = activeEq && 
          [activeEq.rowFactor, activeEq.colFactor, activeEq.product].includes(clickedCell);
        
        if (isPartOfActiveEq) {
          // Move active cell highlight to clickedCell
          setActiveCell(clickedCell);
          
          if (!isCellVisible(clickedCell)) {
            // Focus the input if it's hidden
            const input = clickedCell.querySelector('input');
            if (input) {
              setTimeout(() => input.focus(), 10);
            }
          }
        } else {
          // Block - cannot share equation with another product
          // Do nothing, leave everything as it was
          return;
        }
      } else {
        // No equation is active
        // Check if there's another active cell that's a factor
        if (activeCellInEquation && isFactorCell(activeCellInEquation)) {
          // Check if the active factor shares an equation with clickedCell
          const sharedEq = findSharedEquation(activeCellInEquation, clickedCell);
          
          if (sharedEq) {
            // Activate the shared equation
            activateEquation(sharedEq);
            setActiveCell(clickedCell);
            
            if (!isCellVisible(clickedCell)) {
              const input = clickedCell.querySelector('input');
              if (input) {
                setTimeout(() => input.focus(), 10);
              }
            }
          } else {
            // Block - cannot share equation
            return;
          }
        } else {
          // Block - no valid factor to share equation with
          return;
        }
      }
    }

window.handleProductCellClick = handleProductCellClick;
window.handleCommandClickOnProduct = handleCommandClickOnProduct;
