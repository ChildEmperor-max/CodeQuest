import * as THREE from "three";

// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
// camera.position.set(0, 5, 10);

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const clock = new THREE.Clock();
// Scene, Camera, Renderer, Clock

////////////
// MATERIAL
////////////

const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  
	void main() {

    vUv = uv;
    
    // VERTEX POSITION
    
    vec4 mvPosition = vec4( position, 1.0 );
    #ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
    #endif
    
    // DISPLACEMENT
    
    // here the displacement is made stronger on the blades tips.
    float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
    
    // 3.0 IS THE WINDSPEED
    float displacement = sin( mvPosition.z + time * 3.0 ) * ( 0.1 * dispPower );
    mvPosition.z += displacement;
    
    //
    
    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;

	}
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
  	vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
    float clarity = ( vUv.y * 0.5 ) + 0.5;
    gl_FragColor = vec4( baseColor * clarity, 1 );
  }
`;

const uniforms = {
  time: {
    value: 0,
  },
};
const leavesMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  side: THREE.DoubleSide,
});

export function addGrassShader(
  scene,
  grassBladeCount,
  grassBladeHeight,
  grassAreaSize,
  grassBladeAngle,
  grassAreaPosition,
  grassAreaRotation
) {
  // const grassBladeCount = 25000;
  // const grassBladeHeight = 0.5;
  // const grassAreaSize = new THREE.Vector3(50, 0, 50);
  // const grassBladeAngle = 0.195;
  // const grassAreaPosition = new THREE.Vector3(-30, -0.4, -85);
  const dummy = new THREE.Object3D();

  const geometry = new THREE.PlaneGeometry(0.1, 1, 1, 4);
  geometry.translate(0, grassBladeHeight, 0); // move grass blade geometry lowest point at 0.

  const instancedMesh = new THREE.InstancedMesh(
    geometry,
    leavesMaterial,
    grassBladeCount
  );

  scene.add(instancedMesh);

  // Position and scale the grass blade instances randomly.

  // Define the area where you want to distribute the grass within

  // Calculate the range for the grass distribution within the area
  const minX = -grassAreaSize.x / 2;
  const maxX = grassAreaSize.x / 2;
  const minZ = -grassAreaSize.z / 2;
  const maxZ = grassAreaSize.z / 2;

  // Define the angle of the grass area in radians
  const grassAreaAngle = Math.PI / 4; // Example angle in radians

  // Define the vertical displacement for each column
  const verticalDisplacement = 0.15;

  // Calculate the number of rows and columns
  const rowCount = Math.floor(grassAreaSize.z / verticalDisplacement);
  const columnCount = Math.floor(grassAreaSize.x / verticalDisplacement);

  const centerX = (maxX + minX) / 2;
  const centerZ = (maxZ + minZ) / 2;
  const centerY = 0; // Assuming the grass blades are at ground level

  // Offset the grass blades to move the center to the origin
  instancedMesh.position.set(centerX, centerY, centerZ);

  for (let col = 0; col < columnCount; col++) {
    const colProgress = col / columnCount;
    const currentX = THREE.MathUtils.lerp(minX, maxX, colProgress);

    for (let row = 0; row < rowCount; row++) {
      const currentZ = THREE.MathUtils.lerp(minZ, maxZ, row / rowCount);

      const rotatedX =
        currentX * Math.cos(grassAreaAngle) -
        currentZ * Math.sin(grassAreaAngle);
      const rotatedZ =
        currentX * Math.sin(grassAreaAngle) +
        currentZ * Math.cos(grassAreaAngle);

      const yPosition = -row * grassBladeAngle;

      // Offset the position by the center position
      dummy.position.set(
        rotatedX - centerX,
        yPosition - centerY,
        rotatedZ - centerZ
      );

      dummy.scale.setScalar(0.5 + Math.random() * 0.5);
      dummy.rotation.y = Math.random() * Math.PI;

      dummy.updateMatrix();
      instancedMesh.setMatrixAt(col + row * columnCount, dummy.matrix);
    }
  }

  // Move and rotate the entire grass area to a different position and angle in the scene
  // const grassAreaPosition = new THREE.Vector3(-30, -0.4, -85);

  instancedMesh.position.copy(grassAreaPosition);
  instancedMesh.rotation.copy(grassAreaRotation);
}

export function updateGrassShader(clock) {
  leavesMaterial.uniforms.time.value = clock.getElapsedTime();
  leavesMaterial.uniformsNeedUpdate = true;
}

//

// const animate = function () {
//   // Hand a time variable to vertex shader for wind displacement.
//   leavesMaterial.uniforms.time.value = clock.getElapsedTime();
//   leavesMaterial.uniformsNeedUpdate = true;

//   requestAnimationFrame(animate);

//   renderer.render(scene, camera);
// };

// animate();
