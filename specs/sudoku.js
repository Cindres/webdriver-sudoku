var page = require('./pageObjects/sudokuPage.js');

describe("Playing a game of Sudoku...", function() {

  var nextCell = function(currentCell) {
    if (currentCell.x === 8) {
      return {x: 0, y: currentCell.y+1};
    }
    return {x: currentCell.x+1, y: currentCell.y};
  };

  var previousCell = function(currentCell) {
    var previous = null;
    if (currentCell.x === 0) {
      previous = {x: 8, y: currentCell.y-1};
    } else {
      previous = {x: currentCell.x-1, y: currentCell.y};
    }

    if(page.cellIsReadOnly(previous.x, previous.y)) {
      return previousCell(previous);
    }

    return previous;
  };

  var url = "http://www.websudoku.com/?level=1&set_id=1388051695";
  // var url = "http://www.websudoku.com/";

  before("Setup.", function() {
    browser.url(url);
    browser.frame(browser.element('frame').value);
  });

  xit("Page functions work", function() {
    page.fillCell(0,0,1);
    expect(page.getCellValue(0,0)).to.be.equal('1');

    page.fillCell(5,3,5);
    expect(page.getCellValue(5,3)).to.be.equal('5');

    expect(page.getSubGridForCell(0,0)).to.be.equal('0');
    expect(page.getSubGridForCell(2,1)).to.be.equal('0');
    expect(page.getSubGridForCell(7,3)).to.be.equal('5');
    expect(page.getSubGridForCell(2,6)).to.be.equal('6');
    expect(page.getSubGridForCell(8,8)).to.be.equal('8');
    expect(page.getSubGridForCell(1,4)).to.be.equal('3');

    expect(page.allCellsAreFull()).to.be.false;

    expect(page.gameIsComplete()).to.be.false;
  });

  xit("Plays Sudoku.", function() {
    var currentCell = {x: 0, y: 0};
    while(!page.gameIsComplete()) {
      currentCell = (page.fillCellUntilValid(currentCell.x, currentCell.y)) ? nextCell(currentCell) : previousCell(currentCell);
    }
  });

});
