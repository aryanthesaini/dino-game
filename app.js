import {setUpGround, updateGround} from './ground.js'
import {setUpDino, updateDino, getDinoRect, setDinoLose} from './dino.js'
import {setUpCactus, updateCactus, getCactusRects} from './cactus.js'

const WORLD_WIDTH=100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE=0.00001

const worldElement = document.querySelector('[data-world]')

const scoreElement = document.querySelector('[data-score]')


const startScreenElement = document.querySelector('[data-start-screen]')

setPixelToWorldScale()
window.addEventListener('resize',setPixelToWorldScale)
document.addEventListener('keydown', handleStart, {once:true})
document.addEventListener('touchstart', handleStart, {once:true})

let speedScale
let lastTime
let score
function update(time){
    if(lastTime==null){
    lastTime= time;
    window.requestAnimationFrame(update)
    return
    }
    const delta = time-lastTime
    // console.log(delta)
    updateGround(delta,speedScale)
    updateDino(delta,speedScale)
    updateCactus(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)

    if(checkLose()){
        return handleLose()
    } 

    lastTime= time;
    window.requestAnimationFrame(update)

}


function checkLose(){
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect=>
        isCollision(rect, dinoRect)
    )
}


function isCollision(rect1, rect2){

    return( rect1.left <rect2.right && rect1.top<rect2.bottom && rect1.right>rect2.left && rect1.bottom>rect2.top)
}


function updateSpeedScale(delta){
    speedScale+=delta*SPEED_SCALE_INCREASE
}

function updateScore(delta){
    score+=delta*.01
    scoreElement.textContent = Math.floor(score)
}

function handleStart(){
    lastTime=null
    speedScale=1
    score=0
    setUpGround()
    setUpDino()
    setUpCactus()
    window.requestAnimationFrame(update)
    startScreenElement.classList.add('hide')
}

// let scoreSoFar=0;

function handleLose(){
    // if(scoreSoFar>parseInt(scoreElement.textContent)){

    // }
    // scoreSoFar = parseInt(scoreElement.textContent);
    // console.log(scoreSoFar)
    
    setDinoLose()
    setTimeout(()=>{
        document.addEventListener('keydown', handleStart, {once:true})
        startScreenElement.classList.remove('hide')
    }, 1000)
}

function setPixelToWorldScale(){
    let worldToPixelScale
    if(window.innerWidth/window.innerHeight<WORLD_WIDTH/WORLD_HEIGHT){
        worldToPixelScale = window.innerWidth/WORLD_WIDTH
    }
    else{
        worldToPixelScale = window.innerHeight/WORLD_HEIGHT
    }

    worldElement.style.width = `${WORLD_WIDTH *worldToPixelScale}px`

    worldElement.style.height = `${WORLD_HEIGHT *worldToPixelScale}px`
}

