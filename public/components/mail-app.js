const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-size: 14px;
            border: 1px solid #303030;
        }
        * {
            box-sizing: border-box;
            scrollbar-width: none;
        }
        .resize-container {
            position: relative;
            display: inline-flex;
            height: 100%;
            z-index: 2;
            width: 60%;
            flex-shrink: 0;
            min-width: min-content;
            
            & .nav_container {  
                display: flex;
                flex-direction: column;          
                height: 100%;
                z-index: 2;
                
                max-width: 250px;
                max-height: 100%;

                & icon-nav {
                    width: 250px;
                    border: none;
                    flex-grow: 1;
                }
            }

            & .preview-window {
                position: relative;
                display: flex;
                flex-direction: column;
                height: 100%;
                border: 1px solid #303030;
                border-top: none;
                border-bottom: none;
                flex-grow: 1;
                flex-shrink: 0;
                width: 300px;

                & .header .title {
                    font-size: 1.25em;
                    line-height: 1.75em;
                }
                & .content {
                    overflow: scroll;
                }
                & .resize-handle {
                    position: absolute;
                    right: -.35rem;
                    height: 100%;
                    width: .7rem;

                    &:hover {
                        cursor: ew-resize;
                    }
                    & .handle-icon {
                        display: grid;
                        place-content: center;
                        border-radius: 4px;
                        position: absolute;
                        
                        top: 50%;
                        width: 100%;
                        height: 1rem;
                        background-color: #303030;
                        z-index: 10;
                    }
                }

                & .content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    padding: 1rem;
                    padding-bottom: none;
                    width: 100%;
                }
            }  
        }  

        .mail-display {
            position: relative;
            display: inline-flex;
            flex-direction: column;
            height: 100%;
            flex-grow: 1;
            min-width: min-content;
            max-height: 100%;
            overflow: hidden;

            &::before{
                content: "";
                position: absolute;
                display: block;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0;
                background-color: black;
                transition: height 250ms ease-in-out;
            }

            &.new-message::before{
                height: 100%;
            }
            
            & .header {
                padding-inline: .5rem;

                & .toolbar {
                    display: flex;
                    gap: .1rem;

                    & shad-button {
                        padding: .5rem;
                        background-color: black;
                        color: white;
                        border-color: transparent;
                    }
                }
            }

            & .head {
                display: flex;
                border-bottom: 1px solid #303030;
                
                & profile-icon {
                    padding: 1rem;
                    
                }
                & .info_container {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    padding: 1rem;
                    padding-left: 0;
                    gap: 0.5rem;
                    
                    & .heading {
                        display: flex;
                        justify-content: space-between;
                    }
                }
            }
            & .body {
                padding: 1rem;
                flex-grow: 1;

                overflow: scroll;
            }
            .message-form {
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding: 1rem;
                border-top: 1px solid #303030;
                
                .new-message & {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    max-height: 100%;
                }

                & shad-input-text {
                    display: none;
                    .new-message & {
                        display: block;
                    }
                }

                & textarea {
                    width: 100%;
                    border-radius: 8px;
                    border: 1px solid #303030;
                    background-color: black;
                    color: white;
                    outline: none;
                    resize: none;
                    padding: .5rem;
                    overflow: auto;
                    min-height: 4rem;
                    max-height: 45vh;

                    .new-message & {
                        max-height: none;
                    }

                    &:focus {
                        border-color: white;
                    }
                }
                & .submit_container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    
                    & shad-input-toggle {
                        font-size: 0.85rem;
                        color: #696969;

                        &[checked] {
                            color: white;
                        }
                    }
                    & #send_message {
                    
                    }
                } 
            }
        }
        .header {
            position: relativ;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #303030;
            max-width: 100%;
            padding-inline: 1rem;
            min-height: 3rem;
        }
        
    </style>
   
    <div class="resize-container">
        <div class="nav_container">
            <div class="header">
                <div class="drop-down">c:</div>
            </div>
            <icon-nav>
                <svg data-name="Inbox" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-inbox mr-2 h-4 w-4">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
                <svg data-name="Drafts" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file mr-2 h-4 w-4">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                </svg>
                <svg data-name="Sent" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send mr-2 h-4 w-4">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                </svg>
                <svg data-name="Junk" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive-x mr-2 h-4 w-4">
                    <rect width="20" height="5" x="2" y="3" rx="1"></rect>
                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                    <path d="m9.5 17 5-5"></path><path d="m9.5 12 5 5"></path>
                </svg>  
                <svg data-name="Trash" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 h-4 w-4">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
                <svg data-name="Archive" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive mr-2 h-4 w-4">
                    <rect width="20" height="5" x="2" y="3" rx="1"></rect>
                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                    <path d="M10 12h4"></path>
                </svg>
                <svg data-name="Social" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round mr-2 h-4 w-4">
                    <path d="M18 21a8 8 0 0 0-16 0"></path>
                    <circle cx="10" cy="8" r="5"></circle>
                    <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path>
                </svg>
                <svg data-name="Updates" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert mr-2 h-4 w-4">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>      
                <svg data-name="Forums" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square mr-2 h-4 w-4">
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z"></path>
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                </svg>        
                <svg data-name="Shopping" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart mr-2 h-4 w-4">
                    <circle cx="8" cy="21" r="1">
                    </circle><circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
                <svg data-name="Promotions" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive mr-2 h-4 w-4">
                    <rect width="20" height="5" x="2" y="3" rx="1"></rect>
                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                    <path d="M10 12h4"></path>
                </svg>
    
            </icon-nav>
        </div>

        <div class="preview-window">
            <div class="header">
                <span class="title"></span>
                <div class="filter_options">sup</div>
            </div>
            <div class="content"></div>
            <div class="resize-handle">
                <div class="handle-icon">
                    <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5">
                        <path d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <div class="mail-display">
        <div class="header">
            <div class="toolbar left">
                <shad-button data-highlight-color="#303030" data-secondary-color="black">
                    <shad-tooltip>Archive</shad-tooltip>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive mr-2 h-4 w-4"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg>
                </shad-button>
                <shad-button data-highlight-color="#303030" data-secondary-color="black">
                    <shad-tooltip>Move to junk</shad-tooltip>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive-x mr-2 h-4 w-4"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="m9.5 17 5-5"></path><path d="m9.5 12 5 5"></path></svg>
                </shad-button>
                
                <shad-button data-highlight-color="#303030" data-secondary-color="black">
                    <shad-tooltip>Move to trash</shad-tooltip>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                </shad-button>
                <shad-button data-highlight-color="#303030" data-secondary-color="black">
                    <shad-tooltip>Snooze</shad-tooltip>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock h-4 w-4"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </shad-button>
            </div>
            <div class="toolbar right">
                <shad-button data-highlight-color="#303030" data-secondary-color="black">
                    <shad-tooltip>Reply</shad-tooltip>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-reply h-4 w-4"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                </shad-button>
                <shad-button data-highlight-color="#303030" data-secondary-color="black">
                    <shad-tooltip>Reply all</shad-tooltip>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-reply-all h-4 w-4"><polyline points="7 17 2 12 7 7"></polyline><polyline points="12 17 7 12 12 7"></polyline><path d="M22 18v-2a4 4 0 0 0-4-4H7"></path></svg>
                </shad-button>
                <shad-button data-highlight-color="#303030" data-secondary-color="black">
                    <shad-tooltip>Forward</shad-tooltip>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-forward h-4 w-4"><polyline points="15 17 20 12 15 7"></polyline><path d="M4 18v-2a4 4 0 0 1 4-4h12"></path></svg>
                </shad-button>
                <shad-button data-highlight-color="#303030" data-secondary-color="black">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </shad-button>
            </div>
        </div> 
        <div class="head">
            <profile-icon data-name=""></profile-icon>
            <div class="info_container">
                <div class="heading">
                    <span class="name"></span>
                    <span class="date"></span>
                </div>
                <div class="subject">&nbsp</div>
                <div class="reply-addr">&nbsp</div>
            </div>
        </div>
        <pre class="body"></pre>
        <form class="message-form" id="send-message-form" action="api/v1/messages/send" method="POST">
            <shad-input-text id="reply-addr-field" name="replyAddr" placeholder="Recipient" required></shad-input-text>
            <shad-input-text id="subject" name="subject" placeholder="Subject" value="default" required></shad-input-text>
            <input type="hidden" name="parentId" id="parent-id" />
            <input type="hidden" name="threadId" id="thread-id"/>
            <textarea id="reply" name="content" placeholder="Type your message here..." required></textarea>
            <div class="submit_container">
                <shad-input-toggle type="switch" id="new-message-toggle"> New message</shad-input-toggle>
                <shad-button id="send_message" type="submit">Send</shad-button>
            </div>
        </form>
    </div>
