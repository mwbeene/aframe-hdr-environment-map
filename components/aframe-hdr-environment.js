AFRAME.registerComponent( 'hdr-environment', {
  schema: {
    url: { type: 'string' },
    showBackground: { type: 'boolean', default: false },
    showGround: { type: 'boolean', default: false },
    groundSize: { type: 'number', default: 30 }
  },
  init: function () {

    const scene = document.querySelector( 'a-scene' ).object3D;
    const renderer = document.querySelector( 'a-scene' ).renderer;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const rgbeLoader = new RGBELoader();

    rgbeLoader.load( this.data.url, texture => {

      let envMap = texture;
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      
      scene.environment = envMap;

      if ( this.data.showBackground ) {

        if( this.data.showGround ) {

          // sky
          let skyMap = envMap.clone();
          skyMap.needsUpdate = true;
          skyMap.repeat.set( 1, .8 );
          skyMap.offset.set( 0, .5 );

          let skyGeometry = new THREE.SphereGeometry( 1, 32, 32, 0, 2 * Math.PI, 0, Math.PI / 2 );
          let skyMaterial = new THREE.MeshBasicMaterial();
          skyMaterial.side = THREE.BackSide;
          skyMaterial.map = skyMap;
          
          let skyMesh = new THREE.Mesh( skyGeometry, skyMaterial );
          skyMesh.scale.x = this.data.groundSize;
          skyMesh.scale.y = this.data.groundSize;
          skyMesh.scale.z = -this.data.groundSize;
          skyMesh.position.y = this.data.groundSize * .1;
          scene.add( skyMesh );

          // ground
          let groundMap = envMap.clone();
          groundMap.needsUpdate = true;
          groundMap.repeat.set( 1, 1 );
          groundMap.offset.set( 0, -.5 );

          let groundGeometry = new THREE.SphereGeometry( 1, 32, 32, 0, 2 * Math.PI, Math.PI / 2, Math.PI );
          let groundMaterial = new THREE.MeshBasicMaterial();
          groundMaterial.side = THREE.BackSide;
          groundMaterial.map = groundMap;

          let groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
          groundMesh.scale.x = this.data.groundSize;
          groundMesh.scale.y = this.data.groundSize * .1;
          groundMesh.scale.z = -this.data.groundSize;
          groundMesh.position.y = this.data.groundSize * .1;
          scene.add( groundMesh );

        } else {

          scene.background = envMap;

        }
      }

    } );
  }
} );