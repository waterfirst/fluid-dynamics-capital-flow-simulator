import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SimulationState } from '../types';

interface CapitalFlowSceneProps {
  state: SimulationState;
}

const CapitalFlowScene = ({ state }: CapitalFlowSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const meshesRef = useRef(new Map<string, THREE.Mesh>());
  const linesRef = useRef(new Map<string, THREE.Line>());
  const particlesRef = useRef(new Map<string, THREE.Mesh>());
  const progressRef = useRef(new Map<string, number>());

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x071019, 0.055);
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.set(8.5, 6.4, 10.5);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x071019, 0);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 20;

    scene.add(new THREE.AmbientLight(0x8fb8d8, 1.35));
    const keyLight = new THREE.PointLight(0x5ee7ff, 65, 24);
    keyLight.position.set(-4, 6, 7);
    scene.add(keyLight);
    const warmLight = new THREE.PointLight(0xffa95c, 42, 20);
    warmLight.position.set(5, -2, 5);
    scene.add(warmLight);

    const grid = new THREE.GridHelper(15, 18, 0x24475a, 0x122a38);
    grid.position.y = -3.1;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    scene.add(grid);

    const initial = stateRef.current;
    const nodeById = new Map(initial.nodes.map((node) => [node.id, node]));
    initial.edges.forEach((edge) => {
      const source = nodeById.get(edge.source);
      const target = nodeById.get(edge.target);
      if (!source || !target) return;
      const points = [new THREE.Vector3(...source.position), new THREE.Vector3(...target.position)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x345466, transparent: true, opacity: 0.42 });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      linesRef.current.set(edge.id, line);

      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x75e8ff, transparent: true, opacity: 0.9 }),
      );
      particle.position.copy(points[0]);
      scene.add(particle);
      particlesRef.current.set(edge.id, particle);
      progressRef.current.set(edge.id, Math.random());
    });

    initial.nodes.forEach((node) => {
      const geometry = new THREE.IcosahedronGeometry(0.48, 3);
      const material = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: new THREE.Color(node.color).multiplyScalar(0.2),
        roughness: 0.28,
        metalness: 0.34,
        transparent: true,
        opacity: 0.94,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...node.position);
      scene.add(mesh);
      meshesRef.current.set(node.id, mesh);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.62, 24, 24),
        new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.055, side: THREE.BackSide }),
      );
      mesh.add(halo);
    });

    const resize = () => {
      const width = Math.max(320, mount.clientWidth);
      const height = Math.max(390, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const current = stateRef.current;
      const currentNodes = new Map(current.nodes.map((node) => [node.id, node]));

      current.nodes.forEach((node) => {
        const mesh = meshesRef.current.get(node.id);
        if (!mesh) return;
        const capitalRatio = node.capital / node.baselineCapital;
        const scale = 0.78 + Math.sqrt(Math.max(0.25, capitalRatio)) * 0.28;
        mesh.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
        mesh.rotation.y += delta * (0.16 + Math.abs(node.pressure) * 0.18);
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = Math.min(1.2, 0.24 + Math.abs(node.externalForce) * 0.55);
      });

      current.edges.forEach((edge) => {
        const source = currentNodes.get(edge.source);
        const target = currentNodes.get(edge.target);
        const particle = particlesRef.current.get(edge.id);
        const line = linesRef.current.get(edge.id);
        if (!source || !target || !particle || !line) return;
        const sourceVector = new THREE.Vector3(...source.position);
        const targetVector = new THREE.Vector3(...target.position);
        const speed = 0.035 + Math.min(0.6, Math.abs(edge.velocity) * 0.22);
        const previousProgress = progressRef.current.get(edge.id) ?? 0;
        const direction = edge.velocity >= 0 ? 1 : -1;
        const progress = (previousProgress + direction * speed * delta + 1) % 1;
        progressRef.current.set(edge.id, progress);
        particle.position.lerpVectors(sourceVector, targetVector, progress);
        const particleMaterial = particle.material as THREE.MeshBasicMaterial;
        particleMaterial.color.set(edge.velocity >= 0 ? 0x62e6ff : 0xff8e62);
        particleMaterial.opacity = Math.min(1, 0.25 + Math.abs(edge.velocity) * 0.6);
        particle.scale.setScalar(0.72 + Math.min(1.2, Math.abs(edge.flow) / 10));
        const lineMaterial = line.material as THREE.LineBasicMaterial;
        lineMaterial.color.set(edge.velocity >= 0 ? 0x397b93 : 0x8a4b3f);
        lineMaterial.opacity = Math.min(0.9, 0.18 + Math.abs(edge.velocity) * 0.28);
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      meshesRef.current.clear();
      linesRef.current.clear();
      particlesRef.current.clear();
    };
  }, []);

  return (
    <div className="scene-shell">
      <div className="scene-heading">
        <div>
          <span className="eyebrow">3D NETWORK SOLVER</span>
          <h2>Capital flow field</h2>
        </div>
        <div className="scene-key">
          <span><i className="dot cyan" />정방향</span>
          <span><i className="dot coral" />역방향</span>
          <span>드래그·휠로 탐색</span>
        </div>
      </div>
      <div ref={mountRef} className="scene-canvas" aria-label="Three-dimensional capital flow network" />
      <div className="node-legend">
        {state.nodes.map((node) => (
          <div className="node-pill" key={node.id} title={node.description}>
            <i style={{ backgroundColor: node.color }} />
            <span>{node.shortName}</span>
            <strong>{Math.round(node.capital).toLocaleString()}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapitalFlowScene;
