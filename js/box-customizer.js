/**
 * Ngoăn - Trái Cây Gọt Sẵn: 3D Rectangular Fruit Box Customizer Controller
 * Connects UI buttons with Three.js 3D Fruit Box Studio
 */

const BOX_PRESETS = {
    comp2: { name: 'Hộp Chữ Nhật 2 Ngăn (500g)', compartments: 2, basePrice: 55000, tag: 'Gọn nhẹ ăn đôi' },
    comp3: { name: 'Hộp Chữ Nhật 3 Ngăn (700g)', compartments: 3, basePrice: 75000, tag: 'Được đặt nhiều nhất' },
    comp4: { name: 'Hộp Chữ Nhật 4 Ngăn VIP (1000g)', compartments: 4, basePrice: 110000, tag: 'Tiệc họp & Văn phòng' }
};

const FRUIT_PRICES = {
    watermelon: { name: 'Dưa Hấu Long An', extra: 0, icon: '🍉', cal: 30 },
    mango: { name: 'Xoài Cát Hòa Lộc', extra: 0, icon: '🥭', cal: 50 },
    kiwi: { name: 'Kiwi New Zealand', extra: 8000, icon: '🥝', cal: 40 },
    strawberry: { name: 'Dâu Tây Đà Lạt', extra: 10000, icon: '🍓', cal: 35 },
    grape: { name: 'Nho Đen Móng Tay', extra: 10000, icon: '🍇', cal: 55 },
    guava: { name: 'Ổi Nữ Hoàng', extra: 0, icon: '🍐', cal: 30 },
    pineapple: { name: 'Dứa Mật MD2', extra: 0, icon: '🍍', cal: 40 },
    dragonfruit: { name: 'Thanh Long Đỏ', extra: 0, icon: '🌺', cal: 35 }
};

class BoxCustomizerController {
    constructor() {
        this.studio = null;
        this.currentBoxKey = 'comp3';
        this.boxType = 'clear'; // 'clear' or 'wood'
        this.selectedSalt = 'Muối Tôm Tây Ninh';
        this.hasSaltInBox = false;

        this.init();
    }

    init() {
        // Initialize Three.js 3D Studio
        if (window.FruitBox3D) {
            this.studio = new window.FruitBox3D('box3DCanvas');
        }

        this.renderBoxTypeSelector();
        this.renderCompartmentSelector();
        this.renderFruitButtons();
        this.bindStudioControls();
        this.populateDefaultBox();
        this.updateStats();
    }

    populateDefaultBox() {
        if (!this.studio) return;
        // Default delicious mix in 3 compartments
        setTimeout(() => {
            this.studio.addFruit('watermelon', 0);
            this.studio.addFruit('watermelon', 0);
            this.studio.addFruit('mango', 1);
            this.studio.addFruit('mango', 1);
            this.studio.addFruit('kiwi', 2);
            this.studio.addFruit('strawberry', 2);
            this.studio.addFruit('salt', 1);
            this.hasSaltInBox = true;
            this.updateStats();
        }, 300);
    }

    renderBoxTypeSelector() {
        const clearBtn = document.getElementById('boxTypeClearBtn');
        const woodBtn = document.getElementById('boxTypeWoodBtn');

        if (clearBtn && woodBtn) {
            clearBtn.addEventListener('click', () => {
                this.boxType = 'clear';
                clearBtn.classList.add('active');
                woodBtn.classList.remove('active');
                if (this.studio) this.studio.setBoxType('clear');
            });

            woodBtn.addEventListener('click', () => {
                this.boxType = 'wood';
                woodBtn.classList.add('active');
                clearBtn.classList.remove('active');
                if (this.studio) this.studio.setBoxType('wood');
            });
        }
    }

