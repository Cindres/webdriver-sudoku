var subGrids = require('./subGrids.js');

var SudokuPage = (function() {

  function SudokuPage() {
  }

  /*
  * Get the webdriver element for a cell.
  * the y axis starts at the TOP of the grid. (so x->along, y->down)
  */
  SudokuPage.prototype.getCell = function(x,y) {
    if (x === null || x === undefined) {
      x = 0;
    }
    if (y === null || y === undefined) {
      y = 0;
    }
    return browser.element("#f"+x+y).value;
  };

  SudokuPage.prototype.fillCell = function(x,y,value) {
    var elementId = this.getCell(x,y).ELEMENT;
    browser.elementIdValue(elementId, ""+value);
  };

  SudokuPage.prototype.clearCell = function(x,y) {
    browser.elementIdClear(this.getCell(x,y).ELEMENT);
  };

  SudokuPage.prototype.getCellValue = function(x,y) {
    var elementId = this.getCell(x,y).ELEMENT;
    return browser.elementIdAttribute(elementId, 'value').value;
  };

  SudokuPage.prototype.cellIsReadOnly = function(x,y) {
    var cellElement = this.getCell(x,y);
    return browser.elementIdAttribute(cellElement.ELEMENT, 'readonly').value === 'true';
  };

  /*
  * Return the index for the subgrid a cell is in.
  */
  SudokuPage.prototype.getSubGridForCell = function(x,y) {
    for (var index in subGrids) {
      var subGrid = subGrids[index];
      for (var cellIndex in subGrid) {
        var cell = subGrid[cellIndex];
        if (cell.x === x && cell.y === y) {
          return index;
        }
      }
    }
  };

  SudokuPage.prototype.allCellsAreValid = function() {
    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        if (!this.cellIsValid(x,y)) {
          return false;
        }
      }
    }
    return true;
  };

  /*
  * Returns whether a single cell is valid.
  * Returns true if no other cell in the row, column or subgrid contains the same value.
  * Also returns true if the cell is readonly, i.e. it was filled in at the start.
  */
  SudokuPage.prototype.cellIsValid = function(x,y) {
    if (this.cellIsReadOnly(x,y)) {
      return true;
    }
    var gridIndex = this.getSubGridForCell(x,y);
    return (this.rowIsValid(y) && this.columnIsvalid(x) && this.subGridIsValid(gridIndex));
  };

  /*
  * Returns true if a given row contains no duplicate values.
  * Does not take into account blank cells.
  */
  SudokuPage.prototype.rowIsValid = function(row) {
    var numbersFound = [];
    for (var i = 0; i<9; i++) {
      var currentValue = this.getCellValue(i, row);
      if (currentValue !== null && currentValue !== '' && numbersFound.indexOf(currentValue) > -1) {
        // console.log("Row " + row + " is invalid.");
        return false;
      }
      numbersFound.push(currentValue);
    }
    return true;
  };

  /*
  * Returns true if a given column contains no duplicate values.
  * Does not take into account blank cells.
  */
  SudokuPage.prototype.columnIsvalid = function(column) {
    var numbersFound = [];
    for (var i = 0; i<9; i++) {
      var currentValue = this.getCellValue(column, i);
      if (currentValue !== null && currentValue !== '' && numbersFound.indexOf(currentValue) > -1) {
        // console.log("Column " + column + " is invalid.");
        return false;
      }
      numbersFound.push(currentValue);
    }
    return true;
  };

  /*
  * Returns true if a given 3*3 subgrid contains no duplicate values.
  * Does not take into account blank cells.
  */
  SudokuPage.prototype.subGridIsValid = function(index) {
    var numbersFound = [];
    var gridValues = subGrids[index];
    for (var i = 0; i < gridValues.length; i++) {
      var currentValue = this.getCellValue(gridValues[i].x, gridValues[i].y);
      // console.log("Value at {" + gridValues[i].x + "," + gridValues[i].y + "} = " + currentValue);
      if (currentValue !== null && currentValue !== '' && numbersFound.indexOf(currentValue) > -1) {
        // console.log("Subgrid " + index + " is invalid for value " + currentValue);
        return false;
      }
      numbersFound.push(currentValue);
    }
    return true;
  };

  /*
  * Fills a cell with numbers (from the current number in the cell to 9) until a valid number is found.
  * Returns true if the cell was filled, returns false if no number is valid in that cell.
  * Also returns true if the cell is readonly, i.e. was filled in at the start.
  */
  SudokuPage.prototype.fillCellUntilValid = function(x, y) {
    if (this.cellIsReadOnly(x,y)) {
      return true;
    }

    var currentValue = parseInt(this.getCellValue(x,y)) || 0;
    for (var i=currentValue+1; i<=9; i++) {
      this.clearCell(x,y);
      this.fillCell(x,y,i);
      if (this.cellIsValid(x,y)) {
        return true;
      }
    }
    this.clearCell(x,y);
    return false;
  };

  SudokuPage.prototype.allCellsAreFull = function() {
    for (var x = 0; x<9; x++) {
      for (var y = 0; y<9; y++) {
        if (this.getCellValue(x,y) === "") {
          return false;
        }
      }
    }
    return true;
  };

  SudokuPage.prototype.gameIsComplete = function() {
    return (this.allCellsAreFull() && this.allCellsAreValid());
  };

  SudokuPage.prototype.clickSubmit = function() {
    var inputs = browser.elements('input');
    for (var i in inputs.value) {
      var input = inputs.value[i];
      var name = browser.elementIdAttribute(input.ELEMENT, "name");
      if (name.value === 'submit') {
        browser.elementIdClick(input.ELEMENT);
      }
    }
  };

  return SudokuPage;

})();

module.exports = new SudokuPage();
