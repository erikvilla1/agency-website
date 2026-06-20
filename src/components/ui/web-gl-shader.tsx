import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: any
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        // Slight vertical offset between strands so they read as two separate
        // ribbons of light instead of one band.
        float o = distortion * 4.0;

        // Two white wave strands at different phase, brightness, and shade.
        float w1 = 0.05  / abs(p.y     + sin((p.x + time)             * xScale) * yScale);
        float w2 = 0.035 / abs(p.y + o + sin((p.x + time * 0.8 + 1.5) * xScale) * (yScale * 0.9));

        // Pure white core + a cool off-white companion strand.
        vec3 col = vec3(1.0)              * w1
                 + vec3(0.84, 0.86, 0.90) * w2;

        gl_FragColor = vec4(col, 1.0);
      }
    `

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      refs.renderer.setPixelRatio(window.devicePixelRatio)
      refs.renderer.setClearColor(new THREE.Color(0x000000))
      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)
      refs.uniforms = {
        resolution: { value: [1, 1] },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.5 },
        distortion: { value: 0.05 },
      }
      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]
      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', positions)
      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })
      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)
      handleResize()
    }

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.003
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    // Size to the canvas's own box (the section), not the browser window.
    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = canvas.clientWidth || 1
      const height = canvas.clientHeight || 1
      refs.renderer.setSize(width, height, false)
      const buffer = refs.renderer.getDrawingBufferSize(new THREE.Vector2())
      refs.uniforms.resolution.value = [buffer.x, buffer.y]
    }

    initScene()
    animate()

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(canvas)
    window.addEventListener('resize', handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
}