`;
class MailApp extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));

        this.navContainer = shadow.querySelector(".nav_container");
        this.nav = shadow.querySelector("icon-nav");
        this.display = shadow.querySelector(".mail-display");
        this.handle = shadow.querySelector(".resize-handle");
        this.initMessages();

        this.addEventListener("nav-entry-selected", this.handleNavSelection);
    }
    static get observedAttributes() {
        return ["logged-in"];
    }
    async attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) return;
        if (name == "logged-in") {
            if (newValue) {
                await this.getRecievedMessages("/api/v1/messages/recieved");
                this.getSentMessages();
            } else {
                this.initMessages();
            }
            this.nav.entries[0].dispatchEvent(new Event("click"));
            this.nav.entries[0].setAttribute("selected", true);
            this.displayMessagePreviews(this.recievedMessagePreviews); 
            this.clearReplyForm();
            this.selectedMessage = null;
            this.updateMessageDisplay();
        }
        
    }
    connectedCallback() {
        this.activateHandle();
        this.activateReplyForm();
        this.activateMessagePreviews(); 
    }

    initMessages() {
        this.selectedMessage = null;
        this.recievedMessagePreviews = [];
        this.sentMessagePreviews = [];
    }

    handleNavSelection = (event) => {
        const navEntry = event.detail;
        const title = this.shadowRoot.querySelector(".preview-window .header .title");
        title.textContent = navEntry.querySelector(".name").textContent;
        switch(title.textContent.toLowerCase()) {
            case "inbox":
                this.displayMessagePreviews(this.recievedMessagePreviews);
                break;
            case "sent":
                this.displayMessagePreviews(this.sentMessagePreviews);
                break;
        }
    }

    async updateMessageDisplay(messagePreview = this.selectedMessage) {
        const display = this.display;
        const profileIcon = display.querySelector("profile-icon");
        const name = messagePreview ? messagePreview.getAttribute("data-name") : " ";
        const subject = messagePreview ? messagePreview.getAttribute("data-subject") : " ";
        const replyAddr = messagePreview ? messagePreview.getAttribute("data-replyAddr") : " ";
        const content = messagePreview ? messagePreview.textContent : " ";
        
        const date = messagePreview ? this.formatDate(new Date(messagePreview.getAttribute("data-date"))) : this.formatDate(new Date());

        display.querySelector(".date").textContent = date;
        display.querySelector(".name").textContent = name;
        display.querySelector(".subject").textContent = subject;
        display.querySelector(".reply-addr").textContent = replyAddr;
        profileIcon.setAttribute("data-name", name);
        profileIcon.setInitials();
        
        if (messagePreview.getAttribute("data-parentId") == "null" || messagePreview.getAttribute("data-contentLoaded")) {
            display.querySelector(".body").textContent = content;
        } else {
            const threadContent = await this.getThreadContent();
            messagePreview.textContent = threadContent;
            display.querySelector(".body").textContent = threadContent;

            messagePreview.setAttribute("data-contentLoaded", true);
        }
       
    }
    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
    async getRecievedMessages(url) {
        try {
            const response = await fetch(url);
            const messages = await response.json();
            
            this.recievedMessagePreviews = messages.map(msg => this.makePreview(msg));
        } catch (error) {
            console.log(error);
        }
    }
    async getThreadContent(messagePreview = this.selectedMessage) {
        let content = "";
        try {
            const response = await fetch(`/api/v1/messages/thread?threadId=${messagePreview.getAttribute("data-threadId")}`);
            const messages = await response.json();
            messages.forEach(msg => {
                const sender = (msg.name == messagePreview.getAttribute("data-name")) ? msg.name : "you";
                const date = this.formatDate(new Date(msg.date));
                content += `Sent by ${sender}\nOn ${date}\n\n${msg.content}\n`;
                content += "-------------------------------\n\n";
            });
        } catch (error) {
            console.log(error);
            return "Unable to retrieve message thread";
        }
        return content;
    }
    getSentMessages() {
        fetch("/api/v1/messages/sent")
        .then(async (response) => {
            const messages = await response.json();
            this.sentMessagePreviews = messages.map(msg => this.makePreview(msg));
        }).catch(error => console.log(error));
    }

    displayMessagePreviews(messagePreviews) {
        const container = this.shadowRoot.querySelector(".preview-window .content");
        container.innerHTML = "";
        messagePreviews.forEach(preview => {
            container.appendChild(preview);
        });
    }
    activateMessagePreviews() {
        const container = this.shadowRoot.querySelector(".preview-window .content");
        // for (const preview of container.children) {
        //     preview.addEventListener("click", this.handlePreviewSelection);
        // }
        container.addEventListener("click", (event) => {
            const message_preview = event.target
            if (message_preview.tagName.toLowerCase() !== "message-preview") return;

            if (this.selectedMessage) {
                this.selectedMessage.removeAttribute("active");
            } 
            this.selectedMessage = message_preview;
            this.selectedMessage.setAttribute("active", true);
            this.updateMessageDisplay();
            this.updateReplyForm();
            
            const newMsgToggle = this.shadowRoot.getElementById("new-message-toggle");
            if (newMsgToggle.checked) {
                newMsgToggle.dispatchEvent(new Event("click"));
            }
        });
    }
    makePreview(messageQueryResult) {
        const msgPreview = document.createElement("message-preview");
        msgPreview.setAttribute("data-msgId", messageQueryResult.id);
        msgPreview.setAttribute("data-name", messageQueryResult.name);
        msgPreview.setAttribute("data-subject", messageQueryResult.subject);
        msgPreview.setAttribute("data-replyAddr", messageQueryResult.email);
        msgPreview.setAttribute("data-date", messageQueryResult.date);
        msgPreview.setAttribute("data-threadId", messageQueryResult.thread_id);
        msgPreview.setAttribute("data-parentId", messageQueryResult.parent_id);
        msgPreview.textContent = messageQueryResult.content;
        return msgPreview;
    }

    updateReplyForm(messageElement = this.selectedMessage) {
        const form = this.display.querySelector("#send-message-form");
        form.querySelector("#reply-addr-field").value = messageElement.getAttribute("data-replyAddr");
        form.querySelector("#parent-id").value = messageElement.getAttribute("data-msgId");
        form.querySelector("#thread-id").value = messageElement.getAttribute("data-threadId");
        form.querySelector("#subject").value = "Re: " + messageElement.subject.textContent;
    }
    clearReplyForm() {
        const form = this.display.querySelector("#send-message-form");
        form.querySelector("#reply-addr-field").value = "";
        form.querySelector("#parent-id").value = "";
        form.querySelector("#subject").value = "";
        form.querySelector("#thread-id").value = "";
    }
    activateReplyForm() {
        const form = this.display.querySelector("#send-message-form");
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            //TODO: if new-msg toggle checked, append selectedMessage text context
            const formData = new FormData(form);
            const urlEncodedData = new URLSearchParams(formData).toString();
        
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: urlEncodedData,
                });

                if (response.ok) {
                    form.reset();
                } else {
                    // Handle errors
                    alert('Failed to submit form');
                }
            } catch (error) {
                // Handle network errors
                alert('An error occurred while submitting the form');
            }
        });

        const textarea = this.shadowRoot.getElementById("reply");
        textarea.addEventListener("input", function() {
            this.style.height = "auto";
            this.style.height = `${this.scrollHeight}px`;
        });

        this.shadowRoot.getElementById("new-message-toggle")
        .addEventListener("change", (event) => {
            const display = this.shadowRoot.querySelector(".mail-display");
            if (event.target.checked) {
                display.classList.add("new-message");
                this.clearReplyForm();
            } else {
                display.classList.remove("new-message");
                this.updateReplyForm();
            }
        });
    }
    activateHandle() {
        this.handle.addEventListener("mousedown", (event) => {
            document.body.style.userSelect = "none";
            document.body.style.cursor = "ew-resize";
            this.handle.style.cursor = "ew-resize";
            document.addEventListener("mousemove", this.resize);
        });
        document.addEventListener("mouseup", this.disengageMouse);
        document.addEventListener("mouseout", this.disengageMouse);
    }
    activateReply() {
        
    }
    resize = (event) => {
        if (this.nav.hasAttribute("collapsed")) {
            this.navContainer.style.flexGrow = "0";
        } else {//${this.nav.widthThreshold}px
            this.nav.style.setProperty("width", `100%`);
            this.navContainer.style.flexGrow = "1";
        }

        const containerRect = this.getBoundingClientRect();

        const containerDistanceFromLeft = event.clientX - containerRect.left;
        const containerDistanceFromRight = containerRect.right - event.clientX; 

        const resizeContainer = this.shadowRoot.querySelector(".resize-container");
        if (containerDistanceFromRight > 312 && containerDistanceFromLeft > 350) {
            resizeContainer.style.width = `${containerDistanceFromLeft}px`;
            this.display.style.width = `${containerDistanceFromRight}px`;
        }  
    }
    disengageMouse = () => {
        this.nav.style.setProperty("width", `${this.nav.getBoundingClientRect().width}px`);
        this.navContainer.style.flexGrow = "0";
        document.body.style.cursor = "";
        this.handle.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", this.resize);
    }
}
customElements.define("mail-app", MailApp);

class MessagePreview extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    padding: 0.5rem;
                    gap: 0.5rem;
                    border: 1px solid #303030;
                    background-color: black;
                    border-radius: 8px;
                    color: #808080;

                    
                }
                :host([active]) {
                    background-color: #303030;
                }
                :host(:hover) {
                    background-color: #303030;
                    cursor: pointer;
                }
                * {
                    font-size: 0.75rem;
                }
                
                .header {
                    display: flex;
                    justify-content: space-between;

                    & .name {
                        font-size: 1rem;
                        color: white;
                    }
                }
                .subject {
                    color: white;
                }
                .body {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    
                    overflow: hidden;
                    line-height: 1.2em; 
                    height: calc(1.2em * 2);
                    
                    text-overflow: ellipsis;
                }
            </style>
            <div class="header">
                <span class="name"></span>
                <span class="date"></span>
            </div>
            <div class="subject"></div>
            <div class="body">
                <slot></slot>
            </div>
            <div class="tags">
                <span>work</span>
                <span>important</span>
            <div>
        `;
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
        this.name = shadow.querySelector(".name");
        this.subject = shadow.querySelector(".subject");
        this.date = shadow.querySelector(".date");
    }
    connectedCallback() {
        this.name.textContent = this.getAttribute("data-name");
        this.subject.textContent = this.getAttribute("data-subject");
        this.date.textContent = this.timeAgo();
    }
    timeAgo() {
        const now = new Date();
        const past = new Date(this.getAttribute("data-date"));
        const seconds = Math.round((past - now) / 1000);
    
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    
        const units = [
            { name: 'year', value: 31536000 },
            { name: 'month', value: 2592000 },
            { name: 'week', value: 604800 },
            { name: 'day', value: 86400 },
            { name: 'hour', value: 3600 },
            { name: 'minute', value: 60 },
            { name: 'second', value: 1 }
        ];
    
        for (const unit of units) {
            if (Math.abs(seconds) >= unit.value) {
                const count = Math.round(seconds / unit.value);
                return rtf.format(count, unit.name);
            }
        }
    
        return 'just now';
    }
}
customElements.define("message-preview", MessagePreview);
