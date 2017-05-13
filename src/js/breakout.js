const breakout = {
    run: ()=> {
        "use strict";

        let score = 0,
            lives = 3;
        
        let canvas = document.getElementById("viewport");
        let ctx = canvas.getContext("2d");

        let x = canvas.width / 2;
        let y = canvas.height - 30;
        let ballColor = "rgb(255,0,0)";

        let dx = 2;
        let dy = -2;
        
        let ballRadius = 10;
        
        let paddleHeight = 10;
        let paddleWidth = 75;
        let paddleX = (canvas.width - paddleWidth) / 2;
        let paddleY = canvas.height - paddleHeight;
    
        // game controls
        let rightPressed = false,
            leftPressed = false;

        // bricks
        let brickRowCount = 3,
            brickColumnCount = 5,
            brickWidth = 75,
            brickHeight = 20,
            brickPadding = 10,
            brickOffsetTop = 30,
            brickOffsetLeft = 30;

        let bricks = [];

        let c, r;
        for(c=0; c<brickColumnCount; c++) {
            bricks[c] = [];

            for(r=0; r<brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        function drawBricks() {
            for(c=0; c<brickColumnCount; c++) {
                for(r=0; r<brickRowCount; r++) {
                    if(bricks[c][r].status > 0) {
                        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;

                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = "rgb(100, 0, 100)";
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        function collisionDetection() {
            let c, r;
            let red, green, blue;
            
            for(c=0; c<brickColumnCount; c++) {
                for(r=0; r<brickRowCount; r++) {
                    let b = bricks[c][r];
                    if(b.status == 1) {
                        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                            dy = -dy;
                            b.status = 0;

                            // exercise: change ball color when it hits the brick
                            red = Math.random() * 255;
                            green = Math.random() * 255;
                            blue = Math.random() * 255;
                            ballColor = "rgb(" + red + "," + green + "," + blue + ")";

                            score++;

                            if(score === brickRowCount*brickColumnCount) {
                                alert("YOU'RE WINNER!");
                                document.location.reload();
                            }
                        }
                    }
                }
            }
                
        }
        
        function drawScore() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "rgb(0,100,100)";
            ctx.fillText("Score: " + score, 8, 20);
        }

        function drawLives() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "rgb(0,100,100)";
            ctx.fillText("Lives: " + lives, canvas.width-65, 20);
        }

        function mouseMoveHandler(e) {
            let relativeX = e.clientX - canvas.offsetLeft; 

            // exercise --> make sure paddle does not go off screen
            if(relativeX > (paddleWidth/2) && relativeX < canvas.width-(paddleWidth/2)) {
                paddleX = relativeX - paddleWidth / 2;
            }
        }
        
        function keyDownHandler(e) {
            if(e.keyCode == 39) {
                rightPressed = true;
            }
            else if(e.keyCode == 37) {
                leftPressed = true;
            }
        }
        
        function keyUpHandler(e) {
            if(e.keyCode == 39) {
                rightPressed = false;
            }
            else if(e.keyCode == 37) {
                leftPressed = false;
            }
        }
        
        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
            ctx.fillStyle = "rgb(255,0,255)";
            ctx.fill();
            ctx.closePath();
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI*2);
            ctx.fillStyle = ballColor; 
            ctx.fill();
            ctx.closePath();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drawBricks();
            drawPaddle();
            collisionDetection();
            drawScore();
            drawLives();
            drawBall();

            x += dx;
            y += dy;
            
            if(rightPressed && paddleX < canvas.width-paddleWidth) {
                paddleX += 7;
            }
            if(leftPressed && paddleX > 0) {
                paddleX -= 7;
            }
            
            if(x + dx < ballRadius || x + dx > canvas.width-ballRadius) {
                dx = -dx;
            }
            
            if(y + dy < ballRadius) {
                dy = -dy;
            }
            else if(y + dy > canvas.height-ballRadius) {
                if(x > paddleX && x < paddleX + paddleWidth) {
                    // exercise: make the ball move faster when it hits the paddle
                    dx += 0.1;
                    dy += 0.1;
                    
                    // handle collision
                    dy = -dy;
                }
                else if (!lives) {
                    alert("GAME OVER!");
                    document.location.reload();
                }
                else {
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 2;
                    dy = 2;
                    paddleX = (canvas.width-paddleWidth)/2;
                    
                    lives--;
                }
            }
            requestAnimationFrame(draw);
        }
        
        document.addEventListener("mousemove", mouseMoveHandler, false);
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        draw();
    }
};

export { breakout };
