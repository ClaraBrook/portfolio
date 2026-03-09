import './style.css'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/Addons.js'

import { registerRoute, startRouter } from './router'
import { setPage, updatePage } from './engine/sceneState'

import { createHome } from './pages/home'
import { createAbout } from './pages/about'

import { initDotField, resizeDotField } from './engine/dotField'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lighting
 */

const directionalLight = new THREE.DirectionalLight(0x00FF41, 2.5)
directionalLight.position.set(2, 3, 4)

scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0x00FF41, 0.6)
scene.add(ambientLight)

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

    resizeDotField()
})

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 2
scene.add(camera)

// Initialize persistent background
initDotField(scene, camera)

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
 * Post processing
 */
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const asciiShader = {
    uniforms:
    {
        tDiffuse: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;

        varying vec2 vUv;

        void main()
        {
            vec4 color = texture2D(tDiffuse, vUv);
            gl_FragColor = color;
        }
    `
}

const asciiPass = new ShaderPass(asciiShader)
effectComposer.addPass(asciiPass)

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

    // renderer.render(scene, camera)
    effectComposer.render()

    window.requestAnimationFrame(tick)
}

tick()