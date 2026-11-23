/**
 * Ngoăn - Trái Cây Gọt Sẵn: Interactive Cup & Box DIY Builder
 * Based on official Ngoăn Flyer:
 * Sizes: Nhỏ (25k), Vừa (35k), Lớn (39k), Đặc biệt (49k)
 * Toppings (+5k): Muối ớt, Xoài lắc, Tắc, Sữa chua, Granola
 */

const CUP_SIZES = {
    S: { name: 'Size Nhỏ (1-2 loại quả)', maxFruits: 2, basePrice: 25000, calories: 110, tag: 'Gọn nhẹ ăn liền' },
    M: { name: 'Size Vừa (3 loại quả)', maxFruits: 3, basePrice: 35000, calories: 175, tag: 'Bán chạy nhất' },
    L: { name: 'Size Lớn (4 loại quả)', maxFruits: 4, basePrice: 39000, calories: 230, tag: 'Đầy đặn no nê' },
    XL: { name: 'Size Đặc Biệt (5+ loại)', maxFruits: 6, basePrice: 49000, calories: 310, tag: 'Thỏa thích vị ngon' }
};

const AVAILABLE_FRUITS = [
    { id: 'watermelon', name: 'Dưa Hấu Long An', color: '#EF4444', icon: '🍉', extra: 0, cal: 30, vitC: '15%' },
    { id: 'mango', name: 'Xoài Cát Hòa Lộc', color: '#FBBF24', icon: '🥭', extra: 0, cal: 50, vitC: '35%' },
    { id: 'guava', name: 'Ổi Nữ Hoàng Giòn', color: '#86EFAC', icon: '🍐', extra: 0, cal: 30, vitC: '80%' },
    { id: 'pineapple', name: 'Dứa Mật MD2', color: '#FCD34D', icon: '🍍', extra: 0, cal: 40, vitC: '40%' },
    { id: 'dragonfruit', name: 'Thanh Long Đỏ', color: '#F43F5E', icon: '🌺', extra: 0, cal: 35, vitC: '20%' },
    { id: 'grape', name: 'Nho Đen Móng Tay', color: '#7E22CE', icon: '🍇', extra: 0, cal: 50, vitC: '10%' },
    { id: 'strawberry', name: 'Dâu Tây Đà Lạt', color: '#DC2626', icon: '🍓', extra: 5000, cal: 32, vitC: '50%' },
    { id: 'kiwi', name: 'Kiwi Xanh New Zealand', color: '#65A30D', icon: '🥝', extra: 5000, cal: 40, vitC: '65%' },
    { id: 'pomelo', name: 'Bưởi Da Xanh Tép Hồng', color: '#FB7185', icon: '🍊', extra: 0, cal: 38, vitC: '45%' },
    { id: 'apple', name: 'Táo Giòn Ngọt', color: '#F87171', icon: '🍎', extra: 0, cal: 45, vitC: '15%' },
    { id: 'pear', name: 'Lê Hàn Quốc Mọng Nước', color: '#FEF08A', icon: '🍐', extra: 0, cal: 40, vitC: '15%' }
];

const AVAILABLE_TOPPINGS = [
    { id: 'top_salt', name: 'Muối ớt Tây Ninh', price: 0, icon: '🧂', desc: 'Tặng kèm miễn phí' },
    { id: 'top_lac', name: 'Lắc Muối Ớt Cay', price: 5000, icon: '🌶️', desc: '+5K lắc đều thấm vị' },
    { id: 'top_tac', name: 'Thêm Tắc (Quất)', price: 5000, icon: '🍋', desc: '+5K chua thanh kích vị' },
    { id: 'top_yogurt', name: 'Sữa Chua Dầm', price: 5000, icon: '🥣', desc: '+5K béo ngậy thanh mát' },
    { id: 'top_granola', name: 'Hạt Granola Giòn', price: 5000, icon: '🌾', desc: '+5K bùi bùi giòn rụm' }
];

class CupBuilder {
    constructor() {
        this.selectedSize = 'M';
        this.selectedFruits = ['watermelon', 'mango', 'guava'];
        this.selectedToppings = ['top_salt'];

        this.init();
    }

