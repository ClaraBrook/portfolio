import * as THREE from "three"
import { setHTML } from "../engine/ui"

let sphere

export function createAbout(scene) {
  return {
    init() {

      setHTML(`
        <h1>About</h1>
        <p>This page explains who I am.</p>
      `)

      sphere = new THREE.Mesh(
        new THREE.SphereGeometry(),
        new THREE.MeshNormalMaterial()
      )

      scene.add(sphere)
    },

    update(time) {
      if (sphere) {
        sphere.rotation.x = time * 0.5
      }
    },

    cleanup() {
      if (sphere) scene.remove(sphere)
    }
  }
}