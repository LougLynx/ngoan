/**
 * Ngoăn - Trái Cây Gọt Sẵn & Những Câu Chuyện Dở Khóc Dở Cười
 * Menu data, mood selectors, shopping cart, and orders
 */

const MENU_DATA = [
    // --- HỆ TÌNH CẢM ("Tình yêu có thể tan, nhưng trái cây thì vẫn ngọt!") ---
    {
        id: 'tc-01',
        category: 'tinh-cam',
        name: 'Nhớ Người Yêu Cũ',
        tag: '💔 Hệ Tình Cảm',
        price: 35000,
        originalPrice: 42000,
        image: 'assets/fruit_cup_takeaway.jpg',
        quote: 'Bởi vì vẫn nhớ, nên cứ lê thê... 💔',
        desc: 'Bưởi da xanh tép mọng + Táo giòn ngọt + Lê Hàn Quốc mọng nước. Vị chua ngọt đan xen như kỷ niệm xưa.',
        fruits: 'Bưởi + Táo + Lê',
        weight: '350g',
        saltPairing: 'Muối ớt xí muội'
    },
    {
        id: 'tc-02',
        category: 'tinh-cam',
        name: 'Crush Seen Không Rep',
        tag: '📱 Hệ Tình Cảm',
        price: 35000,
        originalPrice: 40000,
        image: 'assets/hero_fruit_bowl.jpg',
        quote: 'Ngọt nhưng hơi đau... 📱',
        desc: 'Dâu tây đỏ mọng + Nho đen ngọt lịm + Lê giòn ngọt. Ngọt ngào thanh mát xoa dịu trái tim chờ đợi tin nhắn.',
        fruits: 'Dâu + Nho + Lê',
        weight: '350g',
        saltPairing: 'Muối tôm Tây Ninh'
    },
    {
        id: 'tc-03',
        category: 'tinh-cam',
        name: 'Người Ta Có Bồ, Tôi Có Bưởi',
        tag: '🍈 Hệ Tình Cảm',
        price: 35000,
        originalPrice: 45000,
        image: 'assets/single_fruit_boxes.jpg',
        quote: 'Cũng ổn thôi... vì tôi có bưởi! 🍈',
        desc: 'Bưởi da xanh Bến Tre tách tép hồng hào ráo nước + Nho giòn ngọt. Ăn một miếng là thấy độc thân vẫn quá xịn.',
        fruits: 'Bưởi + Nho',
        weight: '350g',
        saltPairing: 'Muối ớt hồng xí muội'
    },
    {
        id: 'tc-04',
        category: 'tinh-cam',
        name: 'Chia Tay Nhưng Chưa Chia Tiền',
        tag: '💸 Hệ Tình Cảm',
        price: 39000,
        originalPrice: 49000,
        image: 'assets/fruit_cup_takeaway.jpg',
        quote: 'Yêu thì dễ, trả tiền thì khó... 💸',
        desc: 'Dưa hấu mát rượi + Táo xanh giòn rụm + Lê thanh ngọt. Càng ăn càng tỉnh táo để đòi nợ!',
        fruits: 'Dưa hấu + Táo + Lê',
        weight: '400g',
        saltPairing: 'Sốt mắm đường cay'
    },

    // --- HỆ CUỘC ĐỜI ("Đời không như mơ, nhưng trái cây thì có thật!") ---
    {
        id: 'cd-01',
        category: 'cuoc-doi',
        name: 'Lương Vừa Về Đã Bay',
        tag: '💰 Hệ Cuộc Đời',
        price: 39000,
        originalPrice: 45000,
        image: 'assets/fruit_cup_takeaway.jpg',
        quote: 'Vừa nhận lương đã hết 1/3... 💰',
        desc: 'Dưa hấu Long An + Dứa mật MD2 thơm ngát + Ổi nữ hoàng giòn tan. Bổ sung năng lượng để tiếp tục cày cuốc!',
        fruits: 'Dưa hấu + Dứa + Ổi',
        weight: '400g',
        saltPairing: 'Muối tôm Tây Ninh'
    },
    {
        id: 'cd-02',
        category: 'cuoc-doi',
        name: 'Cuối Tháng Ăn Bằng Niềm Tin',
        tag: '😇 Giá Cứu Đói',
        price: 29000,
        originalPrice: 35000,
        image: 'assets/single_fruit_boxes.jpg',
        quote: 'Tin vào bản thân và... hoa quả! 😇',
        desc: 'Dưa hấu ngọt lịm + Ổi giòn bỏ ruột. Giá êm ru cứu cánh cho những ngày chờ lương về.',
        fruits: 'Dưa hấu + Ổi',
        weight: '350g',
        saltPairing: 'Muối ớt Tây Ninh'
    },
    {
        id: 'cd-03',
        category: 'cuoc-doi',
        name: 'Ví Còn 35K',
        tag: '👛 Hệ Cuộc Đời',
        price: 35000,
        originalPrice: 40000,
        image: 'assets/fruit_cup_takeaway.jpg',
        quote: 'No bụng, nhẹ ví! 👛',
        desc: 'Ổi nữ hoàng giòn rụm + Dưa hấu mát rượi. Ly trái cây đầy ắp đúng bằng số tiền còn lại trong túi.',
        fruits: 'Ổi + Dưa hấu',
        weight: '380g',
        saltPairing: 'Muối ớt xí muội'
    },
    {
        id: 'cd-04',
        category: 'cuoc-doi',
        name: 'Mai Lãnh Lương',
        tag: '☀️ Hệ Cuộc Đời',
        price: 35000,
        originalPrice: 42000,
        image: 'assets/hero_fruit_bowl.jpg',
        quote: 'Cố lên, sắp có đồ ngon! ☀️',
        desc: 'Dứa mật ngọt thanh + Cam sành mọng nước + Dưa lưới Huỳnh Long giòn rụm. Tinh thần phấn chấn chào đón lương về.',
        fruits: 'Dứa + Cam + Dưa lưới',
        weight: '380g',
        saltPairing: 'Muối tôm Tây Ninh'
    },

    // --- HỆ TỰ HỦY ("Tự hủy có thể là một lựa chọn, nhưng phải ăn ngon đã!") ---
    {
        id: 'th-01',
        category: 'tu-huy',
        name: 'Ăn Cho Quên Thằng Đó',
        tag: '🎵 Hệ Tự Hủy',
        price: 35000,
        originalPrice: 42000,
        image: 'assets/fruit_cup_takeaway.jpg',
        quote: 'Quên không được, để trái cây giúp! 🎵',
        desc: 'Dứa mật thơm phức + Dưa hấu ngọt mọng + Nho đen giòn ngọt. Càng nhai càng giòn, quên ngay người không đáng nhớ.',
        fruits: 'Dứa + Dưa hấu + Nho',
        weight: '380g',
        saltPairing: 'Sốt mắm đường cay Thái'
    },
    {
        id: 'th-02',
        category: 'tu-huy',
        name: 'Mai Tôi Ăn Healthy',
        tag: '🙃 Hệ Tự Hủy',
        price: 35000,
        originalPrice: 40000,
        image: 'assets/hero_fruit_bowl.jpg',
        quote: 'Hôm nay ăn trước, mai tính sau... 🙃',
        desc: 'Xoài cát chín thơm vàng óng + Dưa hấu ngọt lịm + Nho tím mọng nước. Tự thưởng cho bản thân một bữa trọn vẹn.',
        fruits: 'Xoài + Dưa hấu + Nho',
        weight: '380g',
        saltPairing: 'Muối ớt hồng xí muội'
    },
    {
        id: 'th-03',
        category: 'tu-huy',
        name: 'Ăn Xong Tính Tiếp',
        tag: '🤍 Hệ Tự Hủy',
        price: 35000,
        originalPrice: 40000,
        image: 'assets/fruit_cup_takeaway.jpg',
        quote: 'Không cần lý do cũng phải ăn! 🤍',
        desc: 'Mix 3 loại quả bất kỳ ngon nhất trong ngày theo sự ngẫu hứng của bếp Ngoăn.',
        fruits: 'Mix 3 loại quả ngẫu nhiên',
        weight: '380g',
        saltPairing: 'Muối tôm Tây Ninh'
    },
    {
        id: 'th-04',
        category: 'tu-huy',
        name: 'Tin Người Lần Cuối',
        tag: '🤡 Hệ Tự Hủy',
        price: 39000,
        originalPrice: 48000,
        image: 'assets/hero_fruit_bowl.jpg',
        quote: "'Lần cuối' lần thứ 7... 🤡",
        desc: 'Dứa mật ngọt ngào + Táo đỏ giòn tan + Nho đen căng mọng. Tin ai thì tin, tin trái cây Ngoăn là không bao giờ sai!',
        fruits: 'Dứa + Táo + Nho',
        weight: '400g',
        saltPairing: 'Muối ớt hồng xí muội'
    },

    // --- HỆ ĐỘC THÂN ("Không có người yêu, nhưng có rất nhiều trái cây!") ---
    {
        id: 'dt-01',
        category: 'doc-than',
        name: 'Độc Thân Vui Vẻ',
        tag: '🤍 Hệ Độc Thân',
        price: 35000,
        originalPrice: 42000,
        image: 'assets/fruit_cup_takeaway.jpg',
        quote: 'Ngọt, vui, không cần người yêu! 🤍',
        desc: 'Dưa hấu mát rượi + Dứa thơm giòn + Nho không hạt. Độc thân tự do tự tại, muốn ăn lúc nào thì ăn!',
        fruits: 'Dưa hấu + Dứa + Nho',
        weight: '380g',
        saltPairing: 'Muối tôm hảo hạng'
    },
    {
        id: 'dt-02',
        category: 'doc-than',
        name: 'Không Có Người Yêu Nhưng Có Trái Cây',
        tag: '🍈 Hệ Độc Thân',
        price: 39000,
        originalPrice: 49000,
        image: 'assets/hero_fruit_bowl.jpg',
        quote: 'Vẫn ổn, vì có trái cây! 🍈',
        desc: 'Dâu tây đỏ thắm + Nho đen ngọt lịm + Dưa lưới giòn thanh. Dĩa hoa quả sang chảnh xoa dịu ngày cuối tuần.',
        fruits: 'Dâu + Nho + Dưa lưới',
        weight: '400g',
        saltPairing: 'Muối xí muội'
    },
    {
        id: 'dt-03',
        category: 'doc-than',
        name: 'Chị Đẹp Không Ăn Rau',
        tag: '👑 Hệ Độc Thân',
        price: 35000,
        originalPrice: 42000,
        image: 'assets/fruit_cup_takeaway.jpg',
        quote: 'Đẹp là phải ăn ngon! 👑',
        desc: 'Xoài cát vàng ươm + Dâu tây ngọt thanh + Nho giòn ngọt. Cung cấp trọn vẹn vitamin cho làn da phát sáng.',
        fruits: 'Xoài + Dâu + Nho',
        weight: '380g',
        saltPairing: 'Muối ớt hồng xí muội'
    },
    {
        id: 'dt-04',
        category: 'doc-than',
        name: 'Mẹ Hỏi Bao Giờ Lấy Chồng',
        tag: '🏡 Hệ Độc Thân',
        price: 35000,
        originalPrice: 45000,
        image: 'assets/single_fruit_boxes.jpg',
        quote: 'Chưa có người yêu nhưng có trái cây! 🏡',
        desc: 'Bưởi da xanh tép mọng + Táo giòn rụm + Lê mát lành. Trả lời mẹ bằng một hộp trái cây bổ dưỡng mời cả nhà.',
        fruits: 'Bưởi + Táo + Lê',
        weight: '380g',
        saltPairing: 'Muối tôm Tây Ninh'
    },
    {
        id: 'dt-05',
        category: 'doc-than',
        name: 'Ngoăn Ơi, Cứu Tao! (Hệ Đặc Biệt)',
        tag: '🆘 Hệ Đặc Biệt',
        price: 35000,
        originalPrice: 42000,
        image: 'assets/fruit_cup_takeaway.jpg',
        quote: 'Có chuyện gì thì kể, có trái cây thì ăn! 🍨',
        desc: 'Chọn 3 loại quả bất kỳ tùy ý bạn. Món "cứu tinh" cho mọi tâm trạng không tên trong ngày.',
        fruits: 'Chọn 3 loại quả bất kỳ',
        weight: '400g',
        saltPairing: 'Tùy chọn muối chấm'
    },

    // --- HỘP CHỮ NHẬT CHIA NGĂN GỌN GÀNG ---
    {
        id: 'box-01',
        category: 'hop-chu-nhat',
        name: 'Hộp Chữ Nhật 2 Ngăn Đôi Bạn Thân (500g)',
        tag: '📦 Hộp 2 Ngăn',
        price: 55000,
        originalPrice: 65000,
        image: 'assets/single_fruit_boxes.jpg',
        quote: 'Chia 2 ngăn riêng biệt, giữ trọn độ giòn thơm từng vị.',
        desc: 'Hộp chữ nhật nắp kín khí: 1 ngăn Dưa hấu Long An đỏ ngọt + 1 ngăn Ổi nữ hoàng giòn tan bỏ ruột. Kèm chén muối tôm.',
        fruits: 'Dưa hấu + Ổi nữ hoàng',
        weight: '500g',
        saltPairing: 'Muối tôm Tây Ninh'
    },
    {
        id: 'box-02',
        category: 'hop-chu-nhat',
        name: 'Hộp Chữ Nhật 3 Ngăn Tam Hợp Ngoăn (700g)',
        tag: '📦 Hộp 3 Ngăn (Best)',
        price: 75000,
        originalPrice: 89000,
        image: 'assets/single_fruit_boxes.jpg',
        quote: 'Được đặt nhiều nhất cho bữa phụ văn phòng.',
        desc: 'Hộp chữ nhật 3 ngăn sang trọng: Xoài cát Hòa Lộc vàng óng + Bưởi da xanh tép hồng + Kiwi New Zealand. Tặng 2 loại muối chấm.',
        fruits: 'Xoài cát + Bưởi tép hồng + Kiwi',
        weight: '700g',
        saltPairing: 'Muối xí muội & Muối tôm'
    },
    {
        id: 'box-03',
        category: 'hop-chu-nhat',
        name: 'Hộp Chữ Nhật 4 Ngăn Tứ Quý Đại Tiệc (1000g)',
        tag: '📦 Hộp 4 Ngăn VIP',
        price: 110000,
        originalPrice: 135000,
        image: 'assets/party_fruit_box.jpg',
        quote: 'Đủ đầy 4 sắc màu rực rỡ cho 2 - 3 người cùng thưởng thức.',
        desc: '4 ngăn vuông vức: Dâu tây Đà Lạt, Nho ngón tay, Dưa hấu ngọt lịm, Xoài cát chín cây. Kèm 2 chén sốt mắm đường & muối tôm.',
        fruits: 'Dâu + Nho + Dưa + Xoài',
        weight: '1.0 kg',
        saltPairing: 'Trọn bộ muối sốt'
    },
    {
        id: 'box-04',
        category: 'hop-chu-nhat',
        name: 'Hộp Xoài Cát Hòa Lộc Vàng Ươm (400g)',
        tag: '🥭 Hộp Đơn Món',
        price: 59000,
        originalPrice: 69000,
        image: 'assets/single_fruit_boxes.jpg',
        quote: 'Thịt quả dày thơm ngọt đậm đà, gọt miếng vuông vừa miệng.',
        desc: 'Xoài cát Hòa Lộc Tiền Giang chín tự nhiên trên cây, thịt vàng óng ả thơm ngát, thớ dày không xơ.',
        fruits: '100% Xoài Cát Hòa Lộc',
        weight: '400g',
        saltPairing: 'Muối tôm Tây Ninh'
    },

    // --- KHAY TIỆC & CATERING VĂN PHÒNG ---
    {
        id: 'party-01',
        category: 'khay-tiec',
        name: 'Khay Tiệc Ngoăn VIP Hội Nghị 8 Món (1.8kg)',
        tag: '🎉 Khay Tiệc Hội Nghị',
        price: 249000,
        originalPrice: 299000,
        image: 'assets/party_fruit_box.jpg',
        quote: 'Trái cây xếp nghệ thuật sang trọng cho phòng họp & sự kiện.',
        desc: 'Khay đại tiệc 1.8kg xếp nghệ thuật: bưởi tép hồng, nho móng tay, xoài cát, kiwi, thanh long, dưa hấu, dâu tây, ổi. Tặng kèm 3 hũ sốt & nĩa gỗ tiệc.',
        fruits: '8 loại trái cây cao cấp loại 1',
        weight: '1.8 kg',
        saltPairing: 'Trọn bộ 3 loại muối sốt'
    },
    {
        id: 'party-02',
        category: 'khay-tiec',
        name: 'Set Trái Cây Bữa Xế Team Building (4-6 người)',
        tag: '🎉 Văn Phòng Mê',
        price: 169000,
        originalPrice: 199000,
        image: 'assets/party_fruit_box.jpg',
        quote: 'Bữa phụ xế chiều tràn ngập năng lượng và tiếng cười cho cả team.',
        desc: '1.2kg trái cây giòn ngọt mix 5 vị: ổi, cóc, xoài, dưa hấu, dứa mật. Kèm muối tôm, sốt mắm đường và nĩa gỗ tiện lợi.',
        fruits: '5 loại quả giòn ngọt',
        weight: '1.2 kg',
        saltPairing: 'Muối tôm & Sốt mắm đường'
    },

    // --- TOPPINGS & GIA VỊ CHẤM (+5K) ---
    {
        id: 'top-01',
        category: 'toppings',
        name: 'Hũ Muối Ớt Hồng Xí Muội Ngoăn',
        tag: '🧂 Topping +5K',
        price: 5000,
        originalPrice: 10000,
        image: 'assets/dipping_salts.jpg',
        quote: 'Chua thanh mặn ngọt, kích thích vị giác tột đỉnh.',
        desc: 'Bột xí muội thảo mộc kết hợp ớt hồng phơi khô, vị chua thanh ngọt hậu gây nghiện ngay từ lần chấm đầu tiên.',
        fruits: 'Gia vị chấm độc quyền',
        weight: '50g',
        saltPairing: 'Hợp mọi loại quả'
    },
    {
        id: 'top-02',
        category: 'toppings',
        name: 'Hũ Sốt Mắm Đường Thái Kẹo Cay',
        tag: '🌶️ Topping +5K',
        price: 5000,
        originalPrice: 10000,
        image: 'assets/dipping_salts.jpg',
        quote: 'Sánh keo óng ánh, cay xé đầu lưỡi chấm xoài ổi hết nấc.',
        desc: 'Nấu cô đặc từ đường thốt nốt nguyên chất, nước mắm nhĩ thơm lừng và ớt hiểm đỏ rực.',
        fruits: 'Sốt chấm sệt',
        weight: '60ml',
        saltPairing: 'Xoài sống, cóc, ổi'
    },
    {
        id: 'top-03',
        category: 'toppings',
        name: 'Lắc Muối Ớt Tươi / Tắc Chua Cay',
        tag: '🍋 Topping +5K',
        price: 5000,
        originalPrice: 8000,
        image: 'assets/dipping_salts.jpg',
        quote: 'Bếp Ngoăn lắc đều trực tiếp trước khi giao tới tay bạn.',
        desc: 'Thấm đẫm từng lát trái cây, hòa quyện hương tắc tươi thơm ngát cùng vị muối ớt cay nồng.',
        fruits: 'Dịch vụ lắc sẵn',
        weight: 'Theo ly/hộp',
        saltPairing: 'Ăn liền siêu cuốn'
    },
    {
        id: 'top-04',
        category: 'toppings',
        name: 'Thêm Sữa Chua Hy Lạp Dầm',
        tag: '🥣 Topping +5K',
        price: 5000,
        originalPrice: 10000,
        image: 'assets/fruit_yogurt_bowl.jpg',
        quote: 'Béo ngậy thanh mát không đường, dồi dào lợi khuẩn.',
        desc: 'Sữa chua sánh mịn hòa cùng hoa quả ngọt ngào, tạo thành món tráng miệng bổ dưỡng.',
        fruits: 'Topping sữa chua',
        weight: '80g',
        saltPairing: 'Dâu, Nho, Xoài'
    },
    {
        id: 'top-05',
        category: 'toppings',
        name: 'Thêm Hạt Granola Yến Mạch Giòn',
        tag: '🌾 Topping +5K',
        price: 5000,
        originalPrice: 10000,
        image: 'assets/fruit_yogurt_bowl.jpg',
        quote: 'Yến mạch nướng mật ong bùi bùi giòn rụm.',
        desc: 'Tăng thêm độ giòn vui tai và no lâu cho bữa xế lành mạnh.',
        fruits: 'Topping hạt giòn',
        weight: '30g',
        saltPairing: 'Hợp bát hoa quả dầm'
    }
];

class CartManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('ngoan_cart') || '[]');
        this.appliedVoucher = null;
        this.shippingThreshold = 150000;
        this.baseShipping = 22000;

        this.init();
    }

    init() {
        this.updateBadge();
        this.renderDrawer();
        this.bindEvents();
    }

    save() {
        localStorage.setItem('ngoan_cart', JSON.stringify(this.items));
        this.updateBadge();
        this.renderDrawer();
    }

    addItem(product) {
        const existingIndex = this.items.findIndex(item => item.id === product.id && !item.isCustom);
        if (existingIndex > -1) {
            this.items[existingIndex].quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1,
                description: product.description || product.desc || '',
                isCustom: !!product.isCustom
            });
        }
        this.save();
    }

    updateQuantity(id, delta) {
        const item = this.items.find(x => x.id === id);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            this.items = this.items.filter(x => x.id !== id);
        }
        this.save();
    }

    removeItem(id) {
        this.items = this.items.filter(x => x.id !== id);
        this.save();
    }

    clear() {
        this.items = [];
        this.appliedVoucher = null;
        this.save();
    }

    getSubtotal() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    getShippingFee() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= this.shippingThreshold) return 0;
        if (this.appliedVoucher && this.appliedVoucher.code === 'FREESHIPNGOAN') return 0;
        return this.baseShipping;
    }

    getDiscount() {
        if (!this.appliedVoucher) return 0;
        const sub = this.getSubtotal();
        if (this.appliedVoucher.code === 'NGOAN10K') return Math.min(10000, sub);
        if (this.appliedVoucher.code === 'NGOAN15') return Math.round(sub * 0.15);
        return 0;
    }

    getTotal() {
        return Math.max(0, this.getSubtotal() + this.getShippingFee() - this.getDiscount());
    }

    applyVoucher(code, title = '') {
        const cleanCode = code.toUpperCase().trim();
        if (cleanCode === 'NGOAN10K') {
            this.appliedVoucher = { code: 'NGOAN10K', title: title || 'Giảm 10.000đ', amount: 10000 };
        } else if (cleanCode === 'FREESHIPNGOAN') {
            this.appliedVoucher = { code: 'FREESHIPNGOAN', title: title || 'Miễn Phí Vận Chuyển', amount: 22000 };
        } else if (cleanCode === 'MUOIXIMUOI') {
            this.appliedVoucher = { code: 'MUOIXIMUOI', title: title || 'Tặng Muối Xí Muội Miễn Phí', amount: 0 };
        } else if (cleanCode === 'NGOAN15') {
            this.appliedVoucher = { code: 'NGOAN15', title: title || 'Giảm 15% Tổng Đơn', amount: 0.15 };
        } else if (cleanCode === 'NGOANLOVE') {
            this.appliedVoucher = { code: 'NGOANLOVE', title: 'Ưu đãi bạn thân Ngoăn (Giảm 20k)', amount: 20000 };
        } else {
            alert('Mã ưu đãi không hợp lệ hoặc đã hết lượt!');
            return false;
        }

        this.renderDrawer();
        if (window.ngoanSound) window.ngoanSound.playSuccess();
        return true;
    }

    updateBadge() {
        const badge = document.getElementById('cartBadgeCount');
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (badge) {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    renderDrawer() {
        const container = document.getElementById('cartItemsList');
        const emptyState = document.getElementById('cartEmptyState');
        const drawerFooter = document.getElementById('cartDrawerFooter');
        const subtotalEl = document.getElementById('cartSubtotalPrice');
        const shippingEl = document.getElementById('cartShippingFee');
        const discountRow = document.getElementById('cartDiscountRow');
        const discountEl = document.getElementById('cartDiscountPrice');
        const totalEl = document.getElementById('cartTotalPrice');
        const freeShipText = document.getElementById('freeShipProgressText');
        const freeShipBar = document.getElementById('freeShipProgressBar');

        if (!container) return;

        const subtotal = this.getSubtotal();
        const shipping = this.getShippingFee();
        const discount = this.getDiscount();
        const total = this.getTotal();

        if (freeShipText && freeShipBar) {
            if (subtotal >= this.shippingThreshold) {
                freeShipText.innerHTML = `🎉 Tuyệt vời! Đơn hàng được <strong>FREESHIP</strong> toàn thành phố!`;
                freeShipBar.style.width = '100%';
                freeShipBar.style.backgroundColor = '#22C55E';
            } else {
                const diff = this.shippingThreshold - subtotal;
                const percent = Math.min(100, Math.round((subtotal / this.shippingThreshold) * 100));
                freeShipText.innerHTML = `Thêm <strong>${diff.toLocaleString('vi-VN')}đ</strong> để được <strong>FREESHIP</strong> 🚀`;
                freeShipBar.style.width = `${percent}%`;
                freeShipBar.style.backgroundColor = '#FF9F1C';
            }
        }

        if (this.items.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            if (drawerFooter) drawerFooter.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (drawerFooter) drawerFooter.style.display = 'block';

        container.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-desc">${item.description}</div>
                    <div class="cart-item-price">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</div>
                    <div class="cart-item-actions">
                        <div class="cart-stepper">
                            <button class="step-btn minus" data-id="${item.id}">-</button>
                            <span class="step-val">${item.quantity}</span>
                            <button class="step-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <button class="cart-remove-btn" data-id="${item.id}">Xóa</button>
                    </div>
                </div>
            </div>
        `).join('');

        if (subtotalEl) subtotalEl.innerText = `${subtotal.toLocaleString('vi-VN')}đ`;
        if (shippingEl) shippingEl.innerText = shipping === 0 ? 'MIỄN PHÍ' : `${shipping.toLocaleString('vi-VN')}đ`;
        if (totalEl) totalEl.innerText = `${total.toLocaleString('vi-VN')}đ`;

        if (discountRow && discountEl) {
            if (discount > 0 || (this.appliedVoucher && this.appliedVoucher.code === 'MUOIXIMUOI')) {
                discountRow.style.display = 'flex';
                discountEl.innerText = discount > 0 ? `-${discount.toLocaleString('vi-VN')}đ` : 'Tặng Quà Miễn Phí';
            } else {
                discountRow.style.display = 'none';
            }
        }

        container.querySelectorAll('.step-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                this.updateQuantity(btn.dataset.id, -1);
                if (window.ngoanSound) window.ngoanSound.playPop();
            });
        });

        container.querySelectorAll('.step-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                this.updateQuantity(btn.dataset.id, 1);
                if (window.ngoanSound) window.ngoanSound.playCrunch();
            });
        });

        container.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeItem(btn.dataset.id);
                if (window.ngoanSound) window.ngoanSound.playPop();
            });
        });
    }

    bindEvents() {
        const openCartBtn = document.getElementById('floatingCartBtn');
        const navCartBtn = document.getElementById('navCartBtn');
        const closeCartBtn = document.getElementById('closeCartDrawer');
        const drawerOverlay = document.getElementById('cartDrawerOverlay');
        const drawer = document.getElementById('cartDrawer');

        const openDrawer = () => {
            if (drawer) drawer.classList.add('active');
            if (drawerOverlay) drawerOverlay.classList.add('active');
            if (window.ngoanSound) window.ngoanSound.playPop();
        };

        const closeDrawer = () => {
            if (drawer) drawer.classList.remove('active');
            if (drawerOverlay) drawerOverlay.classList.remove('active');
        };

        if (openCartBtn) openCartBtn.addEventListener('click', openDrawer);
        if (navCartBtn) navCartBtn.addEventListener('click', openDrawer);
        if (closeCartBtn) closeCartBtn.addEventListener('click', closeDrawer);
        if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

        const applyVoucherBtn = document.getElementById('applyVoucherInputBtn');
        const voucherInput = document.getElementById('voucherInput');
        if (applyVoucherBtn && voucherInput) {
            applyVoucherBtn.addEventListener('click', () => {
                const code = voucherInput.value;
                if (!code) return;
                this.applyVoucher(code);
                voucherInput.value = '';
            });
        }

        const checkoutBtn = document.getElementById('checkoutSubmitBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.openCheckoutModal();
            });
        }
    }

    openCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        const checkoutItemsSummary = document.getElementById('checkoutItemsSummary');
        const checkoutFinalTotal = document.getElementById('checkoutFinalTotal');

        if (this.items.length === 0) {
            alert('Giỏ hàng của bạn đang trống! Hãy chọn trái cây tươi ngon trước nhé.');
            return;
        }

        if (checkoutItemsSummary) {
            checkoutItemsSummary.innerHTML = this.items.map(i => `
                <div class="checkout-summary-row">
                    <span>${i.name} x${i.quantity}</span>
                    <strong>${(i.price * i.quantity).toLocaleString('vi-VN')}đ</strong>
                </div>
            `).join('');
        }

        if (checkoutFinalTotal) {
            checkoutFinalTotal.innerText = `${this.getTotal().toLocaleString('vi-VN')}đ`;
        }

        if (modal) {
            modal.classList.add('active');
            if (window.ngoanSound) window.ngoanSound.playPop();
        }
    }
}

// Menu Controller
class MenuController {
    constructor() {
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.renderMenu();
        this.bindEvents();
    }

    renderMenu() {
        const grid = document.getElementById('menuGrid');
        if (!grid) return;

        let filtered = MENU_DATA;

        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(item => item.category === this.currentCategory);
        }

        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            filtered = filtered.filter(item => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || (item.quote && item.quote.toLowerCase().includes(q)));
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <span style="font-size: 3rem;">🔍🍉</span>
                    <h3>Không tìm thấy món trái cây phù hợp</h3>
                    <p style="color: var(--text-muted);">Hãy thử tìm với từ khóa khác như "người yêu cũ", "cuối tháng", "dưa hấu", "hộp chữ nhật"...</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(item => `
            <div class="product-card" data-tilt data-id="${item.id}">
                <div class="product-image-wrap">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" class="product-img">
                    <span class="product-tag">${item.tag}</span>
                    <button class="quick-add-btn" data-id="${item.id}" title="Thêm nhanh vào giỏ">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
                <div class="product-body">
                    ${item.quote ? `
                        <div class="mood-quote-bubble">
                            <span class="quote-text">"${item.quote}"</span>
                        </div>
                    ` : ''}

                    <div class="product-meta-row">
                        <span class="product-fruits">🍓 ${item.fruits}</span>
                        <span class="product-weight">⚖️ ${item.weight}</span>
                    </div>

                    <h3 class="product-title">${item.name}</h3>
                    <p class="product-desc">${item.desc}</p>

                    <div class="salt-tip">
                        <span class="salt-tip-icon">🧂</span>
                        <span class="salt-tip-text">Gợi ý kèm: <strong>${item.saltPairing}</strong></span>
                    </div>

                    <div class="product-footer">
                        <div class="price-box">
                            <span class="current-price">${item.price.toLocaleString('vi-VN')}đ</span>
                            ${item.originalPrice ? `<span class="old-price">${item.originalPrice.toLocaleString('vi-VN')}đ</span>` : ''}
                        </div>
                        <button class="btn-add-cart" data-id="${item.id}">
                            <span>Đặt Ngay</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        if (window.initTiltEffect) {
            window.initTiltEffect();
        }

        grid.querySelectorAll('.btn-add-cart, .quick-add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const product = MENU_DATA.find(x => x.id === id);
                if (product && window.cartManager) {
                    window.cartManager.addItem(product);
                    if (window.animateFlyToCart) {
                        window.animateFlyToCart(btn);
                    }
                    if (window.ngoanSound) {
                        window.ngoanSound.playCrunch();
                    }
                }
            });
        });
    }

    setCategory(cat) {
        this.currentCategory = cat;
        const tabs = document.querySelectorAll('.cat-pill');
        tabs.forEach(t => {
            t.classList.toggle('active', t.dataset.category === cat);
        });
        this.renderMenu();
    }

    bindEvents() {
        const tabs = document.querySelectorAll('.cat-pill');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.setCategory(tab.dataset.category);
                if (window.ngoanSound) window.ngoanSound.playPop();
            });
        });

        const searchInput = document.getElementById('menuSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.trim();
                this.renderMenu();
            });
        }
    }
}

