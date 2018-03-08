function blockHorizontal(board, col, row)
{
    for(var i = 1; i < game.n; i++)
    {
        var nextRow = (row + i) % game.n
        if(game.inBounds(col, nextRow) && game.board[board][col][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][nextRow][col] )

            return true
        }
    }
}
function blockVertical(board, col, row)
{
    for(var i = 1; i < game.n; i++)
    {
        nextCol = (col + i) % game.n
        if(game.inBounds(nextCol, row) && game.board[board][nextCol][row] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][row][nextCol] )
            return [board, row, nextCol]
            //return true
        }
    }
}
function blockPos(board, col, row)
{
    for(var i = 1; i < game.n; i++)
    {
        var nextRow = (row - i) % game.n
        var nextCol = (col - i) % game.n
        if(game.inBounds(nextCol, nextRow) && game.board[board][nextCol][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][nextRow][nextCol] )
            return true
        }
        nextRow = (row + i) % game.n
        nextCol = (col + i) % game.n
        if(game.inBounds(nextCol, nextRow) && game.board[board][nextCol][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][nextRow][nextCol] )
            return true
        }
    }
}
function blockNeg(board, col, row)
{
    for(var i = 1; i < game.n; i++)
    {
        var nextRow = (row + i) % game.n
        var nextCol = (col - i) % game.n
        if(game.inBounds(nextCol, nextRow) && game.board[board][nextCol][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][nextRow][nextCol] )
            return true
        }
        nextRow = (row - i) % game.n
        nextCol = (col + i) % game.n
        if(game.inBounds(nextCol, nextRow) && game.board[board][nextCol][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][nextRow][nextCol] )
            return true
        }
    }
}

function blockVerticalThreeD(board, col, row)
{
    for(var i = 0; i < game.board.length; i++)
    {
        var nextBoard = (board + i) % game.n
        if (game.board[nextBoard][col][row] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[nextBoard][row][col] )
            return true
        }
    }
}

function blockLocalPositiveHorizontal(board, fixedCol, fixedRow)
{
    
    for(var i = 0; i < game.board.length; i++)
    {
        var nextRow = game.n - 1 - i
        var nextBoard = i
        if(game.board[nextBoard][fixedCol][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[nextBoard][nextRow][fixedCol] )
            return true
        }
        
        
    }
}

function blockLocalNegativeHorizontal(board,  fixedCol, fixedRow)
{
    for(var i = 0; i < game.board.length; i++)
    {
        var nextRow = i
        var nextBoard = i
        if(game.board[nextBoard][fixedCol][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[nextBoard][nextRow][fixedCol] )
            return true
        }
        
        
    }
}

function blockLocalPositiveVertical(board,  fixedCol, fixedRow)
{
    for(var i = 0; i < game.board.length; i++)
    {
        var nextCol = i
        var nextBoard = i
        if(game.board[nextBoard][nextCol][fixedRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[nextBoard][fixedRow][nextCol] )
            return true
        }
        
        
    }
}

function blockLocalNegativeVertical(board,  fixedCol, fixedRow)
{
    for(var i = 0; i < game.board.length; i++)
    {
        var nextCol = game.n - 1 - i
        var nextBoard = i
        if(game.board[nextBoard][nextCol][fixedRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[nextBoard][fixedRow][nextCol] )
            return true
        }
        
        
    }
}

function blockTopLeft()
{
    for(var i = 0; i < game.n; i++)
    {
        //if the coords are out of bounds or contain an empty square, mark it as invalid
        var nextRow = i
        var nextCol = i
        var nextBoard = i
        
        if(game.board[nextBoard][nextCol][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[nextBoard][nextRow][nextCol] )
            return true
        }
        
    }
}

function blockTopRight()
{
    for(var i = 0; i < game.n; i++)
    {
        //if the coords are out of bounds or contain an empty square, mark it as invalid
        var nextRow = game.n - 1 - i
        var nextCol = i
        var nextBoard = i
        
        if(game.board[nextBoard][nextCol][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[nextBoard][nextRow][nextCol] )
            return true
        }
        
    }
}

function blockBottomLeft()
{
    for(var i = 0; i < game.n; i++)
    {
        //if the coords are out of bounds or contain an empty square, mark it as invalid
        var nextRow = i
        var nextCol = game.n - 1 - i
        var nextBoard = i
        
        if(game.board[nextBoard][nextCol][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[nextBoard][nextRow][nextCol] )
            return true
        }
        
    }
}

function blockBottomRight()
{
    for(var i = 0; i < game.n; i++)
    {
        //if the coords are out of bounds or contain an empty square, mark it as invalid
        var nextRow = game.n - 1 - i
        var nextCol = game.n - 1 - i
        var nextBoard = i
        
        if(game.board[nextBoard][nextCol][nextRow] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[nextBoard][nextRow][nextCol] )
            return true
        }
        
    }
}

