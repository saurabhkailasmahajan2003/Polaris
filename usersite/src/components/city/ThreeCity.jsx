import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { CITY_BUILDINGS } from '../../lib/cityBuildings';

const FRUSTUM_SIZE = 88;
const GROUND_SIZE = 120;
const PARTICLE_COUNT = 800;

// Wide radial layout — generous gaps between every building
const BUILDING_CONFIGS = [
  {
    id: 'supreme_court',
    position: [0, 0, -30],
    width: 6,
    height: 14,
    depth: 6,
    labelY: 16,
    color: 0x1a0a3a,
    emissive: 0x7c3aed,
    lightIntensity: 4,
    lightDistance: 28,
    dome: true,
    columns: true,
  },
  {
    id: 'investigation_hq',
    position: [-28, 0, -12],
    width: 5,
    height: 9,
    depth: 5,
    labelY: 11,
    color: 0x0a1a3a,
    emissive: 0x4f6ef7,
    lightIntensity: 3,
    lightDistance: 22,
    isActiveWhenCases: true,
  },
  {
    id: 'expert_chambers',
    position: [28, 0, -12],
    width: 5,
    height: 8,
    depth: 5,
    labelY: 10,
    color: 0x0a2a3a,
    emissive: 0x06b6d4,
    lightIntensity: 3,
    lightDistance: 22,
  },
  {
    id: 'fact_check',
    position: [-22, 0, 18],
    width: 4,
    height: 6,
    depth: 4,
    labelY: 8,
    color: 0x2a1a0a,
    emissive: 0xf59e0b,
    lightIntensity: 2,
    lightDistance: 18,
  },
  {
    id: 'public_square',
    position: [0, 0, 30],
    width: 7,
    height: 3,
    depth: 7,
    labelY: 5,
    color: 0x0a2a1a,
    emissive: 0x10b981,
    lightIntensity: 2,
    lightDistance: 20,
    fountain: true,
  },
  {
    id: 'city_archive',
    position: [22, 0, 18],
    width: 4,
    height: 7,
    depth: 4,
    labelY: 9,
    color: 0x2a0a0a,
    emissive: 0xdc2626,
    lightIntensity: 2,
    lightDistance: 18,
  },
];

function createBuilding(cfg) {
  const { width, height, depth, color, emissive, id } = cfg;
  const group = new THREE.Group();
  group.userData = { buildingId: id };

  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(emissive),
    emissiveIntensity: 0.35,
    metalness: 0.8,
    roughness: 0.2,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), bodyMat);
  body.position.y = height / 2;
  body.userData = { buildingId: id, isBuilding: true };
  group.add(body);

  const rows = Math.max(4, Math.floor(height / 2));
  const cols = Math.max(3, Math.floor(width / 1.5));
  const winW = width / (cols + 2);
  const winH = height / (rows + 2);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const win = new THREE.Mesh(
        new THREE.BoxGeometry(winW * 0.5, winH * 0.5, 0.08),
        new THREE.MeshStandardMaterial({
          emissive: new THREE.Color(emissive),
          emissiveIntensity: 0.5 + Math.random() * 1.2,
        })
      );
      const xOff = (col - (cols - 1) / 2) * (width / (cols + 1));
      const yOff = 0.8 + row * (height / (rows + 1));
      win.position.set(xOff, yOff, depth / 2 + 0.05);
      group.add(win);
    }
  }

  if (cfg.dome) {
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(width * 0.42, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: new THREE.Color(emissive),
        emissiveIntensity: 0.65,
        metalness: 0.9,
        roughness: 0.1,
      })
    );
    dome.position.y = height + 0.2;
    group.add(dome);
  }

  if (cfg.columns) {
    for (let i = 0; i < 8; i++) {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.3, height * 0.85, 10),
        new THREE.MeshStandardMaterial({ color: 0x99aabb, metalness: 0.6, roughness: 0.3 })
      );
      const angle = (i / 8) * Math.PI * 2;
      col.position.set(
        Math.cos(angle) * (width / 2 + 0.5),
        height * 0.42,
        Math.sin(angle) * (depth / 2 + 0.5)
      );
      group.add(col);
    }
  }

  if (cfg.fountain) {
    const fountain = new THREE.Mesh(
      new THREE.TorusGeometry(width * 0.22, 0.15, 10, 32),
      new THREE.MeshStandardMaterial({
        emissive: new THREE.Color(emissive),
        emissiveIntensity: 0.85,
        color: 0x0a2a1a,
      })
    );
    fountain.rotation.x = Math.PI / 2;
    fountain.position.y = 0.2;
    group.add(fountain);
  }

  const pointLight = new THREE.PointLight(emissive, cfg.lightIntensity, cfg.lightDistance);
  pointLight.position.set(0, height * 0.55, 0);
  group.add(pointLight);

  group.position.set(cfg.position[0], cfg.position[1], cfg.position[2]);
  group.userData.bodyMat = bodyMat;
  group.userData.pointLight = pointLight;
  return group;
}

