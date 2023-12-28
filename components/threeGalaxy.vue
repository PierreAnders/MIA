<template>
  <div ref="sceneContainer"></div>
</template>
  
<script>
import * as THREE from 'three';
import galaxyTexture from '@/assets/images/stone.jpg';
import cometesCTexture from '@/assets/images/stone.jpg';
import gaiaTexture from '@/assets/images/stone.jpg';
import rockTexture from '@/assets/images/stone.jpg';
import terrecuiteTexture from '@/assets/images/stone.jpg';
import betonTexture from '@/assets/images/stone.jpg';
import carreauxTexture from '@/assets/images/stone.jpg';

export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      animate: null,
      onDocumentMouseDown: null,
      onDocumentMouseMove: null
    };
  },
  mounted() {
    const params = this.createScene();

    this.scene = params.scene;
    this.camera = params.camera;
    this.renderer = params.renderer;
    this.animate = params.animate;
    this.onDocumentMouseDown = params.onDocumentMouseDown;
    this.onDocumentMouseMove = params.onDocumentMouseMove;

    if (!this.scene || !this.camera || !this.renderer || !this.animate || !this.onDocumentMouseDown || !this.onDocumentMouseMove) {
      console.error('Error: object is not available.');
      return;
    }

    this.$refs.sceneContainer.appendChild(this.renderer.domElement);

    document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);

    this.animate();
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.onDocumentMouseDown, false);
    document.removeEventListener('mousemove', this.onDocumentMouseMove, false);
  },
  methods: {
    createScene() {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      scene.background = new THREE.Color(0x111114);

      const sphereGeometry1 = new THREE.SphereGeometry(0.40, 32, 32);
      const sphereGeometry2 = new THREE.SphereGeometry(0.28, 32, 32);
      const sphereGeometry3 = new THREE.SphereGeometry(0.28, 32, 32);
      const sphereGeometry4 = new THREE.SphereGeometry(0.30, 32, 32);
      const sphereGeometry5 = new THREE.SphereGeometry(0.30, 32, 32);
      const sphereGeometry6 = new THREE.SphereGeometry(0.45, 32, 32);
      const sphereGeometry7 = new THREE.SphereGeometry(0.35, 32, 32);

      const physTexture = new THREE.TextureLoader().load(galaxyTexture);
      const medTexture = new THREE.TextureLoader().load(cometesCTexture);
      const ecoTexture = new THREE.TextureLoader().load(gaiaTexture);
      const earthTexture = new THREE.TextureLoader().load(rockTexture);
      const stoneTexture = new THREE.TextureLoader().load(terrecuiteTexture);
      const fireTexture = new THREE.TextureLoader().load(betonTexture);
      const waterTexture = new THREE.TextureLoader().load(carreauxTexture);

      const physMaterial = new THREE.MeshBasicMaterial({ map: physTexture });
      const medMaterial = new THREE.MeshBasicMaterial({ map: medTexture });
      const ecoMaterial = new THREE.MeshBasicMaterial({ map: ecoTexture });
      const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
      const stoneMaterial = new THREE.MeshBasicMaterial({ map: stoneTexture });
      const fireMaterial = new THREE.MeshBasicMaterial({ map: fireTexture });
      const waterMaterial = new THREE.MeshBasicMaterial({ map: waterTexture });

      const physSphere = new THREE.Mesh(sphereGeometry1, physMaterial);
      const medSphere = new THREE.Mesh(sphereGeometry2, medMaterial);
      const ecoSphere = new THREE.Mesh(sphereGeometry3, ecoMaterial);
      const earthSphere = new THREE.Mesh(sphereGeometry4, earthMaterial);
      const stoneSphere = new THREE.Mesh(sphereGeometry5, stoneMaterial);
      const fireSphere = new THREE.Mesh(sphereGeometry6, fireMaterial);
      const waterSphere = new THREE.Mesh(sphereGeometry7, waterMaterial);

      physSphere.position.set(0, 3, 0); // Tête
      medSphere.position.set(-2, -1, 0); // Bras gauche
      ecoSphere.position.set(2, -1, 0); // Bras droite 
      earthSphere.position.set(-1.5, -4, 0); // jambe gauche
      stoneSphere.position.set(1.5, -4, 0); // jambe droite
      fireSphere.position.set(0, 4.5, 0); // Ventre
      waterSphere.position.set(0, 0, 0); // bassin

      scene.add(physSphere);
      scene.add(medSphere);
      scene.add(ecoSphere);
      scene.add(earthSphere);
      scene.add(stoneSphere);
      scene.add(fireSphere);
      scene.add(waterSphere);

      physSphere.userData.url = "https://";
      medSphere.userData.url = "https://";
      ecoSphere.userData.url = "https://";
      earthSphere.userData.url = "https://";
      stoneSphere.userData.url = "https://";
      fireSphere.userData.url = "https://";
      waterSphere.userData.url = "https://";

      function createCurvedLineBetweenObjects(object1, object2, segments, color, yOffset) {
        const points = [];
        for (let i = 0; i <= segments; i++) {
          points.push(new THREE.Vector3());
        }

        const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const curveMaterial = new THREE.LineBasicMaterial({ color: color });
        const line = new THREE.Line(curveGeometry, curveMaterial);

        line.userData.update = function () {
          const start = object1.position.clone();
          const end = object2.position.clone();
          const mid = start.clone().lerp(end, 0.5);
          const controlPoint = mid.clone().add(new THREE.Vector3(0, (start.distanceTo(end) / 2) * yOffset, 0));

          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const ab = new THREE.Vector3().lerpVectors(start, controlPoint, t);
            const bc = new THREE.Vector3().lerpVectors(controlPoint, end, t);
            const point = new THREE.Vector3().lerpVectors(ab, bc, t);

            const waveHeight = 0.1 * Math.sin(i / 5 + performance.now() * 0.001);
            points[i].copy(point).add(new THREE.Vector3(0, waveHeight, 0));
          }

          curveGeometry.setFromPoints(points);
        };

        return line;
      }

      const physMedLine1 = createCurvedLineBetweenObjects(physSphere, medSphere, 50, 0xffffff, 0);
      const physMedLine2 = createCurvedLineBetweenObjects(physSphere, medSphere, 50, 0xffffff, 1);
      const physMedLine3 = createCurvedLineBetweenObjects(physSphere, medSphere, 50, 0xffffff, -1);
      const medEcoLine1 = createCurvedLineBetweenObjects(medSphere, ecoSphere, 50, 0xffffff, 0);
      const medEcoLine2 = createCurvedLineBetweenObjects(medSphere, ecoSphere, 50, 0xffffff, 1);
      const medEcoLine3 = createCurvedLineBetweenObjects(medSphere, ecoSphere, 50, 0xffffff, -1);
      const ecoPhysLine1 = createCurvedLineBetweenObjects(ecoSphere, physSphere, 50, 0xffffff, 0);
      const ecoPhysLine2 = createCurvedLineBetweenObjects(ecoSphere, physSphere, 50, 0xffffff, 1);
      const ecoPhysLine3 = createCurvedLineBetweenObjects(ecoSphere, physSphere, 50, 0xffffff, -1);
      const earthPhysLine1 = createCurvedLineBetweenObjects(earthSphere, physSphere, 50, 0xffffff, -1);
      const earthPhysLine2 = createCurvedLineBetweenObjects(earthSphere, physSphere, 50, 0xffffff, 0);
      const stonePhysLine1 = createCurvedLineBetweenObjects(stoneSphere, medSphere, 50, 0xffffff, -1);
      const stonePhysLine2 = createCurvedLineBetweenObjects(stoneSphere, physSphere, 50, 0xffffff, 1);
      const firePhysLine1 = createCurvedLineBetweenObjects(fireSphere, physSphere, 50, 0xffffff, 1);
      const waterPhysLine1 = createCurvedLineBetweenObjects(waterSphere, fireSphere, 50, 0xffffff, 0);
      const waterFireLine1 = createCurvedLineBetweenObjects(waterSphere, fireSphere, 50, 0xffffff, 0);
      const waterStoneLine1 = createCurvedLineBetweenObjects(waterSphere, stoneSphere, 50, 0xffffff, -1);

      scene.add(physMedLine1);
      scene.add(physMedLine2);
      scene.add(physMedLine3);
      scene.add(medEcoLine1);
      scene.add(medEcoLine2);
      // scene.add(medEcoLine3);
      scene.add(ecoPhysLine1);
      scene.add(ecoPhysLine2);
      scene.add(ecoPhysLine3);
      scene.add(earthPhysLine1);
      scene.add(earthPhysLine2);
      // scene.add(stonePhysLine1);
      scene.add(stonePhysLine2);
      scene.add(firePhysLine1);
      scene.add(waterPhysLine1);
      scene.add(waterFireLine1);
      scene.add(waterStoneLine1);

      camera.position.z = 10;

      function animate() {
        requestAnimationFrame(animate);

        physSphere.rotation.y += 0.001;
        medSphere.rotation.y += 0.001;
        ecoSphere.rotation.y += 0.001;
        earthSphere.rotation.y += 0.001;
        stoneSphere.rotation.y += 0.001;
        fireSphere.rotation.y += 0.001;
        waterSphere.rotation.y += 0.001;

        physMedLine1.userData.update();
        physMedLine2.userData.update();
        physMedLine3.userData.update();
        medEcoLine1.userData.update();
        medEcoLine2.userData.update();
        medEcoLine3.userData.update();
        ecoPhysLine1.userData.update();
        ecoPhysLine2.userData.update();
        ecoPhysLine3.userData.update();
        earthPhysLine1.userData.update();
        earthPhysLine2.userData.update();
        stonePhysLine1.userData.update();
        stonePhysLine2.userData.update();
        firePhysLine1.userData.update();
        waterPhysLine1.userData.update();
        waterFireLine1.userData.update();
        waterStoneLine1.userData.update();

        renderer.render(scene, camera);
      }

      animate();

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      function onDocumentMouseDown(event) {
        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        for (let i = 0; i < intersects.length; i++) {
          if (intersects[i].object.userData.url) {
            window.location.href = intersects[i].object.userData.url;
            break;
          }
        }
      }

      function onDocumentMouseMove(event) {
        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        let cursorStyle = 'default';

        for (let i = 0; i < intersects.length; i++) {
          if (intersects[i].object instanceof THREE.Mesh) {
            cursorStyle = 'pointer';
            break;
          }
        }

        document.body.style.cursor = cursorStyle;
      }

      document.addEventListener('mousedown', onDocumentMouseDown, false);
      document.addEventListener('mousemove', onDocumentMouseMove, false);

      animate();

      addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      })

      return { scene, camera, renderer, animate, onDocumentMouseDown, onDocumentMouseMove };

    }
  }
};
</script>