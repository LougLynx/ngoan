/**
 * Ngoăn - Trái Cây Gọt Sẵn: Lucky Spin Wheel & Confetti Burst
 */

const WHEEL_PRIZES = [
    { text: 'Tặng Muối Xí Muội', color: '#EF4444', textColor: '#FFF', code: 'MUOIXIMUOI', desc: 'Được tặng 1 hũ muối xí muội siêu ngon cho đơn hàng này!' },
    { text: 'Giảm 10.000đ', color: '#F59E0B', textColor: '#FFF', code: 'NGOAN10K', desc: 'Mã giảm 10.000đ đã được tự động áp dụng!' },
    { text: 'Thêm 100g Dưa Hấu', color: '#10B981', textColor: '#FFF', code: 'EXTRAWATERMELON', desc: 'Bếp Ngoăn sẽ gọt tặng thêm 100g dưa hấu ngọt lịm!' },
    { text: 'Miễn Phí Giao Hàng', color: '#3B82F6', textColor: '#FFF', code: 'FREESHIPNGOAN', desc: 'Freeship tối đa 25.000đ cho đơn hàng của bạn!' },
    { text: 'Giảm 15% Đơn Sau', color: '#8B5CF6', textColor: '#FFF', code: 'NGOAN15', desc: 'Mã ưu đãi 15% cho người bạn thân thiết của Ngoăn!' },
    { text: 'Tặng Trà Trái Cây', color: '#EC4899', textColor: '#FFF', code: 'TRATRAICAY', desc: 'Tặng 1 ly trà ổi hồng thơm mát khi đặt từ 99k!' }
];

class LuckyWheel {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.spinBtn = document.getElementById('spinWheelBtn');
        this.resultModal = document.getElementById('wheelResultModal');
        this.resultText = document.getElementById('wheelResultText');
        this.resultDesc = document.getElementById('wheelResultDesc');
        this.applyVoucherBtn = document.getElementById('wheelApplyVoucherBtn');

        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.currentAngle = 0;
        this.isSpinning = false;
        this.hasSpun = false;
        this.wonPrize = null;

        if (this.canvas) {
            this.init();
        }
    }

    init() {
        this.drawWheel();
        if (this.spinBtn) {
            this.spinBtn.addEventListener('click', () => this.spin());
        }

        if (this.applyVoucherBtn) {
            this.applyVoucherBtn.addEventListener('click', () => {
                if (this.wonPrize && window.cartManager) {
                    window.cartManager.applyVoucher(this.wonPrize.code, this.wonPrize.text);
                }
                this.closeResult();
            });
        }
    }

    drawWheel() {
        if (!this.ctx) return;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = width / 2 - 12;
        const numSlices = WHEEL_PRIZES.length;
        const sliceAngle = (Math.PI * 2) / numSlices;

        this.ctx.clearRect(0, 0, width, height);

        // Draw Slices
        for (let i = 0; i < numSlices; i++) {
            const angle = this.currentAngle + i * sliceAngle;
            const prize = WHEEL_PRIZES[i];

            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = prize.color;
            this.ctx.fill();

            // Inner border
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.stroke();

            // Text
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(angle + sliceAngle / 2);
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = prize.textColor;
            this.ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
            this.ctx.fillText(prize.text, radius - 20, 5);
            this.ctx.restore();
        }

        // Outer glow rim
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = '#22C55E';
        this.ctx.stroke();

        // Center hub
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#1E7B34';
        this.ctx.stroke();

        // Center icon
        this.ctx.font = '16px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🍉', centerX, centerY);
    }

    spin() {
        if (this.isSpinning) return;
        if (this.hasSpun) {
            alert('Bạn đã quay quà hôm nay rồi! Hãy áp dụng phần thưởng vào giỏ hàng nhé.');
            return;
        }

        this.isSpinning = true;
        this.spinBtn.disabled = true;
        if (window.ngoanSound) window.ngoanSound.playCrunch();

        // Pick random winning slice
        const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
        const sliceAngle = (Math.PI * 2) / WHEEL_PRIZES.length;

        // Pointer is at the top (angle -PI/2)
        // Center of winning slice should end at pointer
        const extraRotations = 5 + Math.floor(Math.random() * 3);
        const targetAngle = (Math.PI * 2 * extraRotations) + (Math.PI * 3 / 2) - (prizeIndex * sliceAngle + sliceAngle / 2);

        const startAngle = this.currentAngle;
        const totalRotation = targetAngle - (startAngle % (Math.PI * 2));
        const duration = 4000;
        const startTime = performance.now();

        const animateSpin = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            this.currentAngle = startAngle + totalRotation * ease;
            this.drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animateSpin);
            } else {
                this.isSpinning = false;
                this.hasSpun = true;
                this.wonPrize = WHEEL_PRIZES[prizeIndex];
                this.showResult(this.wonPrize);
            }
        };

        requestAnimationFrame(animateSpin);
    }

    showResult(prize) {
        if (window.ngoanSound) window.ngoanSound.playSuccess();
        this.triggerConfetti();

        if (this.resultModal) {
            this.resultText.innerText = prize.text;
            this.resultDesc.innerText = prize.desc;
            this.resultModal.classList.add('active');
        }
    }

    closeResult() {
        if (this.resultModal) {
            this.resultModal.classList.remove('active');
        }
    }

    triggerConfetti() {
        const confettiCount = 60;
        const container = document.body;

        for (let i = 0; i < confettiCount; i++) {
            const el = document.createElement('div');
            el.className = 'confetti-piece';
            const colors = ['#22C55E', '#FF4B6E', '#FBBF24', '#38BDF8', '#A855F7', '#FB7185'];
            const icons = ['🍉', '🥝', '🥭', '⭐', '🎉', '✨'];
            const isEmoji = Math.random() > 0.5;

            if (isEmoji) {
                el.innerText = icons[Math.floor(Math.random() * icons.length)];
                el.style.fontSize = (Math.random() * 16 + 14) + 'px';
            } else {
                el.style.background = colors[Math.floor(Math.random() * colors.length)];
                el.style.width = (Math.random() * 8 + 6) + 'px';
                el.style.height = (Math.random() * 14 + 8) + 'px';
                el.style.borderRadius = '3px';
            }

            el.style.position = 'fixed';
            el.style.left = (Math.random() * 80 + 10) + 'vw';
            el.style.top = '-20px';
            el.style.zIndex = '999999';
            el.style.pointerEvents = 'none';
            el.style.transform = `rotate(${Math.random() * 360}deg)`;
            el.style.transition = `all ${Math.random() * 2 + 1.8}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

            container.appendChild(el);

            setTimeout(() => {
                el.style.top = (window.innerHeight + 40) + 'px';
                el.style.left = (parseFloat(el.style.left) + (Math.random() * 20 - 10)) + 'vw';
                el.style.transform = `rotate(${Math.random() * 720}deg)`;
                el.style.opacity = '0';
            }, 50);

            setTimeout(() => el.remove(), 4000);
        }
    }
}

window.LuckyWheel = LuckyWheel;