function createLabel(title, subtitle, labelY, showLive) {
  const div = document.createElement('div');
  div.style.cssText = `
    background: rgba(5, 8, 24, 0.92);
    border: 1px solid rgba(79, 110, 247, 0.5);
    border-radius: 8px;
    padding: 8px 14px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: white;
    text-align: center;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 0 20px rgba(79, 110, 247, 0.3);
  `;
  const liveLine = showLive
    ? '<div style="color:#10b981;font-size:10px;font-weight:500;margin-top:4px">● LIVE</div>'
    : '';
  div.innerHTML = `
    <div style="font-size:13px;font-weight:600;color:white">${title}</div>
    <div style="color:#94a3b8;font-size:10px;font-weight:400;margin-top:2px">${subtitle}</div>
    ${liveLine}
  `;
  const label = new CSS2DObject(div);
  label.position.set(0, labelY, 0);
  return label;
}

function addPath(scene, points, y = 0.12) {
  const verts = points.map(([x, z]) => new THREE.Vector3(x, y, z));
  const geo = new THREE.BufferGeometry().setFromPoints(verts);
  const mat = new THREE.LineBasicMaterial({ color: 0x4f6ef7, transparent: true, opacity: 0.3 });
  scene.add(new THREE.Line(geo, mat));
}

