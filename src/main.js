import './style.css'
import * as THREE from 'three'

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

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = (new THREE.MeshBasicMaterial({color:"red", wireframe:true}))
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
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
 * Animate
 */
const clock = new THREE.Timer()

const tick = () =>
{
    clock.update()
    const elapsedTime = clock.getElapsed()
    console.log(elapsedTime)
    mesh.rotation.x = elapsedTime * 0.2
    mesh.rotation.y = elapsedTime * 0.3

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()