/**
 * Ngoăn - Trái Cây Gọt Sẵn: 3D Rectangular Fruit Box Studio (Three.js WebGL)
 * Realistic 3D Rectangular Box with compartments, procedural 3D fruits,
 * drop animations, 360° OrbitControls, and interactive fruit placement.
 */

class FruitBox3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.boxGroup = new THREE.Group();
        this.fruitsGroup = new THREE.Group();
        this.lidGroup = new THREE.Group();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.boxType = 'clear'; // 'clear' (acrylic) or 'wood' (bento)
        this.compartments = 3; // 2, 3, or 4 compartments
        this.isLidOpen = true;
        this.isAutoRotate = false;

        // Active fruits data in the box
        this.activeFruits = [];
        this.animatingFruits = [];

        this.boxDimensions = {
            width: 14,
            height: 4.2,
            depth: 9.5,
            wallThickness: 0.3
        };

        this.init();
    }

    init() {
        const width = this.canvas.clientWidth || 550;
        const height = this.canvas.clientHeight || 450;

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        this.camera.position.set(0, 15, 18);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // OrbitControls
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.06;
            this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below ground
            this.controls.minDistance = 12;
            this.controls.maxDistance = 35;
            this.controls.target.set(0, 1.5, 0);
        }

        // Lighting
        this.setupLights();

        // Build Box & Groups
        this.scene.add(this.boxGroup);
        this.scene.add(this.fruitsGroup);
        this.scene.add(this.lidGroup);

        this.buildRectangularBox();
        this.createGroundShadowPlane();

        // Resize handler
        window.addEventListener('resize', () => this.onResize());

        // Interaction
        this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));

        // Start render loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupLights() {
        // Ambient Light for soft base
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        this.scene.add(ambientLight);

        // Key Warm Daylight Directional Light
        const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
        dirLight.position.set(12, 22, 14);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.camera.left = -12;
        dirLight.shadow.camera.right = 12;
        dirLight.shadow.camera.top = 12;
        dirLight.shadow.camera.bottom = -12;
        dirLight.shadow.bias = -0.0005;
        this.scene.add(dirLight);

        // Soft Greenish/Fresh Fill Light from opposite side
        const fillLight = new THREE.DirectionalLight(0xdcfce7, 0.6);
        fillLight.position.set(-14, 10, -10);
        this.scene.add(fillLight);

        // Specular Point Light for juicy glistening water droplets on fruits
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 30);
        pointLight.position.set(0, 12, 5);
        this.scene.add(pointLight);
    }

    createGroundShadowPlane() {
        const shadowGeo = new THREE.PlaneGeometry(30, 26);
        const shadowMat = new THREE.ShadowMaterial({ opacity: 0.16 });
        const ground = new THREE.Mesh(shadowGeo, shadowMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.05;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    buildRectangularBox() {
        // Clear previous box
        while (this.boxGroup.children.length > 0) {
            const obj = this.boxGroup.children[0];
            this.boxGroup.remove(obj);
        }

        const { width, height, depth, wallThickness } = this.boxDimensions;

        // Box Materials
        let boxMaterial, dividerMaterial;

        if (this.boxType === 'clear') {
            // High quality translucent acrylic material
            boxMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xf0fdf4,
                transparent: true,
                opacity: 0.55,
                roughness: 0.08,
                metalness: 0.05,
                transmission: 0.82,
                ior: 1.48,
                reflectivity: 0.6,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                side: THREE.DoubleSide
            });

            dividerMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x22c55e,
                transparent: true,
                opacity: 0.65,
                roughness: 0.2,
                transmission: 0.5,
                side: THREE.DoubleSide
            });
        } else {
            // Premium Bamboo / Natural Wood Bento
            boxMaterial = new THREE.MeshStandardMaterial({
                color: 0xd97706,
                roughness: 0.65,
                metalness: 0.05,
                side: THREE.DoubleSide
            });

            dividerMaterial = new THREE.MeshStandardMaterial({
                color: 0xb45309,
                roughness: 0.6,
                side: THREE.DoubleSide
            });
        }

        // Bottom Plate
        const bottomGeo = new THREE.BoxGeometry(width, wallThickness, depth);
        const bottom = new THREE.Mesh(bottomGeo, boxMaterial);
        bottom.position.set(0, wallThickness / 2, 0);
        bottom.receiveShadow = true;
        this.boxGroup.add(bottom);

        // Front & Back Long Walls
        const frontWallGeo = new THREE.BoxGeometry(width, height, wallThickness);
        const frontWall = new THREE.Mesh(frontWallGeo, boxMaterial);
        frontWall.position.set(0, height / 2, depth / 2 - wallThickness / 2);
        frontWall.castShadow = true;
        frontWall.receiveShadow = true;
        this.boxGroup.add(frontWall);

        const backWall = frontWall.clone();
        backWall.position.set(0, height / 2, -depth / 2 + wallThickness / 2);
        this.boxGroup.add(backWall);

        // Left & Right Short Walls
        const sideWallGeo = new THREE.BoxGeometry(wallThickness, height, depth - wallThickness * 2);
        const leftWall = new THREE.Mesh(sideWallGeo, boxMaterial);
        leftWall.position.set(-width / 2 + wallThickness / 2, height / 2, 0);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        this.boxGroup.add(leftWall);

        const rightWall = leftWall.clone();
        rightWall.position.set(width / 2 - wallThickness / 2, height / 2, 0);
        this.boxGroup.add(rightWall);

        // Inner Dividers (Compartments)
        if (this.compartments === 2) {
            // 1 divider in the middle
            const divGeo = new THREE.BoxGeometry(wallThickness * 0.8, height * 0.9, depth - wallThickness * 2);
            const div = new THREE.Mesh(divGeo, dividerMaterial);
            div.position.set(0, height * 0.45 + wallThickness, 0);
            div.castShadow = true;
            this.boxGroup.add(div);
        } else if (this.compartments === 3) {
            // 2 dividers creating 3 compartments: Left, Center, Right
            const divGeo = new THREE.BoxGeometry(wallThickness * 0.8, height * 0.9, depth - wallThickness * 2);
            const div1 = new THREE.Mesh(divGeo, dividerMaterial);
            div1.position.set(-width / 6, height * 0.45 + wallThickness, 0);
            div1.castShadow = true;
            this.boxGroup.add(div1);

            const div2 = div1.clone();
            div2.position.set(width / 6, height * 0.45 + wallThickness, 0);
            this.boxGroup.add(div2);
        } else if (this.compartments === 4) {
            // 4 quadrant compartments (cross divider)
            const divGeoX = new THREE.BoxGeometry(wallThickness * 0.8, height * 0.9, depth - wallThickness * 2);
            const divX = new THREE.Mesh(divGeoX, dividerMaterial);
            divX.position.set(0, height * 0.45 + wallThickness, 0);
            this.boxGroup.add(divX);

            const divGeoZ = new THREE.BoxGeometry(width - wallThickness * 2, height * 0.9, wallThickness * 0.8);
            const divZ = new THREE.Mesh(divGeoZ, dividerMaterial);
            divZ.position.set(0, height * 0.45 + wallThickness, 0);
            this.boxGroup.add(divZ);
        }

        // Build Lid
        this.buildBoxLid(boxMaterial);
    }

    buildBoxLid(material) {
        while (this.lidGroup.children.length > 0) {
            this.lidGroup.remove(this.lidGroup.children[0]);
        }

        const { width, depth, wallThickness } = this.boxDimensions;
        const lidMaterial = material.clone();
        lidMaterial.opacity = 0.45;

        // Lid Top Plate
        const lidPlateGeo = new THREE.BoxGeometry(width + 0.3, wallThickness * 0.8, depth + 0.3);
        const lidPlate = new THREE.Mesh(lidPlateGeo, lidMaterial);
        lidPlate.castShadow = true;
        this.lidGroup.add(lidPlate);

        // Logo Sticker on Lid
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.roundRect(20, 20, 472, 216, 30);
        ctx.fill();
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#1E7B34';
        ctx.stroke();

        ctx.fillStyle = '#1E7B34';
        ctx.font = 'bold 75px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Ngoăn 🍉', 256, 120);

        ctx.fillStyle = '#FF9F1C';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('TRÁI CÂY GỌT SẴN', 256, 180);

        const stickerTexture = new THREE.CanvasTexture(canvas);
        const stickerGeo = new THREE.PlaneGeometry(5, 2.5);
        const stickerMat = new THREE.MeshBasicMaterial({
            map: stickerTexture,
            transparent: true,
            roughness: 0.3
        });
        const sticker = new THREE.Mesh(stickerGeo, stickerMat);
        sticker.rotation.x = -Math.PI / 2;
        sticker.position.y = wallThickness * 0.45;
        this.lidGroup.add(sticker);

        // Initial Lid Position (Open angled or closed)
        this.updateLidPosition();
    }

    updateLidPosition() {
        const { height, depth } = this.boxDimensions;
        if (this.isLidOpen) {
            // Angled open standing behind the box
            this.lidGroup.position.set(0, height * 0.8, -depth / 2 - 1.8);
            this.lidGroup.rotation.set(-Math.PI / 2.6, 0, 0);
        } else {
            // Snapped closed on top of the box
            this.lidGroup.position.set(0, height + 0.2, 0);
            this.lidGroup.rotation.set(0, 0, 0);
        }
    }

    toggleLid() {
        this.isLidOpen = !this.isLidOpen;
        this.updateLidPosition();
        if (window.ngoanSound) window.ngoanSound.playPop();
        return this.isLidOpen;
    }

    setBoxType(type) {
        this.boxType = type;
        this.buildRectangularBox();
        if (window.ngoanSound) window.ngoanSound.playPop();
    }

    setCompartments(num) {
        this.compartments = num;
        this.buildRectangularBox();
        this.rearrangeFruitsInBox();
        if (window.ngoanSound) window.ngoanSound.playPop();
    }

    // --- Procedural 3D Fruit Model Creators ---

    createWatermelonPiece() {
        const group = new THREE.Group();
        // Red juicy flesh
        const fleshGeo = new THREE.BoxGeometry(1.3, 1.1, 1.3);
        const fleshMat = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            roughness: 0.35,
            metalness: 0.05
        });
        const flesh = new THREE.Mesh(fleshGeo, fleshMat);
        flesh.castShadow = true;
        group.add(flesh);

        // Dark seeds
        const seedGeo = new THREE.SphereGeometry(0.08, 6, 6);
        const seedMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 });
        const s1 = new THREE.Mesh(seedGeo, seedMat);
        s1.position.set(0.4, 0.2, 0.66);
        group.add(s1);

        const s2 = s1.clone();
        s2.position.set(-0.35, -0.2, 0.66);
        group.add(s2);

        group.userData = { type: 'watermelon', name: 'Dưa Hấu Long An' };
        return group;
    }

    createMangoPiece() {
        const group = new THREE.Group();
        const geo = new THREE.CylinderGeometry(0.7, 0.65, 1.1, 8);
        const mat = new THREE.MeshStandardMaterial({
            color: 0xfbbf24,
            roughness: 0.25,
            metalness: 0.1
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 4;
        mesh.castShadow = true;
        group.add(mesh);
        group.userData = { type: 'mango', name: 'Xoài Cát Hòa Lộc' };
        return group;
    }

    createKiwiPiece() {
        const group = new THREE.Group();
        // Wheel slice
        const geo = new THREE.CylinderGeometry(0.85, 0.85, 0.45, 16);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x65a30d,
            roughness: 0.4
        });
        const slice = new THREE.Mesh(geo, mat);
        slice.rotation.z = Math.PI / 2;
        slice.castShadow = true;
        group.add(slice);

        // Pale core
        const coreGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.48, 12);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0xd9f99d });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.rotation.z = Math.PI / 2;
        group.add(core);

        group.userData = { type: 'kiwi', name: 'Kiwi New Zealand' };
        return group;
    }

    createStrawberryPiece() {
        const group = new THREE.Group();
        // Cone heart
        const geo = new THREE.ConeGeometry(0.7, 1.3, 14);
        const mat = new THREE.MeshStandardMaterial({
            color: 0xdc2626,
            roughness: 0.35
        });
        const berry = new THREE.Mesh(geo, mat);
        berry.rotation.x = Math.PI;
        berry.castShadow = true;
        group.add(berry);

        // Green leaves
        const leafGeo = new THREE.ConeGeometry(0.65, 0.2, 5);
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a });
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.y = 0.65;
        group.add(leaf);

        group.userData = { type: 'strawberry', name: 'Dâu Tây Đà Lạt' };
        return group;
    }

    createGrapeCluster() {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({
            color: 0x581c87,
            roughness: 0.2,
            metalness: 0.15
        });
        const geo = new THREE.SphereGeometry(0.48, 12, 12);

        const positions = [
            [0, 0, 0],
            [0.5, 0.3, 0.2],
            [-0.45, 0.2, -0.2],
            [0.1, -0.35, 0.35],
            [-0.2, -0.3, -0.3]
        ];

        positions.forEach(pos => {
            const grape = new THREE.Mesh(geo, mat);
            grape.position.set(pos[0], pos[1], pos[2]);
            grape.scale.set(0.9, 1.25, 0.9); // oblong grapes
            grape.castShadow = true;
            group.add(grape);
        });

        group.userData = { type: 'grape', name: 'Nho Đen Móng Tay' };
        return group;
    }

    createGuavaPiece() {
        const group = new THREE.Group();
        const geo = new THREE.CylinderGeometry(0.75, 0.5, 1.2, 8);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x86efac,
            roughness: 0.4
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.z = Math.PI / 3;
        mesh.castShadow = true;
        group.add(mesh);
        group.userData = { type: 'guava', name: 'Ổi Nữ Hoàng' };
        return group;
    }

    createPineapplePiece() {
        const group = new THREE.Group();
        const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        const mat = new THREE.MeshStandardMaterial({
            color: 0xfcd34d,
            roughness: 0.45
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.y = Math.PI / 4;
        mesh.castShadow = true;
        group.add(mesh);
        group.userData = { type: 'pineapple', name: 'Dứa Mật MD2' };
        return group;
    }

    createDragonfruitPiece() {
        const group = new THREE.Group();
        const geo = new THREE.BoxGeometry(1.15, 1.15, 1.15);
        const mat = new THREE.MeshStandardMaterial({
            color: 0xf43f5e,
            roughness: 0.3
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        group.add(mesh);
        group.userData = { type: 'dragonfruit', name: 'Thanh Long Đỏ' };
        return group;
    }

    createSaltCup(saltName = 'Muối Tôm Tây Ninh') {
        const group = new THREE.Group();
        // Ceramic dipping cup
        const cupGeo = new THREE.CylinderGeometry(1.1, 0.9, 1.2, 18);
        const cupMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2
        });
        const cup = new THREE.Mesh(cupGeo, cupMat);
        cup.castShadow = true;
        group.add(cup);

        // Salt filling inside
        const saltGeo = new THREE.CylinderGeometry(0.98, 0.98, 0.3, 16);
        const saltColor = saltName.includes('Xí Muội') ? 0xf472b6 : 0xea580c;
        const saltMat = new THREE.MeshStandardMaterial({
            color: saltColor,
            roughness: 0.95
        });
        const salt = new THREE.Mesh(saltGeo, saltMat);
        salt.position.y = 0.5;
        group.add(salt);

        group.userData = { type: 'salt', name: saltName };
        return group;
    }

    // --- Add Fruit to 3D Box ---

    addFruit(fruitType, compartmentIndex = null) {
        let fruitMesh = null;
        switch (fruitType) {
            case 'watermelon': fruitMesh = this.createWatermelonPiece(); break;
            case 'mango': fruitMesh = this.createMangoPiece(); break;
            case 'kiwi': fruitMesh = this.createKiwiPiece(); break;
            case 'strawberry': fruitMesh = this.createStrawberryPiece(); break;
            case 'grape': fruitMesh = this.createGrapeCluster(); break;
            case 'guava': fruitMesh = this.createGuavaPiece(); break;
            case 'pineapple': fruitMesh = this.createPineapplePiece(); break;
            case 'dragonfruit': fruitMesh = this.createDragonfruitPiece(); break;
            case 'salt': fruitMesh = this.createSaltCup(); break;
            default: fruitMesh = this.createWatermelonPiece(); break;
        }

        const slot = this.calculateSlotPosition(this.activeFruits.length, compartmentIndex);
        const startY = 14 + Math.random() * 3;

        fruitMesh.position.set(slot.x, startY, slot.z);
        fruitMesh.rotation.set(
            (Math.random() - 0.5) * 0.4,
            Math.random() * Math.PI * 2,
            (Math.random() - 0.5) * 0.4
        );

        this.fruitsGroup.add(fruitMesh);

        // Drop animation physics
        this.animatingFruits.push({
            mesh: fruitMesh,
            targetY: slot.y,
            vy: 0,
            gravity: -0.045,
            bounce: 0.38,
            bouncesCount: 0
        });

        this.activeFruits.push({
            type: fruitType,
            mesh: fruitMesh
        });

        if (window.ngoanSound) {
            window.ngoanSound.playCrunch();
        }

        return fruitMesh;
    }

    removeFruit(index) {
        if (index < 0 || index >= this.activeFruits.length) return;
        const item = this.activeFruits.splice(index, 1)[0];
        if (item && item.mesh) {
            this.fruitsGroup.remove(item.mesh);
        }
        this.rearrangeFruitsInBox();
        if (window.ngoanSound) window.ngoanSound.playPop();
    }

    clearBox() {
        while (this.fruitsGroup.children.length > 0) {
            this.fruitsGroup.remove(this.fruitsGroup.children[0]);
        }
        this.activeFruits = [];
        this.animatingFruits = [];
        if (window.ngoanSound) window.ngoanSound.playPop();
    }

    calculateSlotPosition(index, forcedCompartment = null) {
        const { width, depth, height } = this.boxDimensions;
        const effectiveWidth = width - 1.6;
        const effectiveDepth = depth - 1.6;

        let comp = forcedCompartment;
        if (comp === null || comp === undefined) {
            comp = index % this.compartments;
        }

        let centerX = 0;
        let compWidth = effectiveWidth;

        if (this.compartments === 2) {
            compWidth = effectiveWidth / 2;
            centerX = comp === 0 ? -compWidth / 2 : compWidth / 2;
        } else if (this.compartments === 3) {
            compWidth = effectiveWidth / 3;
            if (comp === 0) centerX = -compWidth;
            else if (comp === 1) centerX = 0;
            else centerX = compWidth;
        } else if (this.compartments === 4) {
            compWidth = effectiveWidth / 2;
            const compDepth = effectiveDepth / 2;
            const col = comp % 2;
            const row = Math.floor(comp / 2);
            centerX = col === 0 ? -compWidth / 2 : compWidth / 2;
            const centerZ = row === 0 ? -compDepth / 2 : compDepth / 2;

            return {
                x: centerX + (Math.random() - 0.5) * 0.8,
                y: 1.2 + Math.floor(index / 4) * 0.9,
                z: centerZ + (Math.random() - 0.5) * 0.8
            };
        }

        // Row positioning inside compartment
        const subIndex = Math.floor(index / this.compartments);
        const rowZ = (subIndex % 3 - 1) * (effectiveDepth / 3.4);
        const layerY = 1.0 + Math.floor(subIndex / 3) * 0.95;

        return {
            x: centerX + (Math.random() - 0.5) * 0.6,
            y: Math.min(layerY, height - 0.5),
            z: rowZ + (Math.random() - 0.5) * 0.5
        };
    }

    rearrangeFruitsInBox() {
        this.activeFruits.forEach((item, idx) => {
            const slot = this.calculateSlotPosition(idx);
            item.mesh.position.set(slot.x, slot.y, slot.z);
        });
    }

    // Camera Views
    setCameraView(viewName) {
        if (!this.controls) return;
        switch (viewName) {
            case 'top':
                this.camera.position.set(0, 24, 0.1);
                this.controls.target.set(0, 1.5, 0);
                break;
            case 'angle':
                this.camera.position.set(0, 15, 18);
                this.controls.target.set(0, 1.5, 0);
                break;
            case 'front':
                this.camera.position.set(0, 4, 18);
                this.controls.target.set(0, 2, 0);
                break;
        }
        this.controls.update();
        if (window.ngoanSound) window.ngoanSound.playPop();
    }

    toggleAutoRotate() {
        this.isAutoRotate = !this.isAutoRotate;
        if (this.controls) {
            this.controls.autoRotate = this.isAutoRotate;
            this.controls.autoRotateSpeed = 2.0;
        }
        return this.isAutoRotate;
    }

    onCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.fruitsGroup.children, true);

        if (intersects.length > 0) {
            // Find root fruit group
            let root = intersects[0].object;
            while (root.parent && root.parent !== this.fruitsGroup) {
                root = root.parent;
            }

            const foundIdx = this.activeFruits.findIndex(f => f.mesh === root);
            if (foundIdx > -1) {
                const fruit = this.activeFruits[foundIdx];
                // Pop animation on click
                root.scale.set(1.3, 1.3, 1.3);
                setTimeout(() => root.scale.set(1, 1, 1), 200);

                if (window.ngoanSound) window.ngoanSound.playCrunch();
            }
        }
    }

    onResize() {
        if (!this.canvas || !this.renderer || !this.camera) return;
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate);

        // Update physics for falling fruits
        for (let i = this.animatingFruits.length - 1; i >= 0; i--) {
            const anim = this.animatingFruits[i];
            anim.vy += anim.gravity;
            anim.mesh.position.y += anim.vy;

            if (anim.mesh.position.y <= anim.targetY) {
                anim.mesh.position.y = anim.targetY;
                if (anim.bouncesCount < 2) {
                    anim.vy = -anim.vy * anim.bounce;
                    anim.bouncesCount++;
                } else {
                    anim.vy = 0;
                    this.animatingFruits.splice(i, 1);
                }
            }
        }

        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.FruitBox3D = FruitBox3D;
