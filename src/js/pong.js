// Canvas -----------------------------------------------------------
const canvas                    = document.getElementById("stage");
const ctx                       = canvas.getContext("2d");
ctx.fillStyle                   = "#FFFFFF";

// Game variables ---------------------------------------------------
const ball_size                 = [10, 10];
const pad_size                  = [100, 20];
const initial_ball_speed        = 3;
const initial_ball_direction    = {x: 1, y: 1};
const pad_limit_left            = 0;
const pad_limit_right           = canvas.width - pad_size[0];
const ball_spawn_point          = {x: canvas.width / 2, y: 50};
const initial_pad_position      = {x: canvas.width / 2, y: 550};

let score                       = 0;
let is_game_over                = false;
let ball_can_bounce             = true;
let ball_speed                  = initial_ball_speed;
let ball_direction = {
    x: initial_ball_direction.x,
    y: initial_ball_direction.y
};
let ball_position = {
    x: ball_spawn_point.x,
    y: ball_spawn_point.y
};
let pad_position = {
    x: initial_pad_position.x,
    y: initial_pad_position.y
};

// Inputs -----------------------------------------------------------
document.addEventListener("keydown", function(e) {
    let key_code = e.which || e.keyCode;

    if (key_code == 37) {        // left arrow
        move_pad_left();
    } else if (key_code == 39) { // right arrow
        move_pad_right();
    }
});

document.getElementById("play-again").addEventListener("click", function() {
    replay();
})

// Move functions ---------------------------------------------------
function move_pad_left() {
    if (pad_position.x > pad_limit_left) {
        pad_position.x -= pad_size[0] / 2;
    }
}

function move_pad_right() {
    if (pad_position.x < pad_limit_right) {
        pad_position.x += pad_size[0] / 2;
    }
}

function move_ball() {
    ball_position.x = ball_position.x + ball_speed * ball_direction.x;
    ball_position.y = ball_position.y + ball_speed * ball_direction.y;
}

// Game functions ------------------------------------------------
function game_over() {
    is_game_over = true;
    document.getElementById("final-score").innerText = score;
    document.getElementById("game-over").style = "display : inline";
}

function replay() {
    score = 0;
    ball_speed = initial_ball_speed;
    // Spawn ball in random horizontal directions
    ball_direction = {
        x: Math.random() < 0.5 ? -1 : 1,
        y: initial_ball_direction.y
    };
    // Spawn ball in random horizontal positions
    ball_position = {
        x: Math.floor(Math.random() * canvas.height) + ball_size[0],
        y: ball_spawn_point.y
    };
    // Return pad to center
    pad_position = {
        x: initial_pad_position.x,
        y: initial_pad_position.y
    };
    is_game_over = false;
    document.getElementById("game-over").style = "display : none";
    document.getElementById('score').innerHTML = score;
    draw();
}

function increase_score_and_speed() {
    score += 1;
    ball_speed += 0.5;
    document.getElementById('score').innerHTML = score;
}

// Detect collision functions ---------------------------------------
function detect_border_collision() {
    const right_limit = canvas.width - ball_size[0]
    if (ball_position.x < 0 || ball_position.x > right_limit) {
        bounce_ball_horizontally();
        ball_can_bounce = true;
    }
}

function detect_top_collision() {
    if (ball_position.y < 0) {
        bounce_ball_vertically();
    }
}

function detect_pad_collision() {
    if (
        ball_can_bounce &&
        ball_position.y + ball_size[1] > pad_position.y &&
        ball_position.y < pad_position.y + pad_size[1] &&
        ball_position.x > pad_position.x &&
        ball_position.x < pad_position.x + pad_size[0]
    ) {
        ball_can_bounce = false;
        bounce_ball_vertically();
        increase_score_and_speed();
    }
}

function detect_game_over() {
    if (ball_position.y > canvas.height) {
        game_over();
    }
}

// Bounce functions -------------------------------------------------
function bounce_ball_horizontally() {
    ball_direction.x = -ball_direction.x;
}

function bounce_ball_vertically() {
    ball_direction.y = -ball_direction.y;
}

// Draw functions ---------------------------------------------------
function clean_canvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_ball() {
    ctx.fillRect(ball_position.x, ball_position.y, ...ball_size);
}

function draw_pad() {
    ctx.fillRect(pad_position.x, pad_position.y, ...pad_size);
}

function draw() {
    if (is_game_over) {return;}
    clean_canvas();
    detect_border_collision();
    detect_top_collision();
    detect_pad_collision();
    move_ball();
    detect_game_over();
    draw_ball();
    draw_pad();
    requestAnimationFrame(draw);
}

// ------------------------------------------------------------------
window.onload = function() {
    draw();
}
