window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

// This is just a fix for the built-in modulo function
function mod(n, m) {
  return ((n % m) + m) % m;
}

const rel = [[0,1], [1,0], [1,1], [0,-1], [-1,0], [-1,1], [1,-1], [-1,-1]]

// This is the size of the grid. The grid will have size^2 cells
let size = 20

// Some basic constants and variables
const canvas = document.getElementById("main_canvas")
const spawn_rate = 0.8
let delay = 50
let gen = 1
canvas.width = 600
canvas.height = 600
const ctx = canvas.getContext('2d');
const tile_width = Math.round(canvas.width/size)
const tile_height = Math.round(canvas.height/size)
ctx.imageSmoothingEnabled = false
let grid = []
let last_grid = []
const base_random = 70
document.getElementById("main_canvas").style.boxShadow = "0 0 50px #b0c1ff";

// Create the initial grid
for(var i = 0; i < size; i++) {
  let row = []
  for(var j = 0; j < size; j++) {
    if(Math.random() > spawn_rate) {
      row.push(true)
    }
    else {
      row.push(false)
    }
  }
  grid.push(row)
}

// Print the initial grid
printGrid(grid)

// This function paints a cell in the grid
function paintCell(i, j, grid) {
  let x = i * tile_width, y = j * tile_height
  let r = base_random + Math.floor(Math.random()*50)
  if(grid[i][j]) {
    ctx.fillStyle = 'hsla(' + r + ', 80%, 50%, 0.8)'
  }
  else {
    ctx.fillStyle = '#102366'
  }
  ctx.fillRect(x, y, tile_width, tile_height)
}

// This function prints the grid
function printGrid(g) {
  for(var i = 0; i < size; i++) {
    for(var j = 0; j < size; j++) {
      if(last_grid.length !== 0) {
        if(last_grid[i][j] !== g[i][j]) {
          paintCell(i,j,g)
        }
      }
      else {
        paintCell(i,j,g)
      }
    }
  }
}

// This function generates the next generation of the system
function nextGen(g) {
  let newGrid = []
  last_grid = []
  for(var i = 0; i < size; i++) {
    let a_row = []
    for(var j = 0; j < size; j++) {
      a_row.push(g[i][j])
    }
    last_grid.push(a_row)
  }
  for(var i = 0; i < size; i++) {
    let newRow = []
    for(var j = 0; j < size; j++) {
      let z = 0
      for(var k = 0; k < rel.length; k++) {
        if(g[mod(i+rel[k][0], size)][mod(j+rel[k][1], size)]) {
          z++
        }
      }
      if(g[i][j]) {
        if(z === 3 || z === 2) {
          newRow.push(true)
        }
        else {
          newRow.push(false)
        }
      }
      else {
        if(z === 3) {
          newRow.push(true)
        }
        else {
          newRow.push(false)
        }
      }
    }
    newGrid.push(newRow)
  }
  for(var i = 0; i < size; i++) {
    for(var j = 0; j < size; j++) {
      grid[i][j] = newGrid[i][j]
    }
  }
  printGrid(newGrid)
  if(gen > 50) {
    reset()
  }
  else {
    main()
  }
  gen++
}

// This function creates the main loop in the program
function main() {
  setTimeout(function() {
    nextGen(grid)
  }, delay)
}

main()

// Reset the grid
function reset() {
  grid = []
  gen = 1
  for(var i = 0; i < size; i++) {
    let row = []
    for(var j = 0; j < size; j++) {
      if(Math.random() > spawn_rate) {
        row.push(true)
      }
      else {
        row.push(false)
      }
    }
    grid.push(row)
  }
  main()
}