// Social Proof Live Notification Simulator
function initLiveNotificationTicker() {
    const customers = [
        { name: 'Chị Mai Lan (Quận 1)', item: '2 Ly Nhớ Người Yêu Cũ 💔', time: 'vừa xong' },
        { name: 'Anh Hoàng Tuấn (Bình Thạnh)', item: '1 Hộp Chữ Nhật 3 Ngăn Tam Hợp', time: '1 phút trước' },
        { name: 'Bạn Ngọc Trâm (Quận 7)', item: '1 Ly Lương Vừa Về Đã Bay + Tắc 💰', time: '3 phút trước' },
        { name: 'Chị Thùy Dung (Tân Bình)', item: '1 Ly Độc Thân Vui Vẻ 🤍', time: '5 phút trước' },
        { name: 'Team Marketing Ree (Q.4)', item: '1 Khay Tiệc VIP Hội Nghị 8 Món 🎉', time: '6 phút trước' }
    ];

    const toast = document.getElementById('liveOrderToast');
    if (!toast) return;

    let index = 0;

    function showNext() {
        const order = customers[index];
        index = (index + 1) % customers.length;

        toast.querySelector('.toast-user').innerText = order.name;
        toast.querySelector('.toast-item').innerText = order.item;
        toast.querySelector('.toast-time').innerText = order.time;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    setTimeout(() => {
        showNext();
        setInterval(showNext, 14000);
    }, 4000);
}

// Checkout Form Submission & Celebration
function initCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    const modal = document.getElementById('checkoutModal');
    const closeBtn = document.getElementById('closeCheckoutModal');
    const successModal = document.getElementById('orderSuccessModal');
    const closeSuccessBtn = document.getElementById('closeSuccessModal');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (closeSuccessBtn && successModal) {
        closeSuccessBtn.addEventListener('click', () => successModal.classList.remove('active'));
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('orderName').value;
            const phone = document.getElementById('orderPhone').value;
            const address = document.getElementById('orderAddress').value;
            const note = document.getElementById('orderNote').value;
            const payment = document.querySelector('input[name="paymentMethod"]:checked').value;

            const orderCode = 'NGOAN-' + Math.floor(100000 + Math.random() * 900000);

            document.getElementById('successOrderCode').innerText = orderCode;
            document.getElementById('successCustomerName').innerText = name;
            document.getElementById('successPhone').innerText = phone;
            document.getElementById('successAddress').innerText = address;
            document.getElementById('successPayment').innerText = payment === 'cod' ? 'Tiền mặt khi nhận (COD)' : 'Chuyển khoản QR Siêu Tốc';

            modal.classList.remove('active');
            if (successModal) {
                successModal.classList.add('active');
            }

            if (window.ngoanSound) window.ngoanSound.playSuccess();
            if (window.LuckyWheel && window.luckyWheelInstance) {
                window.luckyWheelInstance.triggerConfetti();
            }

            if (window.cartManager) {
                window.cartManager.clear();
            }
        });
    }
}