export default function ThreeCity({ selectedBuilding, onBuildingSelect, activeCaseIds = [] }) {
  const containerRef = useRef(null);
  const onSelectRef = useRef(onBuildingSelect);
  const selectedRef = useRef(selectedBuilding);
  const hoveredRef = useRef(null);
  const activeIdsRef = useRef(activeCaseIds);
  const labelObjectsRef = useRef([]);

  onSelectRef.current = onBuildingSelect;
  selectedRef.current = selectedBuilding;
  activeIdsRef.current = activeCaseIds;

  const handleSelect = useCallback((id) => {
    onSelectRef.current?.(id);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030610);
    scene.fog = new THREE.FogExp2(0x030610, 0.006);

    const camera = new THREE.OrthographicCamera(
      (FRUSTUM_SIZE * aspect) / -2,
      (FRUSTUM_SIZE * aspect) / 2,
      FRUSTUM_SIZE / 2,
      FRUSTUM_SIZE / -2,
      0.1,
      1000
    );
    camera.position.set(58, 58, 58);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0x0a1628, 3));

    const keyLight = new THREE.DirectionalLight(0x4f6ef7, 2);
    keyLight.position.set(30, 50, 30);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7c3aed, 1.5);
    fillLight.position.set(-30, 28, -30);
    scene.add(fillLight);

    scene.add(new THREE.HemisphereLight(0x050818, 0x06b6d4, 1));

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE),
      new THREE.MeshStandardMaterial({ color: 0x030610, metalness: 0.8, roughness: 0.4 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(GROUND_SIZE, 40, 0x4f6ef7, 0x4f6ef7);
    grid.material.opacity = 0.12;
    grid.material.transparent = true;
    scene.add(grid);

    // Paths
    // Paths follow the wider layout
    addPath(scene, [[0, -30], [-28, -12], [-22, 18], [0, 30]]);
    addPath(scene, [[0, -30], [28, -12], [22, 18], [0, 30]]);

    // Buildings
    const buildings = [];
    const bodyMats = [];
    const labelObjects = [];

    BUILDING_CONFIGS.forEach((cfg) => {
      const meta = CITY_BUILDINGS.find((b) => b.id === cfg.id);
      const group = createBuilding(cfg);
      const showLive = cfg.isActiveWhenCases && activeIdsRef.current.length > 0;
      const label = createLabel(meta?.label || cfg.id, meta?.tagline || '', cfg.labelY, showLive);
      group.add(label);
      labelObjects.push({ label, cfg, div: label.element });
      scene.add(group);
      buildings.push(group);
      bodyMats.push(group.userData.bodyMat);
    });
    labelObjectsRef.current = labelObjects;

    // Particles
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * GROUND_SIZE;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * GROUND_SIZE;

      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i * 3] = 0.31;
        colors[i * 3 + 1] = 0.43;
        colors[i * 3 + 2] = 0.97;
      } else if (colorChoice < 0.8) {
        colors[i * 3] = 0.02;
        colors[i * 3 + 1] = 0.71;
        colors[i * 3 + 2] = 0.83;
      } else {
        colors[i * 3] = 0.49;
        colors[i * 3 + 1] = 0.23;
        colors[i * 3 + 2] = 0.93;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      })
    );
    scene.add(particles);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let dragStartX = 0;
    let dragRotation = 0;
    let isDragging = false;
    let hasDragged = false;

    const updateLabelsLive = () => {
      labelObjects.forEach(({ label, cfg, div }) => {
        const meta = CITY_BUILDINGS.find((b) => b.id === cfg.id);
        const showLive = cfg.isActiveWhenCases && activeIdsRef.current.length > 0;
        const liveLine = showLive
          ? '<div style="color:#10b981;font-size:10px;font-weight:500;margin-top:4px">● LIVE</div>'
          : '';
        div.innerHTML = `
          <div style="font-size:13px;font-weight:600;color:white">${meta?.label || cfg.id}</div>
          <div style="color:#94a3b8;font-size:10px;font-weight:400;margin-top:2px">${meta?.tagline || ''}</div>
          ${liveLine}
        `;
      });
    };

    const updateHighlight = (pulse) => {
      buildings.forEach((b, i) => {
        const mat = bodyMats[i];
        if (!mat) return;
        const selected = b.userData.buildingId === selectedRef.current;
        const hovered = b === hoveredRef.current;
        const active = b.userData.buildingId === 'investigation_hq' && activeIdsRef.current.length > 0;

        if (selected) {
          mat.emissiveIntensity = 0.75;
          b.scale.setScalar(1.04);
        } else if (hovered) {
          mat.emissiveIntensity = 0.6;
          b.scale.setScalar(1.02);
        } else if (active) {
          mat.emissiveIntensity = pulse + 0.25;
          b.scale.setScalar(1);
        } else {
          mat.emissiveIntensity = pulse;
          b.scale.setScalar(1);
        }
      });
    };

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const asp = w / h;

      camera.left = (FRUSTUM_SIZE * asp) / -2;
      camera.right = (FRUSTUM_SIZE * asp) / 2;
      camera.top = FRUSTUM_SIZE / 2;
      camera.bottom = FRUSTUM_SIZE / -2;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const delta = (e.clientX - dragStartX) * 0.004;
        if (Math.abs(e.clientX - dragStartX) > 4) hasDragged = true;
        scene.rotation.y = dragRotation + delta;
        return;
      }

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const meshes = buildings.flatMap((g) => g.children.filter((c) => c.userData?.isBuilding));
      hoveredRef.current = null;
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length) hoveredRef.current = hits[0].object.parent;
      container.style.cursor = hoveredRef.current ? 'pointer' : 'default';
    };

    const onMouseDown = (e) => {
      isDragging = true;
      hasDragged = false;
      dragStartX = e.clientX;
      dragRotation = scene.rotation.y;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      if (hasDragged) return;
      if (hoveredRef.current?.userData?.buildingId) {
        onSelectRef.current?.(hoveredRef.current.userData.buildingId);
      }
    };

    window.addEventListener('resize', onResize);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!isDragging) {
        scene.rotation.y += 0.0008;
        dragRotation = scene.rotation.y;
      }

      const pulse = Math.sin(Date.now() * 0.0015) * 0.15 + 0.35;
      updateHighlight(pulse);
      updateLabelsLive();

      const posArr = particleGeo.attributes.position.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posArr[i * 3 + 1] += 0.02;
        if (posArr[i * 3 + 1] > 30) posArr[i * 3 + 1] = 0;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('click', onClick);
      renderer.dispose();
      particleGeo.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if (container.contains(labelRenderer.domElement)) container.removeChild(labelRenderer.domElement);
    };
  }, [handleSelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full min-h-[420px]" />
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-muted pointer-events-none">
        Drag to rotate · Click a building to enter
      </p>
    </div>
  );
}