    renderCompartmentSelector() {
        const container = document.getElementById('boxCompartmentOptions');
        if (!container) return;

        container.innerHTML = Object.entries(BOX_PRESETS).map(([key, preset]) => `
            <div class="box-preset-chip ${key === this.currentBoxKey ? 'active' : ''}" data-key="${key}">
                <div class="preset-tag">${preset.tag}</div>
                <div class="preset-name">${preset.name}</div>
                <div class="preset-price">${preset.basePrice.toLocaleString('vi-VN')}đ</div>
            </div>
        `).join('');

        container.querySelectorAll('.box-preset-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                this.currentBoxKey = chip.dataset.key;
                container.querySelectorAll('.box-preset-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const preset = BOX_PRESETS[this.currentBoxKey];
                if (this.studio) {
                    this.studio.setCompartments(preset.compartments);
                }
                this.updateStats();
            });
        });
    }

    renderFruitButtons() {
        const container = document.getElementById('boxFruitPickList');
        if (!container) return;

        container.innerHTML = Object.entries(FRUIT_PRICES).map(([type, fruit]) => `
            <button class="fruit-3d-pick-btn" data-fruit="${type}">
                <span class="f-icon">${fruit.icon}</span>
                <span class="f-name">${fruit.name}</span>
                <span class="f-badge">${fruit.extra > 0 ? `+${fruit.extra / 1000}k` : 'Tươi'}</span>
                <span class="f-add-icon">+ Xếp vào</span>
            </button>
        `).join('');

        container.querySelectorAll('.fruit-3d-pick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const fruitType = btn.dataset.fruit;
                if (this.studio) {
                    if (this.studio.activeFruits.length >= 18) {
                        alert('Hộp chữ nhật đã đầy ắp trái cây tươi rồi bạn ơi! Bấm "Đưa Hộp Vào Giỏ" nhé.');
                        return;
                    }
                    this.studio.addFruit(fruitType);
                    this.updateStats();
                }
            });
        });

        // Add Salt Dish Button
        const addSaltBtn = document.getElementById('addSaltToBoxBtn');
        if (addSaltBtn) {
            addSaltBtn.addEventListener('click', () => {
                if (this.studio) {
                    if (this.hasSaltInBox) {
                        alert('Hộp đã có 1 chén muối chấm hảo hạng rồi nhé!');
                        return;
                    }
                    this.studio.addFruit('salt');
                    this.hasSaltInBox = true;
                    this.updateStats();
                }
            });
        }

        // Clear Box Button
        const clearBtn = document.getElementById('clearBoxFruitsBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (this.studio) {
                    this.studio.clearBox();
                    this.hasSaltInBox = false;
                    this.updateStats();
                }
            });
        }

        // Auto Fill Best Seller
        const autoFillBtn = document.getElementById('autoFillBoxBtn');
        if (autoFillBtn) {
            autoFillBtn.addEventListener('click', () => {
                if (this.studio) {
                    this.studio.clearBox();
                    this.hasSaltInBox = false;
                    const fruits = ['watermelon', 'mango', 'kiwi', 'strawberry', 'grape', 'guava', 'pineapple'];
                    fruits.forEach((f, idx) => {
                        this.studio.addFruit(f);
                        this.studio.addFruit(f);
                    });
                    this.studio.addFruit('salt');
                    this.hasSaltInBox = true;
                    this.updateStats();
                }
            });
        }
    }

    bindStudioControls() {
        // Toggle Lid
        const lidBtn = document.getElementById('toggleBoxLidBtn');
        if (lidBtn) {
            lidBtn.addEventListener('click', () => {
                if (this.studio) {
                    const isOpen = this.studio.toggleLid();
                    lidBtn.innerHTML = isOpen ? '<span>📦 Đóng Nắp Hộp</span>' : '<span>✨ Mở Nắp Hộp</span>';
                }
            });
        }

        // Auto Rotate
        const rotateBtn = document.getElementById('toggleAutoRotateBtn');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                if (this.studio) {
                    const isRotating = this.studio.toggleAutoRotate();
                    rotateBtn.classList.toggle('active', isRotating);
                    rotateBtn.innerHTML = isRotating ? '<span>⏸ Dừng Xoay</span>' : '<span>🔄 Xoay 360°</span>';
                }
            });
        }

        // Camera Views
        const viewAngleBtn = document.getElementById('viewAngleBtn');
        const viewTopBtn = document.getElementById('viewTopBtn');
        const viewFrontBtn = document.getElementById('viewFrontBtn');

        if (viewAngleBtn) viewAngleBtn.addEventListener('click', () => this.studio && this.studio.setCameraView('angle'));
        if (viewTopBtn) viewTopBtn.addEventListener('click', () => this.studio && this.studio.setCameraView('top'));
        if (viewFrontBtn) viewFrontBtn.addEventListener('click', () => this.studio && this.studio.setCameraView('front'));

        // Add to Cart
        const addToCartBtn = document.getElementById('add3DBoxToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                if (!this.studio || this.studio.activeFruits.length === 0) {
                    alert('Hãy xếp ít nhất một vài loại trái cây vào hộp chữ nhật trước nhé!');
                    return;
                }

                const preset = BOX_PRESETS[this.currentBoxKey];
                const fruitCounts = {};
                this.studio.activeFruits.forEach(f => {
                    const name = f.type === 'salt' ? 'Chén Muối Chấm' : (FRUIT_PRICES[f.type] ? FRUIT_PRICES[f.type].name : f.type);
                    fruitCounts[name] = (fruitCounts[name] || 0) + 1;
                });

                const descStr = Object.entries(fruitCounts).map(([name, count]) => `${name} (${count} phần)`).join(', ');

                const customBoxItem = {
                    id: 'box3d-' + Date.now(),
                    name: `${preset.name} [Gọt Xếp 3D]`,
                    description: `Kiểu hộp: ${this.boxType === 'clear' ? 'Acrylic Trong Suốt' : 'Bento Gỗ Tre'}. Thành phần: ${descStr}`,
                    price: this.calculateTotal(),
                    quantity: 1,
                    image: 'assets/single_fruit_boxes.jpg',
                    isCustom: true
                };

                if (window.cartManager) {
                    window.cartManager.addItem(customBoxItem);
                }

                if (window.animateFlyToCart) {
                    window.animateFlyToCart(addToCartBtn);
                }

                if (window.ngoanSound) {
                    window.ngoanSound.playSuccess();
                }
            });
        }
    }

    calculateTotal() {
        const base = BOX_PRESETS[this.currentBoxKey].basePrice;
        let extra = 0;
        if (this.studio) {
            this.studio.activeFruits.forEach(f => {
                if (FRUIT_PRICES[f.type]) {
                    extra += FRUIT_PRICES[f.type].extra;
                }
            });
        }
        return base + extra;
    }

    updateStats() {
        const countEl = document.getElementById('boxFruitPieceCount');
        const priceEl = document.getElementById('box3DTotalPrice');
        const activeListEl = document.getElementById('boxActiveFruitChips');

        const totalPieces = this.studio ? this.studio.activeFruits.length : 0;
        if (countEl) countEl.innerText = `${totalPieces} miếng quả trong hộp`;

        const total = this.calculateTotal();
        if (priceEl) priceEl.innerText = `${total.toLocaleString('vi-VN')}đ`;

        // Render mini summary chips
        if (activeListEl && this.studio) {
            if (this.studio.activeFruits.length === 0) {
                activeListEl.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">Hộp chữ nhật đang trống. Bấm chọn trái cây bên phải để thả vào hộp!</span>`;
            } else {
                const countMap = {};
                this.studio.activeFruits.forEach(f => {
                    countMap[f.type] = (countMap[f.type] || 0) + 1;
                });

                activeListEl.innerHTML = Object.entries(countMap).map(([type, count]) => {
                    const icon = type === 'salt' ? '🧂' : (FRUIT_PRICES[type] ? FRUIT_PRICES[type].icon : '🍉');
                    const name = type === 'salt' ? 'Chén Muối' : (FRUIT_PRICES[type] ? FRUIT_PRICES[type].name : type);
                    return `
                        <div class="active-mini-chip">
                            <span>${icon} ${name}</span>
                            <span class="count-tag">x${count}</span>
                        </div>
                    `;
                }).join('');
            }
        }
    }
}

window.BoxCustomizerController = BoxCustomizerController;
