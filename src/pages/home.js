import * as THREE from "three"
import { setHTML } from "../engine/ui"
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from "three/examples/jsm/Addons.js"

let cube
let textMesh

const mouse = { x: 0, y: 0 }
const prevMouse = { x: 0, y: 0 }

const spinVelocity = {
  x: 0,
  y: 0
}

const damping = 0.93
const spinStrength = 0.9

function processPointer(clientX, clientY) {

  const x = clientX / window.innerWidth
  const y = clientY / window.innerHeight

  mouse.x = x * 2 - 1
  mouse.y = -(y * 2 - 1)

  const dx = mouse.x - prevMouse.x
  const dy = mouse.y - prevMouse.y

  spinVelocity.y += dx * spinStrength
  spinVelocity.x += dy * spinStrength

  prevMouse.x = mouse.x
  prevMouse.y = mouse.y
}

export function createHome(scene) {
  return {
    init() {

      setHTML(`
        <h1>Home</h1>
        <p>Welcome to my portfolio.</p>
      `)

      /**
       * Mouse movement
       */
      window.addEventListener("mousemove", (event) => {
        processPointer(event.clientX, event.clientY)
      })

      /**
       * Touch movement
       */
      window.addEventListener("touchmove", (event) => {
        const touch = event.touches[0]
        processPointer(touch.clientX, touch.clientY)
      })

      /**
       * 3D Text
       */

      const fontLoader = new FontLoader()

      fontLoader.load(
        '/fonts/helvetiker_bold.typeface.json',
        (font) => {

          const textGeometry = new TextGeometry(
            'Clara\nBrook',
            {
              font: font,
              size: 0.35,
              depth: 0.2,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 0.03,
              bevelSize: 0.02,
              bevelOffset: 0,
              bevelSegments: 5
            }
          )

          textGeometry.center()

          const textMaterial = new THREE.MeshBasicMaterial({
            color: "red",
            wireframe: true
          })

          textMesh = new THREE.Mesh(textGeometry, textMaterial)

          scene.add(textMesh)
        }
      )
    },

    update(time) {

      if (textMesh) {

        textMesh.rotation.x += spinVelocity.x
        textMesh.rotation.y += spinVelocity.y

        spinVelocity.x *= damping
        spinVelocity.y *= damping
      }
    },

    cleanup() {
      if (cube) scene.remove(cube)
      if (textMesh) scene.remove(textMesh)
    }
  }
}