// Chatbot Widget for Spice Haven
(function () {
    'use strict';

    // Inject chatbot styles
    const chatbotStyles = document.createElement('style');
    chatbotStyles.textContent = `
        /* ── Chatbot Widget Styles ── */
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        /* ── Toggle Button ── */
        #chat-btn {
            position: fixed;
            bottom: 28px;
            right: 28px;
            width: 62px;
            height: 62px;
            border-radius: 50%;
            background: #c2410c;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 24px rgba(194,65,12,0.4);
            transition: transform .2s, background .2s;
            z-index: 1000;
        }
        #chat-btn:hover { background: #9a3412; transform: scale(1.08); }
        #chat-btn svg { width: 28px; height: 28px; color: #fff; transition: opacity .15s; }
        #chat-btn #icon-close { display: none; }

        /* ── Chat Window ── */
        #chat-window {
            position: fixed;
            bottom: 102px;
            right: 28px;
            width: 380px;
            max-width: calc(100vw - 2rem);
            height: 540px;
            max-height: calc(100vh - 130px);
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(194,65,12,0.13);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 999;
            animation: chatSlideUp .25s ease;
        }
        #chat-window.open { display: flex; }

        @keyframes chatSlideUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Header ── */
        .chat-header {
            background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
        }
        .chat-header .avatar {
            width: 42px; height: 42px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px;
        }
        .chat-header .header-info h3 { color: #fff; font-size: 15px; font-weight: 600; margin: 0; }
        .chat-header .header-info span {
            color: rgba(255,255,255,0.75);
            font-size: 12px;
            display: flex; align-items: center; gap: 5px;
        }
        .chat-header .dot {
            width: 7px; height: 7px;
            background: #4ade80;
            border-radius: 50%;
            display: inline-block;
        }

        /* ── Messages ── */
        #messages {
            flex: 1;
            overflow-y: auto;
            padding: 18px 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #fafaf9;
        }
        #messages::-webkit-scrollbar { width: 4px; }
        #messages::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 4px; }

        .msg { display: flex; align-items: flex-end; gap: 8px; max-width: 82%; }
        .msg.bot  { align-self: flex-start; }
        .msg.user { align-self: flex-end; flex-direction: row-reverse; }

        .bubble {
            padding: 10px 14px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.55;
            word-break: break-word;
            white-space: pre-wrap;
            font-family: 'DM Sans', sans-serif;
        }
        .bot  .bubble { background: #fff; color: #1c1917; border: 1px solid #e7e5e4; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
        .user .bubble { background: #c2410c; color: #fff; border-bottom-right-radius: 4px; }

        /* ── Typing indicator ── */
        .typing .bubble { padding: 12px 16px; }
        .dots { display: flex; gap: 5px; }
        .dots span {
            width: 7px; height: 7px;
            background: #78716c;
            border-radius: 50%;
            animation: chatBounce 1.2s infinite;
        }
        .dots span:nth-child(2) { animation-delay: .2s; }
        .dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes chatBounce {
            0%,60%,100% { transform: translateY(0); }
            30% { transform: translateY(-6px); }
        }

        /* ── Input ── */
        .chat-footer {
            padding: 14px 16px;
            background: #ffffff;
            border-top: 1px solid #e7e5e4;
            display: flex;
            gap: 10px;
            flex-shrink: 0;
        }
        #chat-input {
            flex: 1;
            border: 1.5px solid #e7e5e4;
            border-radius: 12px;
            padding: 10px 14px;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            color: #1c1917;
            background: #fafaf9;
            outline: none;
            transition: border-color .2s;
        }
        #chat-input:focus { border-color: #c2410c; background: #fff; }
        #chat-input::placeholder { color: #78716c; }

        #send-btn {
            width: 42px; height: 42px;
            border-radius: 12px;
            background: #c2410c;
            border: none;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            transition: background .2s, transform .15s;
        }
        #send-btn:hover { background: #9a3412; }
        #send-btn:active { transform: scale(.93); }
        #send-btn svg { width: 18px; height: 18px; color: #fff; }
        #send-btn:disabled { opacity: .5; cursor: not-allowed; }
    `;
    document.head.appendChild(chatbotStyles);

    // Create chatbot HTML structure
    const chatbotHTML = `
        <!-- Toggle Button -->
        <button id="chat-btn">
            <svg id="icon-chat" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <svg id="icon-close" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>

        <!-- Chat Window -->
        <div id="chat-window">
            <div class="chat-header">
                <div class="avatar">🍛</div>
                <div class="header-info">
                    <h3>Spice Haven Assistant</h3>
                    <span><span class="dot"></span> Online now</span>
                </div>
            </div>

            <div id="messages"></div>

            <div class="chat-footer">
                <input id="chat-input" type="text" placeholder="Type your message..." autocomplete="off"/>
                <button id="send-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // ─── CONFIG — change this URL ───────────────────────────
    const WEBHOOK_URL = 'https://smartsflow.app.n8n.cloud/webhook/res';
    // ────────────────────────────────────────────────────────

    // Session Management
    let sessionId = 'session_' + Math.random().toString(36).slice(2) + '_' + Date.now();

    // Restore session
    if (localStorage.getItem('spice_session')) {
        sessionId = localStorage.getItem('spice_session');
    } else {
        localStorage.setItem('spice_session', sessionId);
    }

    // ── Toggle open/close ──
    function toggleChat() {
        const win = document.getElementById('chat-window');
        const isOpen = win.classList.contains('open');
        win.classList.toggle('open');
        document.getElementById('icon-chat').style.display = isOpen ? 'block' : 'none';
        document.getElementById('icon-close').style.display = isOpen ? 'none' : 'block';
        if (!isOpen) document.getElementById('chat-input').focus();
    }

    // ── Add message bubble ──
    function addMessage(text, sender) {
        const wrap = document.createElement('div');
        wrap.className = 'msg ' + sender;

        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        // safe render
        const safe = text
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        bubble.innerHTML = safe.replace(/\\n/g, '<br>');

        wrap.appendChild(bubble);
        document.getElementById('messages').appendChild(wrap);
        scrollBottom();
        return wrap;
    }

    // ── Typing indicator ──
    function showTyping() {
        const wrap = document.createElement('div');
        wrap.className = 'msg bot typing';
        wrap.id = 'typing';
        wrap.innerHTML = '<div class="bubble"><div class="dots"><span></span><span></span><span></span></div></div>';
        document.getElementById('messages').appendChild(wrap);
        scrollBottom();
    }

    function removeTyping() {
        const el = document.getElementById('typing');
        if (el) el.remove();
    }

    function scrollBottom() {
        const m = document.getElementById('messages');
        m.scrollTop = m.scrollHeight;
    }

    // ── Parse JSON response from n8n "Respond to Webhook" node ──
    function parseResponse(data) {
        // If it's an array, grab the first item
        if (Array.isArray(data)) {
            data = data[0];
        }

        if (!data) return null;

        // If it's a plain string already, return it
        if (typeof data === 'string') return data;

        // Try common n8n output fields (in priority order)
        return data.output
            || data.text
            || data.message
            || data.reply
            || data.response
            || data.answer
            || (typeof data === 'object' ? JSON.stringify(data) : String(data));
    }

    // ── Send user message to n8n webhook and display response ──
    async function sendMessage() {
        const input = document.getElementById('chat-input');
        const btn = document.getElementById('send-btn');
        const text = input.value.trim();
        if (!text) return;

        // Clear input and disable while waiting
        input.value = '';
        input.disabled = true;
        btn.disabled = true;

        // Show user message
        addMessage(text, 'user');
        showTyping();

        // 20-second timeout
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20000);

        try {
            // POST message to n8n webhook
            const res = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    chatInput: text,
                    message: text,
                    sessionId: sessionId,
                    timestamp: new Date().toISOString()
                })
            });

            clearTimeout(timer);
            removeTyping();

            if (!res.ok) throw new Error('Server error (' + res.status + ')');

            // Parse the JSON response from n8n's "Respond to Webhook" node
            const json = await res.json();
            const reply = parseResponse(json);

            addMessage(reply || 'Sorry, I didn\'t get a response.', 'bot');

        } catch (err) {
            clearTimeout(timer);
            removeTyping();

            if (err.name === 'AbortError') {
                addMessage('Request timed out. Please try again.', 'bot');
            } else {
                addMessage('Connection error. Please try again.', 'bot');
                console.error('Webhook error:', err);
            }
        } finally {
            input.disabled = false;
            btn.disabled = false;
            input.focus();
        }
    }

    // Initialize chatbot
    function initChatbot() {
        const container = document.getElementById('chatbot-container');
        if (!container) {
            console.error('Chatbot container not found');
            return;
        }

        container.innerHTML = chatbotHTML;

        // Toggle button click handler
        document.getElementById('chat-btn').addEventListener('click', toggleChat);

        // Send button click handler
        document.getElementById('send-btn').addEventListener('click', sendMessage);

        // Enter key handler
        document.getElementById('chat-input').addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
        });

        // Welcome message on load
        addMessage('Hey! Welcome to Spice Haven 🍛\nHow can I help you today?', 'bot');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();