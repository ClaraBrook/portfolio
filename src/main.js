import './style.css'
import * as THREE from 'three'

import { registerRoute, startRouter } from './router'
import { setPage, updatePage } from './engine/sceneState'

import { createHome } from './pages/home'
import { createAbout } from './pages/about'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 2
scene.add(camera)

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearAlpha(0)

/**
 * Routes
 */

registerRoute("/", () => {
    setPage(createHome(scene))
})

registerRoute("/about", () => {
    setPage(createAbout(scene))
})

startRouter()

/**
 * Animate
 */

const clock = new THREE.Timer()

const tick = () =>
{
    clock.update()
    const elapsedTime = clock.getElapsed()

    updatePage(elapsedTime)

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()