// Mood Banner Shortcut Buttons
function initMoodShortcuts() {
    const moodButtons = document.querySelectorAll('.mood-shortcut-btn');
    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.category;
            if (window.menuController) {
                window.menuController.setCategory(cat);
            }
            const menuSection = document.getElementById('menuSection');
            if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
            }
            if (window.ngoanSound) window.ngoanSound.playPop();
        });
    });
}

// Sound toggle button in header
function initSoundToggle() {
    const soundBtn = document.getElementById('toggleSoundBtn');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
        const isEnabled = window.ngoanSound.toggle();
        soundBtn.classList.toggle('muted', !isEnabled);
        soundBtn.querySelector('.sound-label').innerText = isEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt';
        if (isEnabled) {
            window.ngoanSound.playPop();
        }
    });
}

// Mobile navigation toggle
function initMobileNav() {
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new window.FloatingFruits();
    initSoundToggle();
    initMobileNav();

    window.cartManager = new CartManager();
    window.menuController = new MenuController();

    if (window.CupBuilder) {
        new window.CupBuilder();
    }

    window.luckyWheelInstance = new window.LuckyWheel();
    initLiveNotificationTicker();
    initCheckoutForm();
    initMoodShortcuts();

    if (window.initTiltEffect) {
        window.initTiltEffect();
    }
});
