import * as THREE from "three"
import { setHTML } from "../engine/ui"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/Addons.js"

let textMesh
let font

const mouse = { x: 0, y: 0 }
const prevMouse = { x: 0, y: 0 }

const spinVelocity = {
  x: 0,
  y: 0
}

const damping = 0.95
const spinStrength = 0.9

const maxSpeed = 0.25
const cruiseSpeed = 0.0025

function clampVelocity(v) {
  return Math.max(-maxSpeed, Math.min(maxSpeed, v))
}

function smoothDamp(v) {

  if (Math.abs(v) < 0.00001) return v

  const sign = Math.sign(v)

  return v * damping + sign * cruiseSpeed * (1 - damping)
}

function processPointer(clientX, clientY) {

  const x = clientX / window.innerWidth
  const y = clientY / window.innerHeight

  mouse.x = x * 2 - 1
  mouse.y = -(y * 2 - 1)

  const dx = mouse.x - prevMouse.x
  const dy = mouse.y - prevMouse.y

  spinVelocity.y += dx * spinStrength
  spinVelocity.x += dy * spinStrength

  spinVelocity.x = clampVelocity(spinVelocity.x)
  spinVelocity.y = clampVelocity(spinVelocity.y)

  prevMouse.x = mouse.x
  prevMouse.y = mouse.y
}

function calculateFontSize() {
  // adjust this multiplier to taste
  return window.innerWidth * 0.0005
}

function buildText(scene) {

  if (!font) return

  const size = calculateFontSize()

  const geometry = new TextGeometry(
    "Clara\nBrook",
    {
      font: font,
      size: size,
      depth: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: size * 0.08,
      bevelSize: size * 0.05,
      bevelOffset: 0,
      bevelSegments: 5
    }
  )

  geometry.center()

  if (!textMesh) {

    const material = new THREE.MeshBasicMaterial({
      color: "red",
      wireframe: true
    })

    textMesh = new THREE.Mesh(geometry, material)
    scene.add(textMesh)

  } else {

    textMesh.geometry.dispose()
    textMesh.geometry = geometry

  }
}

export function createHome(scene) {

  function handleResize() {
    buildText(scene)
  }

  return {

    init() {

      setHTML(`
        <h1>Home</h1>
        <p>Welcome to my portfolio.</p>
      `)

      window.addEventListener("mousemove", (event) => {
        processPointer(event.clientX, event.clientY)
      })

      window.addEventListener("touchmove", (event) => {
        const touch = event.touches[0]
        processPointer(touch.clientX, touch.clientY)
      })

      window.addEventListener("resize", handleResize)

      const fontLoader = new FontLoader()

      fontLoader.load(
        "/fonts/helvetiker_bold.typeface.json",
        (loadedFont) => {

          font = loadedFont
          buildText(scene)

        }
      )
    },

    update() {

      if (textMesh) {

        textMesh.rotation.x += spinVelocity.x
        textMesh.rotation.y += spinVelocity.y

        spinVelocity.x = smoothDamp(spinVelocity.x)
        spinVelocity.y = smoothDamp(spinVelocity.y)
      }

    },

    cleanup() {

      window.removeEventListener("resize", handleResize)

      if (textMesh) {
        scene.remove(textMesh)
        textMesh.geometry.dispose()
        textMesh.material.dispose()
        textMesh = null
      }

    }

  }

}