/**
 * Ngoăn Fresh Fruits - Native CareSoft Live Chat Client
 * Connects directly to CareSoft Real-time WebSocket Protocol
 * Zero third-party iframe • 100% Custom Branded UI
 */

(function () {
    const CONFIG = {
        domain: "thammy.cs",
        domainId: 9940,
        accountId: 9101,
        serviceId: 600119054,
        wsUrl: "wss://web5.caresoft.vn:8899/websocket"
    };

    let ws = null;
    let visitorId = localStorage.getItem("ngoan_cs_visitor_id") || null;
    let conversationId = localStorage.getItem("ngoan_cs_conversation_id") || "-1";
    let visitorName = localStorage.getItem("ngoan_cs_visitor_name") || "";
    let visitorPhone = localStorage.getItem("ngoan_cs_visitor_phone") || "";
    let isConnected = false;
    let isConnecting = false;
    let reconnectTimer = null;

    // Load saved messages or start with default welcome
    let messages = [];
    try {
        const saved = localStorage.getItem("ngoan_cs_messages");
        if (saved) {
            messages = JSON.parse(saved);
        }
    } catch (e) { }

    if (messages.length === 0) {
        messages.push({
            sender: "agent",
            text: "👋 Dạ Bếp Ngoăn chào bạn! Bếp sẵn lòng hỗ trợ bạn chọn trái cây gọt tươi hôm nay, thiết kế hộp quà biếu hoặc báo giá tiệc văn phòng. Bạn cần Ngoăn hỗ trợ gì ạ? 🍉✨",
            time: formatTime(new Date())
        });
    }

    function formatTime(date) {
        const d = date instanceof Date ? date : new Date(date);
        return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    }

    function saveMessages() {
        try {
            localStorage.setItem("ngoan_cs_messages", JSON.stringify(messages.slice(-50)));
        } catch (e) { }
    }

    // Initialize WebSocket connection
    function connectCareSoft() {
        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        isConnecting = true;
        try {
            ws = new WebSocket(CONFIG.wsUrl);

            ws.onopen = function () {
                isConnected = true;
                isConnecting = false;
                clearTimeout(reconnectTimer);

                // Send CUSTOMER_LOGIN (Service: 37)
                const loginData = {
                    service: 37,
                    data: {
                        visitorId: visitorId,
                        ip: "1.1.1.1",
                        country_name: "",
                        host: window.location.hostname || "localhost",
                        domain: CONFIG.domain,
                        os: navigator.platform || "Web",
                        browser: navigator.userAgent.substring(0, 50),
                        device_type: window.innerWidth < 768 ? "Mobile" : "Desktop",
                        accountId: CONFIG.accountId,
                        token: null
                    }
                };
                ws.send(JSON.stringify(loginData));
            };

            ws.onmessage = function (event) {
                try {
                    const res = JSON.parse(event.data);
                    handleCareSoftEvent(res);
                } catch (err) {
                    console.error("CareSoft parse error:", err);
                }
            };

            ws.onclose = function () {
                isConnected = false;
                isConnecting = false;
                // Auto reconnect after 5 seconds if chat is active
                reconnectTimer = setTimeout(connectCareSoft, 5000);
            };

            ws.onerror = function (err) {
                console.warn("CareSoft WebSocket note:", err);
            };
        } catch (e) {
            isConnecting = false;
        }
    }

    function handleCareSoftEvent(res) {
        const type = res.type;
        const data = res.data;

        // Type 37: CUSTOMER_LOGIN
        if (type === 37 && data && data.userId) {
            visitorId = data.userId;
            localStorage.setItem("ngoan_cs_visitor_id", visitorId);

            // Update visitor name/phone if available
            if (visitorName || visitorPhone) {
                sendVisitorInfo(visitorName, visitorPhone);
            }
        }

        // Type 5: MESSAGE
        if (type === 5 && data) {
            if (data.conversationId) {
                conversationId = data.conversationId;
                localStorage.setItem("ngoan_cs_conversation_id", conversationId);
            }

            // If needShow is true, this is an incoming message from the Agent!
            if (data.needShow && data.message) {
                addMessage("agent", data.message, data.time || new Date());
                hideTypingIndicator();
                playNotificationSound();
            }
        }

        // Type 88: NOTIFY_TYPING
        if (type === 88) {
            showTypingIndicator();
        }

        // Type 116: NOTIFY_STOP_TYPING
        if (type === 116) {
            hideTypingIndicator();
        }
    }

    function sendVisitorInfo(name, phone) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        visitorName = name || visitorName;
        visitorPhone = phone || visitorPhone;
        localStorage.setItem("ngoan_cs_visitor_name", visitorName);
        localStorage.setItem("ngoan_cs_visitor_phone", visitorPhone);

        const payload = {
            service: 41, // UPDATE_VISITOR_INFO
            data: {
                name: visitorName || "Khách Ngoăn",
                phone: visitorPhone || "",
                email: visitorPhone ? (visitorPhone + "@ngoan.vn") : ""
            }
        };
        ws.send(JSON.stringify(payload));
    }

    function sendMessageToCareSoft(text) {
        if (!text || !text.trim()) return;
        text = text.trim();

        // Add user message to UI immediately
        addMessage("user", text, new Date());

        // Ensure WebSocket is open
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            connectCareSoft();
            setTimeout(function () {
                doSend(text);
            }, 800);
        } else {
            doSend(text);
        }

        function doSend(msgText) {
            const payload = {
                service: 5, // MESSAGE
                data: {
                    service_id: CONFIG.serviceId,
                    conversationId: conversationId || "-1",
                    message: msgText,
                    fromTrigger: 0,
                    logging: "Web direct",
                    key: Date.now().toString()
                }
            };
            try {
                ws.send(JSON.stringify(payload));
            } catch (e) {
                console.error("Error sending message:", e);
            }
        }
    }

    // Play subtle soft chime when message arrives
    function playNotificationSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch (e) { }
    }

    // --- UI INJECTION & HANDLING ---
    function renderChatUI() {
        // Container
        const wrap = document.createElement("div");
        wrap.id = "ngoanChatContainer";
        wrap.innerHTML = `
            <!-- FLOATING CHAT LAUNCHER -->
            <div class="ngoan-chat-launcher" id="ngoanChatLauncher" title="Nhắn tin trực tiếp với Bếp Ngoăn">
                <svg viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span class="launcher-badge"></span>
            </div>

            <!-- CHAT PROMPT PILL -->
            <div class="chat-prompt-pill" id="chatPromptPill" title="Bấm để nhắn tin trực tiếp với Bếp Ngoăn">
                <span class="online-dot"></span>
                <span>Nhắn tin tư vấn trực tiếp 🍉</span>
                <span class="pill-close" id="pillCloseBtn" title="Đóng">&times;</span>
            </div>

            <!-- DIRECT CHAT WINDOW -->
            <div class="ngoan-chat-window" id="ngoanChatWindow">
                <!-- Header -->
                <div class="ngoan-chat-header">
                    <div class="chat-header-profile">
                        <img src="assets/logo.jpg" alt="Logo Ngoăn" class="chat-header-avatar">
                        <div>
                            <h4 class="chat-header-title">Ngoăn • Trực Tuyến</h4>
                            <div class="chat-header-status">
                                <span class="status-dot-live"></span>
                                <span>Nhân viên sẵn sàng • Phản hồi ngay</span>
                            </div>
                        </div>
                    </div>
                    <button class="chat-close-btn" id="chatCloseBtn" title="Thu nhỏ">&times;</button>
                </div>

                <!-- Messages Feed -->
                <div class="ngoan-chat-messages" id="ngoanChatMessages">
                    <!-- Quick Topic Chips -->
                    <div class="chat-chips-banner">
                        <div class="quick-chip" data-msg="Tư vấn giúp mình thực đơn trái cây gọt tươi hôm nay với">🍉 Menu gọt tươi</div>
                        <div class="quick-chip" data-msg="Mình muốn tư vấn set hộp quà biếu tặng trái cây cao cấp">🎁 Hộp quà biếu</div>
                        <div class="quick-chip" data-msg="Mình cần báo giá tiệc hoa quả Teabreak văn phòng">🏢 Tiệc Teabreak</div>
                        <div class="quick-chip" data-msg="Bếp có giao hỏa tốc trong 1 giờ được không?">⚡ Giao gấp 1h</div>
                    </div>

                    <div id="messagesList" class="messages-list-wrap"></div>

                    <!-- Typing indicator -->
                    <div class="chat-typing-indicator" id="chatTypingIndicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>

                <!-- Customer Info Quick Bar (Optional) -->
                <div class="chat-lead-bar" id="chatLeadBar">
                    <span class="lead-bar-icon">👤</span>
                    <input type="text" id="chatLeadName" placeholder="Tên của bạn" value="${escapeHtml(visitorName)}">
                    <input type="tel" id="chatLeadPhone" placeholder="SĐT / Zalo" value="${escapeHtml(visitorPhone)}">
                    <button type="button" id="chatLeadSaveBtn" title="Lưu thông tin">Lưu</button>
                </div>

                <!-- Input Box -->
                <form class="ngoan-chat-footer" id="ngoanChatInputForm">
                    <input type="text" id="chatTextInput" class="chat-text-input" placeholder="Nhập tin nhắn với Bếp Ngoăn..." autocomplete="off" required>
                    <button type="submit" class="chat-send-btn" id="chatSendBtn" title="Gửi tin nhắn">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(wrap);

        // Attach events
        const launcher = document.getElementById("ngoanChatLauncher");
        const pill = document.getElementById("chatPromptPill");
        const pillClose = document.getElementById("pillCloseBtn");
        const win = document.getElementById("ngoanChatWindow");
        const closeBtn = document.getElementById("chatCloseBtn");
        const form = document.getElementById("ngoanChatInputForm");
        const textInput = document.getElementById("chatTextInput");
        const leadSaveBtn = document.getElementById("chatLeadSaveBtn");
        const leadNameInput = document.getElementById("chatLeadName");
        const leadPhoneInput = document.getElementById("chatLeadPhone");

        function toggleChat() {
            const isActive = win.classList.toggle("active");
            if (isActive) {
                if (pill) pill.style.display = "none";
                connectCareSoft();
                renderAllMessages();
                setTimeout(() => textInput.focus(), 250);
            }
        }

        launcher.addEventListener("click", toggleChat);
        if (pill) {
            pill.addEventListener("click", toggleChat);
            pillClose.addEventListener("click", function (e) {
                e.stopPropagation();
                pill.style.display = "none";
            });
        }
        closeBtn.addEventListener("click", toggleChat);

        // Quick chips click
        document.querySelectorAll(".quick-chip").forEach(chip => {
            chip.addEventListener("click", function () {
                const msg = this.getAttribute("data-msg");
                sendMessageToCareSoft(msg);
                textInput.focus();
            });
        });

        // Form submit
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const text = textInput.value;
            if (text && text.trim()) {
                sendMessageToCareSoft(text);
                textInput.value = "";
            }
        });

        // Lead bar save
        leadSaveBtn.addEventListener("click", function () {
            const name = leadNameInput.value.trim();
            const phone = leadPhoneInput.value.trim();
            if (name || phone) {
                sendVisitorInfo(name, phone);
                leadSaveBtn.innerText = "✓ Đã lưu";
                leadSaveBtn.style.background = "#15803D";
                setTimeout(() => {
                    leadSaveBtn.innerText = "Lưu";
                    leadSaveBtn.style.background = "";
                }, 2000);
            }
        });

        leadNameInput.addEventListener("change", function () {
            sendVisitorInfo(this.value.trim(), leadPhoneInput.value.trim());
        });
        leadPhoneInput.addEventListener("change", function () {
            sendVisitorInfo(leadNameInput.value.trim(), this.value.trim());
        });

        renderAllMessages();
    }

    function escapeHtml(str) {
        if (!str) return "";
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function addMessage(sender, text, time) {
        const msgObj = {
            sender: sender,
            text: text,
            time: formatTime(time)
        };
        messages.push(msgObj);
        saveMessages();
        appendMessageElement(msgObj);
        scrollToBottom();
    }

    function renderAllMessages() {
        const list = document.getElementById("messagesList");
        if (!list) return;
        list.innerHTML = "";
        messages.forEach(msg => appendMessageElement(msg));
        scrollToBottom();
    }

    function appendMessageElement(msg) {
        const list = document.getElementById("messagesList");
        if (!list) return;

        const isUser = msg.sender === "user";
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble " + (isUser ? "bubble-user" : "bubble-agent");

        let senderLabel = isUser ? "" : '<div class="bubble-sender-name">Bếp Ngoăn 🍉</div>';
        bubble.innerHTML = `
            ${senderLabel}
            <div class="bubble-content">${escapeHtml(msg.text)}</div>
            <div class="bubble-time">${escapeHtml(msg.time)}</div>
        `;
        list.appendChild(bubble);
    }

    function scrollToBottom() {
        const container = document.getElementById("ngoanChatMessages");
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    function showTypingIndicator() {
        const indicator = document.getElementById("chatTypingIndicator");
        if (indicator) {
            indicator.style.display = "flex";
            scrollToBottom();
        }
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById("chatTypingIndicator");
        if (indicator) {
            indicator.style.display = "none";
        }
    }

    // Expose direct open function
    window.openCareSoftDirect = function () {
        const win = document.getElementById("ngoanChatWindow");
        const pill = document.getElementById("chatPromptPill");
        if (win) {
            win.classList.add("active");
            if (pill) pill.style.display = "none";
            connectCareSoft();
            renderAllMessages();
            const textInput = document.getElementById("chatTextInput");
            if (textInput) setTimeout(() => textInput.focus(), 250);
        }
    };

    // Auto-init when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderChatUI);
    } else {
        renderChatUI();
    }
})();