function findOpenSquare(board, col, row)
{
    for(var i = Math.floor(Math.random() * game.n) + 1, j = 0 ; j < game.n; i++,  j++)
    {
        i = i % game.n
        if(game.inBounds(col - i, row) && game.board[board][col-i][row] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][row][col-i] )
            return true
        }
        if(game.inBounds(col + i, row) && game.board[board][col+i][row] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][row][col+i] )
            return true
        }
        if(game.inBounds(col, row - i) && game.board[board][col][row - i] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][row - i][col] )
            return true
        }
        if(game.inBounds(col, row + i) && game.board[board][col][row + i] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][row + i][col] )
            return true
        }
        
        if(game.inBounds(col + i, row + i) && game.board[board][col + i][row + i] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][row + i][col + i] )
            return true
        }
        if(game.inBounds(col - i, row + i) && game.board[board][col - i][row + i] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][row + i][col - i] )
            return true
        }
        if(game.inBounds(col + i, row - i) && game.board[board][col + i][row- i] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][row - i][col + i] )
            return true
        }
        if(game.inBounds(col - i, row - i) && game.board[board][col - i][row- i] === "")
        {
            game.placePieceNoPointer( game.spriteSquares[board][row - i][col - i] )
            return true
        }
    }
    return false
}
/*Order Chaos Versions*/
function blockHorizontalOrder(col, row)
{
    for(var i = 1; i < game.n; i++)
    {
        var nextRow = (row + i) % game.n
        if(game.board[col][nextRow] === "")
        {
            game.placePiece( game.spriteSquares[nextRow][col] )
            
            return true
        }
    }
}

function blockVerticalOrder(col, row)
{
    for(var i = 1; i < game.n; i++)
    {
        var nextCol = (col + i) % game.n
        if(game.board[nextCol][row] === "")
        {
            game.placePiece( game.spriteSquares[row][nextCol] )
            
            return true
        }
    }
}

function blockPositiveDiagonalOrder()
{
    for(var i = 1, j = 0; j < game.n; i++, j++)
    {
        i = i % game.n
        var nextCol = i
        var nextRow = i
        if(game.board[nextCol][nextRow] === "")
        {
            game.placePiece( game.spriteSquares[nextRow][nextCol] )
            
            return true
        }
    }
}

function blockNegativeDiagonalOrder()
{
    for(var i = 1, j = 0; j < game.n; i++, j++)
    {
        i = i % game.n
        var nextCol = i
        var nextRow = game.n - 1 - i
        if(game.board[nextCol][nextRow] === "")
        {
            game.placePiece( game.spriteSquares[nextRow][nextCol] )
            
            return true
        }
    }
}

function blockPositiveLowDiagonalOrder(col, row)
{
    for(var i = 0; i < game.n - 1; i++)
    {
        var nextCol = i + 1
        var nextRow = i
        if(game.board[nextCol][nextRow] === "")
        {
            game.placePiece( game.spriteSquares[nextRow][nextCol] )
            
            return true
        }
    }
}

function blockNegativeLowDiagonalOrder(col, row)
{
    for(var i = 0; i < game.n - 1; i++)
    {
        var nextCol = i 
        var nextRow = game.n - 2 - i
        if(game.board[nextCol][nextRow] === "")
        {
            game.placePiece( game.spriteSquares[nextRow][nextCol] )
            
            return true
        }
    }
}

function blockPositiveHighDiagonalOrder(col, row)
{
    for(var i = 0; i < game.n - 1; i++)
    {
        var nextCol = i 
        var nextRow = i + 1
        if(game.board[nextCol][nextRow] === "")
        {
            game.placePiece( game.spriteSquares[nextRow][nextCol] )
            
            return true
        }
    }
}

function blockNegativeHighDiagonalOrder(col, row)
{
    for(var i = 0; i < game.n - 1; i++)
    {
        var nextCol = i + 1
        var nextRow = game.n - 1 - i
        if(game.board[nextCol][nextRow] === "")
        {
            game.placePiece( game.spriteSquares[nextRow][nextCol] )
            
            return true
        }
    }
}

function findOpenSquareOrder(col, row)
{
    
    
    
    for(var i = Math.floor(Math.random() * game.n) + 1, j = 0 ; j < game.n; i++, j++)
    {
        i = i % game.n
        if( game.inBounds(col - i, row) && game.board[col-i][row] === "")
        {
            game.placePiece( game.spriteSquares[row][col-i] )
            return true
        }
        if(game.inBounds(col + i, row) && game.board[col+i][row] === "")
        {
            game.placePiece( game.spriteSquares[row][col+i] )
            return true
        }
        if(game.inBounds(col, row - i) && game.board[col][row - i] === "")
        {
            game.placePiece( game.spriteSquares[row - i][col] )
            return true
        }
        if(game.inBounds(col, row + i) && game.board[col][row + i] === "")
        {
            game.placePiece( game.spriteSquares[row + i][col] )
            return true
        }
        
        if(game.inBounds(col + i, row + i) && game.board[col + i][row + i] === "")
        {
            game.placePiece( game.spriteSquares[row + i][col + i] )
            return true
        }
        if(game.inBounds(col - i, row + i) && game.board[col - i][row + i] === "")
        {
            game.placePiece( game.spriteSquares[row + i][col - i] )
            return true
        }
        if(game.inBounds(col + i, row - i) && game.board[col + i][row- i] === "")
        {
            game.placePiece( game.spriteSquares[row - i][col + i] )
            return true
        }
        if(game.inBounds(col - i, row - i) && game.board[col - i][row- i] === "")
        {
            game.placePiece( game.spriteSquares[row - i][col - i] )
            return true
        }
    }
    alert('oh no')
    return false
}