    init() {
        this.renderSizeOptions();
        this.renderFruitOptions();
        this.renderToppingOptions();
        this.updateCupVisual();
        this.bindEvents();
    }

    renderSizeOptions() {
        const container = document.getElementById('builderSizeOptions');
        if (!container) return;

        container.innerHTML = Object.entries(CUP_SIZES).map(([key, size]) => `
            <div class="size-card ${key === this.selectedSize ? 'active' : ''}" data-size="${key}">
                <div class="size-badge">${size.tag}</div>
                <div class="size-title">${size.name}</div>
                <div class="size-info">Tối đa ${size.maxFruits} loại trái cây</div>
                <div class="size-price">${size.basePrice.toLocaleString('vi-VN')}đ</div>
            </div>
        `).join('');

        container.querySelectorAll('.size-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectedSize = card.dataset.size;
                const max = CUP_SIZES[this.selectedSize].maxFruits;
                if (this.selectedFruits.length > max) {
                    this.selectedFruits = this.selectedFruits.slice(0, max);
                }
                this.renderSizeOptions();
                this.renderFruitOptions();
                this.updateCupVisual();
                if (window.ngoanSound) window.ngoanSound.playPop();
            });
        });
    }

    renderFruitOptions() {
        const container = document.getElementById('builderFruitOptions');
        if (!container) return;

        const maxFruits = CUP_SIZES[this.selectedSize].maxFruits;

        container.innerHTML = AVAILABLE_FRUITS.map(fruit => {
            const isSelected = this.selectedFruits.includes(fruit.id);
            const extraTag = fruit.extra > 0 ? `+${(fruit.extra / 1000)}k` : 'Chuẩn vị';

            return `
                <div class="fruit-chip ${isSelected ? 'selected' : ''}" data-id="${fruit.id}">
                    <span class="fruit-icon">${fruit.icon}</span>
                    <div class="fruit-details">
                        <span class="fruit-name">${fruit.name}</span>
                        <span class="fruit-meta">${fruit.vitC} Vit C • ${extraTag}</span>
                    </div>
                    <div class="fruit-check-indicator">
                        ${isSelected ? '✓' : '+'}
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.fruit-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const id = chip.dataset.id;
                const index = this.selectedFruits.indexOf(id);

                if (index > -1) {
                    if (this.selectedFruits.length > 1) {
                        this.selectedFruits.splice(index, 1);
                        if (window.ngoanSound) window.ngoanSound.playPop();
                    } else {
                        alert('Hãy giữ lại ít nhất 1 loại quả cho ly Ngoăn nhé!');
                    }
                } else {
                    if (this.selectedFruits.length < maxFruits) {
                        this.selectedFruits.push(id);
                        if (window.ngoanSound) window.ngoanSound.playCrunch();
                    } else {
                        alert(`Size này chọn tối đa ${maxFruits} loại quả rồi bạn ơi! Đổi sang Size lớn hơn hoặc bỏ bớt 1 quả nhé.`);
                        return;
                    }
                }
                this.renderFruitOptions();
                this.updateCupVisual();
            });
        });
    }

    renderToppingOptions() {
        const container = document.getElementById('builderSaltOptions');
        if (!container) return;

        container.innerHTML = AVAILABLE_TOPPINGS.map(top => {
            const isSelected = this.selectedToppings.includes(top.id);
            return `
                <div class="salt-option-card ${isSelected ? 'active' : ''}" data-id="${top.id}">
                    <div class="salt-header">
                        <span class="salt-name">${top.icon} ${top.name}</span>
                        <span class="salt-spice" style="font-size: 0.8rem; font-weight: 800; color: ${top.price > 0 ? '#EF4444' : '#22C55E'};">
                            ${top.price > 0 ? `+${top.price/1000}K` : 'FREE'}
                        </span>
                    </div>
                    <div class="salt-desc">${top.desc}</div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.salt-option-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const idx = this.selectedToppings.indexOf(id);
                if (idx > -1) {
                    // Cannot remove base free salt if only one
                    if (this.selectedToppings.length > 1 || id !== 'top_salt') {
                        this.selectedToppings.splice(idx, 1);
                    }
                } else {
                    this.selectedToppings.push(id);
                }
                this.renderToppingOptions();
                this.updateCupVisual();
                if (window.ngoanSound) window.ngoanSound.playPop();
            });
        });
    }

    calculateTotal() {
        const base = CUP_SIZES[this.selectedSize].basePrice;
        let fruitExtra = 0;
        this.selectedFruits.forEach(fid => {
            const fruit = AVAILABLE_FRUITS.find(f => f.id === fid);
            if (fruit) fruitExtra += fruit.extra;
        });

        let topExtra = 0;
        this.selectedToppings.forEach(tid => {
            const top = AVAILABLE_TOPPINGS.find(t => t.id === tid);
            if (top) topExtra += top.price;
        });

        return base + fruitExtra + topExtra;
    }

    updateCupVisual() {
        const cupDisplay = document.getElementById('cupFruitLayers');
        const countBadge = document.getElementById('builderFruitCountBadge');
        const totalPriceEl = document.getElementById('builderTotalPrice');
        const totalCaloriesEl = document.getElementById('builderTotalCalories');
        const maxFruits = CUP_SIZES[this.selectedSize].maxFruits;

        if (countBadge) {
            countBadge.innerText = `Đã chọn: ${this.selectedFruits.length}/${maxFruits} loại quả`;
        }

        const total = this.calculateTotal();
        if (totalPriceEl) {
            totalPriceEl.innerText = `${total.toLocaleString('vi-VN')}đ`;
        }

        let totalCal = CUP_SIZES[this.selectedSize].calories;
        this.selectedFruits.forEach(fid => {
            const f = AVAILABLE_FRUITS.find(x => x.id === fid);
            if (f) totalCal += f.cal;
        });
        if (totalCaloriesEl) {
            totalCaloriesEl.innerText = `~${totalCal} kcal • Gọt tươi mát lạnh`;
        }

        if (cupDisplay) {
            if (this.selectedFruits.length === 0) {
                cupDisplay.innerHTML = `<div class="empty-cup-hint">Chọn trái cây bên dưới để lấp đầy ly Ngoăn tươi mát! 🍓🍉🥭</div>`;
            } else {
                cupDisplay.innerHTML = this.selectedFruits.map((fid, idx) => {
                    const fruit = AVAILABLE_FRUITS.find(f => f.id === fid);
                    return `
                        <div class="cup-layer animate-drop" style="background-color: ${fruit.color}33; border-left: 5px solid ${fruit.color}; animation-delay: ${idx * 0.05}s;">
                            <span class="layer-icon">${fruit.icon}</span>
                            <span class="layer-name">${fruit.name}</span>
                            <span class="layer-badge">${fruit.extra > 0 ? `+${fruit.extra/1000}k` : 'Tươi giòn'}</span>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    bindEvents() {
        const addBtn = document.getElementById('builderAddToCartBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const fruitNames = this.selectedFruits.map(fid => {
                    const f = AVAILABLE_FRUITS.find(x => x.id === fid);
                    return f ? f.name : fid;
                }).join(', ');

                const topNames = this.selectedToppings.map(tid => {
                    const t = AVAILABLE_TOPPINGS.find(x => x.id === tid);
                    return t ? t.name : tid;
                }).join(' + ');

                const customItem = {
                    id: 'custom-' + Date.now(),
                    name: `Ly Ngoăn Tự Phối (${CUP_SIZES[this.selectedSize].name.split(' ')[0]} ${CUP_SIZES[this.selectedSize].name.split(' ')[1]})`,
                    description: `Hoa quả: ${fruitNames}. Topping: ${topNames}`,
                    price: this.calculateTotal(),
                    quantity: 1,
                    image: 'assets/fruit_cup_takeaway.jpg',
                    isCustom: true
                };

                if (window.cartManager) {
                    window.cartManager.addItem(customItem);
                }

                if (window.animateFlyToCart) {
                    window.animateFlyToCart(addBtn);
                }

                if (window.ngoanSound) {
                    window.ngoanSound.playSuccess();
                }
            });
        }
    }
}

window.CupBuilder = CupBuilder;
